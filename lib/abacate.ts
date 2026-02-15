import axios from 'axios';

const ABACATE_API_URL = 'https://api.abacatepay.com/v1';

export const abacate = axios.create({
    baseURL: ABACATE_API_URL,
    headers: {
        'Authorization': `Bearer ${process.env.ABACATE_API_KEY}`,
        'Content-Type': 'application/json',
    },
});

export async function createCustomer(name: string, email: string, taxId?: string) {
    try {
        const response = await abacate.post('/customer/create', {
            name,
            email,
            taxId, // Optional CPF/CNPJ
        });
        return response.data.data.id;
    } catch (error: any) {
        console.error('Error creating Abacate customer:', error.response?.data || error.message);
        throw new Error('Falha ao criar cliente no AbacatePay');
    }
}

interface CreateSubscriptionParams {
    customerId: string;
    priceId?: string; // Optional if we hardcode amount/frequency here or if required by API
    // According to prompt: "Frequency: MONTHLY, Methods: ['PIX', 'CREDIT_CARD']"
    // Assuming standard "Billing" creation flow if specific subscription endpoint exists or via billings
}

export async function createSubscription(customerId: string) {
    try {
        // Based on prompt: "Fluxo: Criar Cliente -> Criar Billing (Cobrança) -> Redirecionar Usuário"
        // And "Frequency: MONTHLY" suggests a subscription model.
        // If AbacatePay uses "Billing" for everything, we might need to set frequency there.
        // Assuming /billing/create or similar. 
        // Docs usually have: frequency, methods, returnUrl, completionUrl.

        const response = await abacate.post('/billing/create', {
            customerId,
            frequency: 'MONTHLY',
            methods: ['PIX', 'CREDIT_CARD'],
            products: [
                {
                    externalId: 'plano-ancestral-mensal',
                    name: 'Assinatura O Ancestral',
                    description: 'Acesso completo a receitas e conteúdos exclusivos.',
                    quantity: 1,
                    price: 2990, // R$ 29,90 in cents
                }
            ],
            returnUrl: 'https://oancestral.com.br/sucesso',
            completionUrl: 'https://oancestral.com.br/sucesso',
        });

        return response.data.data;
    } catch (error: any) {
        console.error('Error creating Abacate subscription:', error.response?.data || error.message);
        throw new Error('Falha ao criar assinatura no AbacatePay');
    }
}
