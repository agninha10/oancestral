/**
 * Endpoint de DESENVOLVIMENTO para simular um webhook Kiwify.
 * Bloqueado em produção.
 *
 * POST /api/webhooks/kiwify/test
 * Body: { email, name, product, phone?, orderId? }
 */

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    email   = "teste@exemplo.com",
    name    = "Cliente Teste",
    product = "livro-ancestral",
    phone   = "11999999999",
    orderId,
  } = body;

  const productIdMap: Record<string, string | undefined> = {
    "livro-ancestral": process.env.KIWIFY_LIVRO_ANCESTRAL_PRODUCT_ID,
    "jejum":           process.env.KIWIFY_JEJUM_PRODUCT_ID,
    "mensal":          process.env.KIWIFY_MENSAL_PRODUCT_ID,
    "anual":           process.env.KIWIFY_ANUAL_PRODUCT_ID,
  };

  const productId = productIdMap[product] ?? "unknown_product";
  const token     = process.env.KIWIFY_WEBHOOK_TOKEN ?? "test_token";
  const order_id  = orderId ?? `TEST-${Date.now()}`;

  // Simulate real Kiwify PascalCase payload
  const simulatedPayload = {
    order_id,
    order_status: "paid",
    order_value:  product === "anual" ? 19000 : product === "mensal" ? 2900 : 4900,
    Customer: {
      full_name: name,
      email,
      mobile:    phone,
    },
    Product: {
      id:   productId,
      name: product,
    },
    kiwify_access_token: token,
  };

  const baseUrl    = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/kiwify?token=${token}`;

  const response = await fetch(webhookUrl, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(simulatedPayload),
  });

  const result = await response.json().catch(() => ({}));

  return NextResponse.json({
    ok:              response.ok,
    status:          response.status,
    webhookUrl,
    sentPayload:     simulatedPayload,
    webhookResponse: result,
  });
}
