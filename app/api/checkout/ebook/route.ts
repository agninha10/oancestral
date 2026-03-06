import { NextResponse } from "next/server";
import { createEbookPayment } from "@/lib/abacate";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, cellphone, taxId } = body;

    if (!name?.trim() || !email?.trim() || !cellphone?.trim() || !taxId?.trim()) {
      return NextResponse.json(
        { error: "Nome, e-mail, WhatsApp e CPF são obrigatórios." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "E-mail inválido." },
        { status: 400 }
      );
    }

    console.log("[CHECKOUT-EBOOK] Processing:", { name, email });

    const billing = await createEbookPayment({
      email: email.trim().toLowerCase(),
      name: name.trim(),
      cellphone: cellphone?.trim(),
      taxId: taxId?.trim(),
    });

    if (!billing || !billing.url) {
      console.error("[CHECKOUT-EBOOK] Invalid billing response:", billing);
      return NextResponse.json(
        { error: "Erro ao gerar link de pagamento. Tente novamente." },
        { status: 500 }
      );
    }

    console.log("[CHECKOUT-EBOOK] Payment URL:", billing.url);

    return NextResponse.json({ url: billing.url });
  } catch (error) {
    console.error("[CHECKOUT-EBOOK] Error:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento. Tente novamente." },
      { status: 500 }
    );
  }
}
