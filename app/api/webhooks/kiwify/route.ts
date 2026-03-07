/**
 * Kiwify Webhook Handler
 * POST /api/webhooks/kiwify
 *
 * Kiwify real payload (confirmed from test):
 *   Customer.full_name, Customer.email, Customer.mobile
 *   Product.product_id  (UUID, NOT the URL slug)
 *   Product.product_name
 *   Subscription.charges.completed[0].amount  (centavos)
 *   kiwify_access_token (body token)
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// ── Product config map ────────────────────────────────────────────────────────
type ProductConfig = {
  product: "livro-ancestral" | "jejum" | "mensal" | "anual";
  frequency: string;
  amount: number;
  daysToAdd: number | null;
};

function resolveProduct(productId: string): ProductConfig | null {
  if (!productId) return null;
  const map: Record<string, ProductConfig> = {};

  const livroId  = process.env.KIWIFY_LIVRO_ANCESTRAL_PRODUCT_ID;
  const jejumId  = process.env.KIWIFY_JEJUM_PRODUCT_ID;
  const mensalId = process.env.KIWIFY_MENSAL_PRODUCT_ID;
  const anualId  = process.env.KIWIFY_ANUAL_PRODUCT_ID;

  if (livroId)  map[livroId]  = { product: "livro-ancestral", frequency: "one_time", amount: 4900,  daysToAdd: 36500 };
  if (jejumId)  map[jejumId]  = { product: "jejum",           frequency: "one_time", amount: 2990,  daysToAdd: null  };
  if (mensalId) map[mensalId] = { product: "mensal",          frequency: "monthly",  amount: 2900,  daysToAdd: 35    };
  if (anualId)  map[anualId]  = { product: "anual",           frequency: "yearly",   amount: 19000, daysToAdd: 370   };

  return map[productId] ?? null;
}

// ── Kiwify real payload shape (confirmed from test webhook) ───────────────────
interface KiwifyCharge {
  order_id:         string;
  amount:           number;
  status:           string;
  installments?:    number;
  card_type?:       string;
  card_last_digits?: string;
  created_at?:      string;
}

interface KiwifyPayload {
  order_id:     string;
  order_status: "paid" | "waiting_payment" | "refused" | "refunded" | "chargedback";

  Customer?: {
    full_name?:  string;
    first_name?: string;
    email?:      string;
    mobile?:     string;
    CPF?:        string;
  };

  Product?: {
    product_id?:   string; // Real UUID from Kiwify (NOT the URL slug)
    product_name?: string;
  };

  Subscription?: {
    id?:            string;
    status?:        string;
    plan?: {
      id?:        string;
      name?:      string;
      frequency?: string; // "monthly", "yearly", "weekly", etc.
    };
    charges?: {
      completed?: KiwifyCharge[];
    };
  };

  kiwify_access_token?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extract the paid amount from the payload (centavos) */
function extractAmount(payload: KiwifyPayload, fallback: number): number {
  const completed = payload.Subscription?.charges?.completed;
  if (completed && completed.length > 0) {
    const charge = completed.find((c) => c.order_id === payload.order_id) ?? completed[0];
    if (charge?.amount) return charge.amount;
  }
  return fallback;
}

async function findOrCreateUser(payload: KiwifyPayload) {
  const email = payload.Customer?.email?.trim().toLowerCase();
  if (!email) throw new Error("Customer email is missing from Kiwify payload");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  const name  = payload.Customer?.full_name?.trim() || payload.Customer?.first_name?.trim() || "Cliente";
  const phone = payload.Customer?.mobile?.replace(/\D/g, "") || null;

  const tempPassword   = crypto.randomBytes(32).toString("hex");
  const hashedPassword = await bcrypt.hash(tempPassword, 12);

  return prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      whatsapp: phone,
      birthdate: new Date(),
    },
  });
}

