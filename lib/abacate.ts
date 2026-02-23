import AbacatePay from "abacatepay-nodejs-sdk";

// Inicializa o SDK com a chave do .env
export const abacate = AbacatePay(process.env.ABACATE_API_KEY!);

/**
 * Função helper para criar o cliente e a cobrança em um passo só (Vibe Code)
 */
export async function createSubscription({
  email,
  name,
  taxId, // CPF/CNPJ (Opcional, mas bom para Pix)
  cellphone, // WhatsApp para notificações
  frequency = "monthly", // Plano: monthly ou yearly (minúsculos)
}: {
  email: string;
  name: string;
  taxId?: string;
  cellphone?: string;
  frequency?: string;
}) {
  try {
    // Limpar o número de telefone - remover +55 e formatar
    let formattedCellphone = cellphone;
    if (cellphone) {
      // Remover +55 do início se existir
      formattedCellphone = cellphone.replace(/^\+55\s*/, '');
      // Formatar para (XX) XXXXX-XXXX se ainda não estiver formatado
      const digitsOnly = formattedCellphone.replace(/\D/g, '');
      if (digitsOnly.length === 11) {
        formattedCellphone = `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 7)}-${digitsOnly.slice(7)}`;
      }
      console.log("[ABACATE] Phone formatting: ", cellphone, "→", formattedCellphone);
    }

    // Definir preço e produto baseado no plano escolhido
    const planConfig = {
      monthly: {
        externalId: "plano-ancestral-mensal",
        name: "Assinatura Mensal - Clã Ancestral",
        price: 2900, // R$ 29,00 em centavos
      },
      yearly: {
        externalId: "plano-ancestral-anual",
        name: "Assinatura Anual - Clã Ancestral",
        price: 19000, // R$ 190,00 em centavos (economiza 45%)
      },
    };

    const plan = planConfig[frequency as keyof typeof planConfig];

    // Mapear frequência para o formato correto da API Abacate
    const apiFrequency = frequency === "monthly" ? "MONTHLY" : "ONE_TIME";

    const billingData = {
      frequency: apiFrequency, // MONTHLY para mensal, ONE_TIME para anual
      methods: ["PIX"], // Apenas PIX disponível
      products: [
        {
          externalId: plan.externalId,
          name: plan.name,
          quantity: 1,
          price: plan.price,
        },
      ],
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sucesso`,
      completionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sucesso`,
      customer: {
        name,
        email,
        ...(formattedCellphone && { cellphone: formattedCellphone }),
        ...(taxId && { taxId }),
      },
    };

    console.log("[ABACATE] Creating billing with:", billingData);
    console.log("[ABACATE] API Key:", process.env.ABACATE_API_KEY?.substring(0, 15) + "...");

    // Fazer um teste direto da API para debug
    const testResponse = await fetch("https://api.abacatepay.com/v1/billing/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.ABACATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(billingData),
    });

    const testData = await testResponse.json();
    console.log("[ABACATE] Direct API call - Status:", testResponse.status);
    console.log("[ABACATE] Direct API call - Response:", JSON.stringify(testData, null, 2));

    // A API Abacate retorna status 200 mesmo com erro, verificar o campo success
    if (!testResponse.ok || !testData.success) {
      const errorMsg = testData.error || "Unknown error";
      throw new Error(`API Error (${testResponse.status}): ${errorMsg}`);
    }

    // Retornar apenas o data, que contém a URL e outras informações
    return testData.data;
  } catch (error) {
    console.error("Erro ao criar assinatura Abacate:", error);
    throw error;
  }
}
