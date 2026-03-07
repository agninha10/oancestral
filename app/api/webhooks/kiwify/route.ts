/**
 * Kiwify Webhook Handler
 * POST /api/webhooks/kiwify
 *
 * Kiwify sends a POST with JSON body for every order event.
 * Security: token is sent in the `?token=` query param AND in
 *           body.kiwify_access_token — both are checked against
 *           KIWIFY_WEBHOOK_TOKEN env var.
 *
 * Env vars required:
 *   KIWIFY_WEBHOOK_TOKEN           — secret token from Kiwify dashboard
 *   KIWIFY_LIVRO_ANCESTRAL_PRODUCT_ID
 *   KIWIFY_JEJUM_PRODUCT_ID
 *   KIWIFY_MENSAL_PRODUCT_ID
 *   KIWIFY_ANUAL_PRODUCT_ID
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// ── Product ID → configuration mapping ───────────────────────────────────────
type ProductConfig = {
  product: "livro-ancestral" | "jejum" | "mensal" | "anual";
  frequency: string;
  amount: number; // centavos (fallback if not in payload)
  /** Days to add to subscription. null = ebook only (no portal access granted). */
  daysToAdd: number | null;
};

function resolveProduct(productId: string): ProductConfig | null {
  const map: Record<string, ProductConfig> = {};

  const livroId = process.env.KIWIFY_LIVRO_ANCESTRAL_PRODUCT_ID;
  const jejumId = process.env.KIWIFY_JEJUM_PRODUCT_ID;
  const mensalId = process.env.KIWIFY_MENSAL_PRODUCT_ID;
  const anualId = process.env.KIWIFY_ANUAL_PRODUCT_ID;

  if (livroId) map[livroId] = { product: "livro-ancestral", frequency: "one_time", amount: 4900, daysToAdd: 36500 };
  if (jejumId) map[jejumId] = { product: "jejum", frequency: "one_time", amount: 2990, daysToAdd: null };
  if (mensalId) map[mensalId] = { product: "mensal", frequency: "monthly", amount: 2900, daysToAdd: 35 };
  if (anualId) map[anualId] = { product: "anual", frequency: "yearly", amount: 19000, daysToAdd: 370 };

  return map[productId] ?? null;
}

// ── Kiwify payload shape ──────────────────────────────────────────────────────
interface KiwifyPayload {
  order_id: string;
  order_status: "paid" | "waiting_payment" | "refused" | "refunded" | "chargedback";
  product_id?: string;
  product?: { id?: string; name?: string };
  customer: { name: string; email: string; phone?: string };
  subscription?: { id?: string; charge_frequency?: string; status?: string };
  amount?: number; // centavos
  kiwify_access_token?: string;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const secret = process.env.KIWIFY_WEBHOOK_TOKEN;

    // 1. Parse body
    const payload: KiwifyPayload = await req.json();

    // 2. Validate token (query param OR body field)
    const url = new URL(req.url);
    const queryToken = url.searchParams.get("token");
    const bodyToken = payload.kiwify_access_token;

    const isValid =
      secret &&
      ((queryToken && queryToken === secret) ||
        (bodyToken && bodyToken === secret));

