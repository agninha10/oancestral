/**
 * Kiwify Webhook Handler
 * POST /api/webhooks/kiwify
 *
 * Kiwify real payload uses PascalCase keys:
 *   Customer.email, Customer.full_name, Customer.mobile
 *   Product.id, Product.name
 *   Subscription.charge_frequency
 *   order_value  (centavos)
 *   kiwify_access_token  (body token)
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

// ── Kiwify real payload shape ─────────────────────────────────────────────────
interface KiwifyPayload {
  order_id:     string;
  order_status: "paid" | "waiting_payment" | "refused" | "refunded" | "chargedback";
  order_value?: number;
  payment_method?: string;
  charge_type?: string;

  // PascalCase — real Kiwify format
  Customer?: {
    full_name?: string;
    email?:     string;
    mobile?:    string;
    CPF?:       string;
  };
  Product?: {
    id?:   string;
    name?: string;
  };
  Subscription?: {
    id?:               string;
    charge_frequency?: string;
    status?:           string;
  };

  kiwify_access_token?: string;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const secret = process.env.KIWIFY_WEBHOOK_TOKEN;

    // 1. Parse body
    const payload: KiwifyPayload = await req.json();

    // 2. Validate token
    const url = new URL(req.url);
    const queryToken = url.searchParams.get("token");
    const bodyToken  = payload.kiwify_access_token;

    const isValid =
      secret &&
      ((queryToken && queryToken === secret) ||
       (bodyToken  && bodyToken  === secret));

    if (!isValid) {
      console.warn("[KIWIFY WEBHOOK] Unauthorized — token mismatch");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { order_id, order_status } = payload;

    if (!order_id) {
      console.warn("[KIWIFY WEBHOOK] Missing order_id");
      return NextResponse.json({ received: true });
    }

    // Always log the full payload so we can inspect the real structure
    console.log("[KIWIFY WEBHOOK] Received:", JSON.stringify({
      order_id,
      order_status,
      order_value: payload.order_value,
      Customer:    payload.Customer,
      Product:     payload.Product,
      Subscription: payload.Subscription,
    }, null, 2));

    const email     = payload.Customer?.email?.trim().toLowerCase();
    const productId = payload.Product?.id ?? "";
    const config    = resolveProduct(productId);

    console.log(`[KIWIFY WEBHOOK] order=${order_id} status=${order_status} email=${email} product_id=${productId} resolved=${config?.product ?? "UNKNOWN"}`);

    if (!config) {
      console.warn(
        `[KIWIFY WEBHOOK] Unknown Product.id="${productId}". ` +
        `Configured IDs: livro=${process.env.KIWIFY_LIVRO_ANCESTRAL_PRODUCT_ID} jejum=${process.env.KIWIFY_JEJUM_PRODUCT_ID} mensal=${process.env.KIWIFY_MENSAL_PRODUCT_ID} anual=${process.env.KIWIFY_ANUAL_PRODUCT_ID}`
      );
    }

    // 3. Handle by status
    switch (order_status) {
      case "paid":
        await handlePaid(order_id, payload, config);
        break;

      case "waiting_payment":
        console.log(`[KIWIFY WEBHOOK] Awaiting payment for order ${order_id}`);
        break;

      case "refused":
        await markTransactionFailed(order_id);
        break;

      case "refunded":
      case "chargedback":
        if (email) {
          await handleRevocation(order_id, email, order_status);
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

// ── Helpers ───────────────────────────────────────────────────────────────────

async function findOrCreateUser(payload: KiwifyPayload) {
  const email = payload.Customer?.email?.trim().toLowerCase();
  if (!email) throw new Error("Customer email is missing from Kiwify payload");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  const name = payload.Customer?.full_name?.trim() || "Cliente";
  const phone = payload.Customer?.mobile?.replace(/\D/g, "") || null;

  const tempPassword = crypto.randomBytes(32).toString("hex");
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

async function handlePaid(
  orderId: string,
  payload: KiwifyPayload,
  config: ProductConfig | null
) {
  const user = await findOrCreateUser(payload);

  const amount    = payload.order_value ?? config?.amount ?? 0;
  const frequency = config?.frequency ?? payload.Subscription?.charge_frequency ?? "one_time";
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
    console.log(`[KIWIFY WEBHOOK] Access granted to ${user.email} for ${config.daysToAdd} days (${product})`);
  } else {
    console.log(`[KIWIFY WEBHOOK] Ebook purchased by ${user.email} (${product ?? "unknown"}) — no portal access change`);
  }
}

async function markTransactionFailed(orderId: string) {
  const tx = await prisma.transaction.findUnique({ where: { billingId: orderId } });
  if (!tx) return;
  await prisma.transaction.update({ where: { billingId: orderId }, data: { status: "FAILED" } });
}

async function handleRevocation(
  orderId: string,
  email: string,
  reason: "refunded" | "chargedback"
) {
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
    console.warn(`[KIWIFY WEBHOOK] Access revoked for ${email} — reason: ${reason}`);
  }
}
