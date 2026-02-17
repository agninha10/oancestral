import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';

/**
 * Endpoint para processar manualmente pagamentos em desenvolvimento local
 * Em produção, isso seria feito pelo webhook do AbacatePay
 */
export async function POST(req: Request) {
    try {
        // Verificar se usuário é admin
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { transactionId } = await req.json();

        if (!transactionId) {
            return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
        }

        // Buscar transação
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { user: true }
        });

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        if (transaction.status === 'PAID') {
            return NextResponse.json({ error: 'Transaction already paid' }, { status: 400 });
        }

        // Atualizar transação
        await prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: 'PAID' }
        });

        // Calcular dias de assinatura baseado no valor
        const daysToAdd = transaction.amount >= 18000 ? 365 : 30;

        // Atualizar usuário
        const updatedUser = await prisma.user.update({
            where: { id: transaction.userId },
            data: {
                subscriptionStatus: 'ACTIVE',
                subscriptionEndDate: addDays(new Date(), daysToAdd)
            }
        });

        console.log(`[MANUAL] User ${transaction.user.email} subscription activated for ${daysToAdd} days`);

        return NextResponse.json({
            success: true,
            user: {
                email: updatedUser.email,
                subscriptionStatus: updatedUser.subscriptionStatus,
                subscriptionEndDate: updatedUser.subscriptionEndDate
            }
        });

    } catch (error) {
        console.error('[MANUAL_PAYMENT_ERROR]', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