    if (!isValid) {
      console.warn("[KIWIFY WEBHOOK] Unauthorized — token mismatch");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { order_id, order_status, customer } = payload;

    if (!order_id) {
      console.warn("[KIWIFY WEBHOOK] Missing order_id");
      return NextResponse.json({ received: true });
    }

    console.log(`[KIWIFY WEBHOOK] order=${order_id} status=${order_status} email=${customer?.email}`);

    // Log full payload in non-production for debugging
    if (process.env.NODE_ENV !== "production") {
      console.log("[KIWIFY WEBHOOK] Full payload:", JSON.stringify(payload, null, 2));
    } else {
      // In production, log just the key fields to help identify product_id format
      console.log("[KIWIFY WEBHOOK] product_id fields:", {
        product_id: payload.product_id,
        product_dot_id: payload.product?.id,
        product_dot_name: payload.product?.name,
      });
    }

    // 3. Resolve product
    const rawProductId = payload.product_id ?? payload.product?.id ?? "";
    const config = resolveProduct(rawProductId);

    if (!config) {
      console.warn(
        `[KIWIFY WEBHOOK] Unknown product_id="${rawProductId}" — transaction will be saved without product mapping. ` +
        `Expected one of: ${[
          process.env.KIWIFY_LIVRO_ANCESTRAL_PRODUCT_ID,
          process.env.KIWIFY_JEJUM_PRODUCT_ID,
          process.env.KIWIFY_MENSAL_PRODUCT_ID,
          process.env.KIWIFY_ANUAL_PRODUCT_ID,
        ].filter(Boolean).join(", ")}`
      );
    }

    // 4. Handle by status
    switch (order_status) {
      case "paid": {
        await handlePaid(order_id, payload, config);
        break;
      }

      case "waiting_payment": {
        // PIX or boleto awaiting confirmation — nothing to do yet
        console.log(`[KIWIFY WEBHOOK] Waiting payment for order ${order_id}`);
        break;
      }

      case "refused": {
        await markTransactionFailed(order_id);
        break;
      }

      case "refunded":
      case "chargedback": {
        await handleRevocation(order_id, customer.email, order_status);
        break;
      }

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

async function findOrCreateUser(customer: KiwifyPayload["customer"]) {
  const email = customer.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  // User bought directly via Kiwify without going through our checkout form
  const tempPassword = crypto.randomBytes(32).toString("hex");
  const hashedPassword = await bcrypt.hash(tempPassword, 12);

  return prisma.user.create({
    data: {
      email,
      name: customer.name?.trim() || "Cliente",
      password: hashedPassword,
      whatsapp: customer.phone?.replace(/\D/g, "") || null,
      birthdate: new Date(),
    },
  });
}

async function handlePaid(
  orderId: string,
  payload: KiwifyPayload,
  config: ProductConfig | null
) {
  const user = await findOrCreateUser(payload.customer);
  const amount = payload.amount ?? config?.amount ?? 0;
  const frequency = config?.frequency ?? payload.subscription?.charge_frequency ?? "one_time";
  const product = config?.product ?? null;

  // Upsert transaction
  await prisma.transaction.upsert({
    where: { billingId: orderId },
    update: { status: "PAID", amount },
    create: {
      userId: user.id,
      billingId: orderId,
      amount,
      frequency,
      status: "PAID",
      source: "KIWIFY",
      product,
    },
  });

  // Grant portal access if applicable
  if (config?.daysToAdd !== null && config?.daysToAdd !== undefined) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "ACTIVE",
        subscriptionEndDate: addDays(new Date(), config.daysToAdd),
      },
    });
    console.log(
      `[KIWIFY WEBHOOK] Access granted to ${user.email} for ${config.daysToAdd} days (${product})`
    );
  } else {
    console.log(
      `[KIWIFY WEBHOOK] Ebook purchased by ${user.email} (${product}) — no portal access change`
    );
  }
}

async function markTransactionFailed(orderId: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { billingId: orderId },
  });
  if (!transaction) return;

  await prisma.transaction.update({
    where: { billingId: orderId },
    data: { status: "FAILED" },
  });
}

async function handleRevocation(
  orderId: string,
  email: string,
  reason: "refunded" | "chargedback"
) {
  const normalizedEmail = email.trim().toLowerCase();

  // Mark transaction
  const transaction = await prisma.transaction.findUnique({
    where: { billingId: orderId },
  });

  if (transaction) {
    await prisma.transaction.update({
      where: { billingId: orderId },
      data: { status: reason === "chargedback" ? "FAILED" : "CANCELED" },
    });
  }

  // Revoke access — only if no other active paid transactions exist
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) return;

  const otherActivePaid = await prisma.transaction.findFirst({
    where: {
      userId: user.id,
      status: "PAID",
      billingId: { not: orderId },
      product: { in: ["livro-ancestral", "mensal", "anual"] },
    },
  });

  if (!otherActivePaid) {
    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: "FREE" },
    });
    console.warn(
      `[KIWIFY WEBHOOK] Access revoked for ${normalizedEmail} — reason: ${reason}`
    );
  }
}
