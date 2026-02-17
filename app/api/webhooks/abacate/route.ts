import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';

export async function POST(req: Request) {
    try {
        const secret = process.env.ABACATE_WEBHOOK_SECRET;

        // Security: Check header against secret
        const authHeader = req.headers.get('authorization');
        const secretHeader = req.headers.get('abacate-secret');

        const isAuthValid = (authHeader === `Bearer ${secret}`) || (secretHeader === secret);

        if (!secret || !isAuthValid) {
            console.warn('[WEBHOOK] Unauthorized attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const event = await req.json();
        const eventType = event.type || event.event;
        const data = event.data || {};
        
        console.log('[WEBHOOK] Received event:', eventType);
        console.log('[WEBHOOK] Event data:', JSON.stringify(data, null, 2));

        // Buscar transação pelo billingId
        const billingId = data.id;
        
        if (!billingId) {
            console.warn('[WEBHOOK] No billing ID in event data');
            return NextResponse.json({ received: true });
        }

        const transaction = await prisma.transaction.findUnique({
            where: { billingId },
            include: { user: true }
        });

        if (!transaction) {
            console.warn(`[WEBHOOK] Transaction not found for billing ID: ${billingId}`);
            return NextResponse.json({ received: true });
        }

        console.log(`[WEBHOOK] Processing ${eventType} for user: ${transaction.user.email}`);

        // Processar eventos
        switch (eventType) {
            case 'billing.paid':
                // Atualizar status da transação
                await prisma.transaction.update({
                    where: { id: transaction.id },
                    data: { status: 'PAID' }
                });

                // Calcular data de expiração baseado no valor
                const daysToAdd = transaction.amount >= 18000 ? 365 : 30;
                
                // Atualizar usuário
                await prisma.user.update({
                    where: { id: transaction.userId },
                    data: {
                        subscriptionStatus: 'ACTIVE',
                        subscriptionEndDate: addDays(new Date(), daysToAdd),
                        abacateCustomerId: data.customer?.id || transaction.user.abacateCustomerId
                    }
                });

                console.log(`[WEBHOOK] User ${transaction.user.email} subscription activated for ${daysToAdd} days`);
                break;

            case 'billing.failed':
                // Atualizar transação como falhada
                await prisma.transaction.update({
                    where: { id: transaction.id },
                    data: { status: 'FAILED' }
                });

                // Downgrade para FREE
                await prisma.user.update({
                    where: { id: transaction.userId },
                    data: { subscriptionStatus: 'FREE' }
                });

                console.log(`[WEBHOOK] Payment failed for user ${transaction.user.email}`);
                break;

            case 'billing.disputed':
                // CRÍTICO: Bloquear acesso imediatamente
                console.warn(`[WEBHOOK] DISPUTE DETECTED for user ${transaction.user.email}`);
                
                await prisma.transaction.update({
                    where: { id: transaction.id },
                    data: { status: 'FAILED' }
                });

                await prisma.user.update({
                    where: { id: transaction.userId },
                    data: { subscriptionStatus: 'FREE' }
                });
                break;

            case 'billing.canceled':
            case 'billing.done':
                // Assinatura cancelada
                await prisma.transaction.update({
                    where: { id: transaction.id },
                    data: { status: 'CANCELED' }
                });

                await prisma.user.update({
                    where: { id: transaction.userId },
                    data: { subscriptionStatus: 'FREE' }
                });

                console.log(`[WEBHOOK] Subscription canceled for user ${transaction.user.email}`);
                break;

            default:
                console.log(`[WEBHOOK] Unhandled event type: ${eventType}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('[WEBHOOK] Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
