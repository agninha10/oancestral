/**
 * POST /api/admin/grant-access
 * Endpoint restrito a ADMINs para registrar manualmente uma venda Kiwify
 * e liberar o acesso do cliente ao portal.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { addDays } from "date-fns";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const PRODUCT_CONFIG: Record<
  string,
  { frequency: string; amount: number; daysToAdd: number | null }
> = {
  "livro-ancestral": { frequency: "one_time", amount: 4900, daysToAdd: 36500 },
  jejum:             { frequency: "one_time", amount: 2990, daysToAdd: null },
  mensal:            { frequency: "monthly",  amount: 2900, daysToAdd: 35 },
  anual:             { frequency: "yearly",   amount: 19000, daysToAdd: 370 },
};

export async function POST(req: Request) {
  // Only admins
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { name, email, phone, product, orderId, amount: customAmount } = body;

  if (!email || !product) {
    return NextResponse.json({ error: "Email e produto são obrigatórios" }, { status: 400 });
  }

  const config = PRODUCT_CONFIG[product];
  if (!config) {
    return NextResponse.json({ error: "Produto inválido" }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const billingId = orderId?.trim() || `MANUAL-${Date.now()}`;
  const amount = customAmount ? Number(customAmount) : config.amount;

  // Find or create user
  let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user) {
    const tempPassword = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 12);
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: String(name || "Cliente").trim(),
        password: hashedPassword,
        whatsapp: phone ? String(phone).replace(/\D/g, "") : null,
        birthdate: new Date(),
      },
    });
  }

  // Upsert transaction
  await prisma.transaction.upsert({
    where: { billingId },
    update: { status: "PAID", amount },
    create: {
      userId: user.id,
      billingId,
      amount,
      frequency: config.frequency,
      status: "PAID",
      source: "KIWIFY",
      product,
    },
  });

  // Grant portal access if applicable
  if (config.daysToAdd !== null) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "ACTIVE",
        subscriptionEndDate: addDays(new Date(), config.daysToAdd),
      },
    });
  }

  return NextResponse.json({
    ok: true,
    message: `Acesso concedido para ${normalizedEmail}`,
    userId: user.id,
    billingId,
    product,
    daysAdded: config.daysToAdd,
  });
}