async function handlePaid(orderId: string, payload: KiwifyPayload, config: ProductConfig | null) {
  const user      = await findOrCreateUser(payload);
  const amount    = extractAmount(payload, config?.amount ?? 0);
  const frequency = config?.frequency ?? payload.Subscription?.plan?.frequency ?? "one_time";
  const product   = config?.product ?? null;

  await prisma.transaction.upsert({
    where:  { billingId: orderId },
    update: { status: "PAID", amount },
    create: {
      userId:    user.id,
      billingId: orderId,
      amount,
      frequency,
      status:    "PAID",
      source:    "KIWIFY",
      product,
    },
  });

  if (config?.daysToAdd != null) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus:  "ACTIVE",
        subscriptionEndDate: addDays(new Date(), config.daysToAdd),
      },
    });
    console.log(`[KIWIFY WEBHOOK] ✅ Access granted to ${user.email} for ${config.daysToAdd} days (${product})`);
  } else {
    console.log(`[KIWIFY WEBHOOK] 📦 Ebook purchased by ${user.email} (${product ?? "unknown product"}) — no portal access change`);
  }
}

async function markTransactionFailed(orderId: string) {
  const tx = await prisma.transaction.findUnique({ where: { billingId: orderId } });
  if (!tx) return;
  await prisma.transaction.update({ where: { billingId: orderId }, data: { status: "FAILED" } });
}

async function handleRevocation(orderId: string, email: string, reason: "refunded" | "chargedback") {
  const tx = await prisma.transaction.findUnique({ where: { billingId: orderId } });
  if (tx) {
    await prisma.transaction.update({
      where: { billingId: orderId },
      data:  { status: reason === "chargedback" ? "FAILED" : "CANCELED" },
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const otherActive = await prisma.transaction.findFirst({
    where: {
      userId:    user.id,
      status:    "PAID",
      billingId: { not: orderId },
      product:   { in: ["livro-ancestral", "mensal", "anual"] },
    },
  });

  if (!otherActive) {
    await prisma.user.update({ where: { id: user.id }, data: { subscriptionStatus: "FREE" } });
    console.warn(`[KIWIFY WEBHOOK] 🔒 Access revoked for ${email} — reason: ${reason}`);
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const secret = process.env.KIWIFY_WEBHOOK_TOKEN;

    // 1. Parse body
    const payload: KiwifyPayload = await req.json();

    // 2. Validate token
    const url        = new URL(req.url);
    const queryToken = url.searchParams.get("token");
    const bodyToken  = payload.kiwify_access_token;

    const isValid =
      secret &&
      ((queryToken && queryToken === secret) ||
       (bodyToken  && bodyToken  === secret));

    if (!isValid) {
      console.warn("[KIWIFY WEBHOOK] ❌ Unauthorized — token mismatch");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { order_id, order_status } = payload;

    if (!order_id) {
      console.warn("[KIWIFY WEBHOOK] Missing order_id");
      return NextResponse.json({ received: true });
    }

    // Log always — useful to capture real product UUIDs
    const productId = payload.Product?.product_id ?? "";
    const email     = payload.Customer?.email;
    const config    = resolveProduct(productId);

    console.log(`[KIWIFY WEBHOOK] order=${order_id} status=${order_status} email=${email} Product.product_id="${productId}" → ${config?.product ?? "UNKNOWN"}`);

    if (!config && productId) {
      console.warn(
        `[KIWIFY WEBHOOK] ⚠️  Product UUID "${productId}" not mapped. ` +
        `Update env var: KIWIFY_LIVRO_ANCESTRAL_PRODUCT_ID="${productId}" (if this is the livro product) — or the correct var for this product.`
      );
    }

    // 3. Handle by status
    switch (order_status) {
      case "paid":
        await handlePaid(order_id, payload, config);
        break;

      case "waiting_payment":
        console.log(`[KIWIFY WEBHOOK] ⏳ Awaiting payment for order ${order_id}`);
        break;

      case "refused":
        await markTransactionFailed(order_id);
        break;

      case "refunded":
      case "chargedback":
        if (email) {
          await handleRevocation(order_id, email.trim().toLowerCase(), order_status);
        } else {
          console.warn(`[KIWIFY WEBHOOK] Cannot revoke — no customer email for order ${order_id}`);
        }
        break;

      default:
        console.log(`[KIWIFY WEBHOOK] Unhandled status: ${order_status}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[KIWIFY WEBHOOK] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
