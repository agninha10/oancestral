import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { buildKiwifyCheckoutUrl, type KiwifyProduct } from "@/lib/kiwify";
import { generateVerificationCode, sendWelcomeCheckoutEmail } from "@/lib/auth/email";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const VALID_PRODUCTS: KiwifyProduct[] = ["livro-ancestral", "jejum", "mensal", "anual"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product, name, email, phone } = body as {
      product: KiwifyProduct;
      name: string;
      email: string;
      phone?: string;
    };

    // ── Validate input ──────────────────────────────────────────────────────
    if (!product || !VALID_PRODUCTS.includes(product)) {
      return NextResponse.json({ error: "Produto inválido." }, { status: 400 });
    }
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    // ── Build Kiwify URL early (fail fast if env not configured) ────────────
    const kiwifyUrl = buildKiwifyCheckoutUrl(product, {
      name: normalizedName,
      email: normalizedEmail,
      phone: phone?.trim(),
    });

    if (!kiwifyUrl) {
      console.error(`[KIWIFY] URL not configured for product: ${product}`);
      return NextResponse.json(
        { error: "Checkout temporariamente indisponível. Tente novamente em instantes." },
        { status: 503 }
      );
    }

    // ── Resolve user (logged-in > existing > create) ────────────────────────
    const loggedInUserId = await getUserId();

    if (!loggedInUserId) {
      const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true },
      });

      if (!existing) {
        // Create a passwordless account:
        //  - Random secure password (user sets their own via "forgot password")
        //  - 6-digit verification code stored in verificationToken
        //  - Welcome email sent immediately
        const tempPassword = crypto.randomBytes(32).toString("hex");
        const hashedPassword = await bcrypt.hash(tempPassword, 12);
        const verificationCode = generateVerificationCode();

        await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: normalizedName,
            password: hashedPassword,
            whatsapp: phone?.replace(/\D/g, "") || null,
            birthdate: new Date(),
            verificationToken: verificationCode,
            verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
          },
        });

        // Fire-and-forget — don't block the redirect on email delivery
        sendWelcomeCheckoutEmail(normalizedEmail, normalizedName, verificationCode).catch(
          (err) => console.error("[KIWIFY] Welcome email failed:", err)
        );

        console.log(`[KIWIFY] New user created at checkout: ${normalizedEmail}`);
      }
    }

    return NextResponse.json({ url: kiwifyUrl });
  } catch (error) {
    console.error("[KIWIFY_CHECKOUT]", error);
    return NextResponse.json(
      { error: "Erro ao processar. Tente novamente." },
      { status: 500 }
    );
  }
}
