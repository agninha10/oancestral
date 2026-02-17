import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { createSubscription } from "@/lib/abacate";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // 1. Verificar se há usuário logado
    const userId = await getUserId();
    
    // 2. Obter o plano escolhido e dados do formulário
    const body = await req.json();
    const { frequency = "monthly", name, email, cellphone, taxId, password } = body;

    // 3. Validar frequência
    if (frequency !== "monthly" && frequency !== "yearly") {
      return new NextResponse("Invalid frequency", { status: 400 });
    }

    // 4. Validar dados obrigatórios
    if (!name || !email || !cellphone) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let user;

    if (userId) {
      // Usuário logado - buscar do banco
      user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return new NextResponse("User not found", { status: 404 });
      }
    } else {
      // Usuário não logado - verificar se já existe ou criar novo
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        // Usuário já existe - usar os dados existentes
        user = existingUser;
      } else {
        // Criar novo usuário
        if (!password) {
          return new NextResponse("Password required for new users", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        user = await prisma.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
            whatsapp: cellphone,
            birthdate: new Date(), // Data padrão - pode ser atualizada depois
            role: "USER",
            subscriptionStatus: "FREE",
          },
        });

        console.log("[CHECKOUT] New user created:", user.id);
      }
    }

    // 5. Criar a cobrança usando o SDK
    console.log("[CHECKOUT] Processing checkout for:", {
      userId: user.id,
      email: user.email,
      name,
      cellphone,
      taxId: taxId ? "***" : undefined,
    });

    let billing;
    try {
      billing = await createSubscription({
        email: user.email,
        name,
        cellphone,
        taxId,
        frequency,
      });

      // Debug: Ver a resposta completa
      console.log("[CHECKOUT] Billing response:", JSON.stringify(billing, null, 2));
    } catch (billingError) {
      console.error("[CHECKOUT] Billing creation error:", billingError);
      return NextResponse.json(
        { error: "Erro ao criar pagamento. Tente novamente." },
        { status: 500 }
      );
    }

    if (!billing || !billing.id) {
      console.error("[CHECKOUT] Invalid billing response - missing ID");
      return NextResponse.json(
        { error: "Erro ao criar pagamento. Resposta inválida." },
        { status: 500 }
      );
    }

    // 6. Salvar transação no banco de dados
    const amount = frequency === "yearly" ? 19000 : 2900;
    
    let transaction;
    try {
      transaction = await prisma.transaction.create({
        data: {
          userId: user.id,
          billingId: billing.id,
          amount,
          frequency,
          status: "PENDING",
          paymentUrl: billing.url,
        },
      });

      console.log("[CHECKOUT] Transaction created:", transaction.id);
    } catch (transactionError) {
      console.error("[CHECKOUT] Transaction creation error:", transactionError);
      return NextResponse.json(
        { error: "Erro ao salvar transação. Tente novamente." },
        { status: 500 }
      );
    }

    // 7. Retornar a URL de pagamento
    console.log("[CHECKOUT] Returning URL:", billing.url);
    
    return NextResponse.json({ url: billing.url });

  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
