import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { PRODUCT_ACCESS_CONFIG } from '@/lib/product-access.config';
import ProductAccessEmail from '@/emails/ProductAccessEmail';

// ─── Admin auth (same pattern as other admin routes) ──────────────────────────

async function getAdminUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');
        if (!token) return null;

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { id: true, role: true },
        });

        return user?.role === 'ADMIN' ? user : null;
    } catch {
        return null;
    }
}

// ─── POST /api/admin/vendas/reenviar-acesso ───────────────────────────────────
// Body: { transactionId: string }

export async function POST(request: NextRequest) {
    // 1. Verify admin
    const admin = await getAdminUser();
    if (!admin) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 2. Parse body
    let transactionId: string;
    try {
        const body = await request.json();
        transactionId = body.transactionId;
        if (!transactionId) throw new Error('transactionId ausente');
    } catch {
        return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 });
    }

    try {
        // 3. Load transaction + customer
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                user: { select: { name: true, email: true } },
            },
        });

        if (!transaction) {
            return NextResponse.json(
                { error: 'Transação não encontrada' },
                { status: 404 }
            );
        }

        if (transaction.status !== 'PAID') {
            return NextResponse.json(
                { error: 'Só é possível reenviar acesso de transações com status PAID' },
                { status: 400 }
            );
        }

        // 4. Resolve product key (handle legacy rows without product field)
        const productKey = transaction.product
            ?? (transaction.amount >= 10_000 ? 'anual' : 'mensal');

        // 5. Find product config
        const config = PRODUCT_ACCESS_CONFIG[productKey];
        if (!config) {
            return NextResponse.json(
                { error: `Produto "${productKey}" não tem configuração de acesso. Adicione em lib/product-access.config.ts` },
                { status: 422 }
            );
        }

        // 6. Build full CTA URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oancestral.com.br';
        const ctaUrl = config.accessUrl.startsWith('http')
            ? config.accessUrl
            : `${baseUrl}${config.accessUrl}`;

        // 7. Send via Resend
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'RESEND_API_KEY não configurada no servidor' },
                { status: 500 }
            );
        }

        const resend = new Resend(apiKey);

        const { error: sendError } = await resend.emails.send({
            from: 'O Ancestral <no-reply@oancestral.com.br>',
            to: transaction.user.email,
            subject: config.emailSubject,
            react: ProductAccessEmail({
                customerName: transaction.user.name,
                productEmoji: config.emoji,
                title: config.emailTitle,
                subtitle: config.emailSubtitle,
                body: config.emailBody,
                ctaUrl,
                ctaLabel: config.emailCTALabel,
            }),
        });

        if (sendError) {
            console.error('[reenviar-acesso] Resend error:', sendError);
            return NextResponse.json(
                { error: `Falha ao enviar e-mail: ${sendError.message}` },
                { status: 502 }
            );
        }

        console.log(
            `[reenviar-acesso] E-mail de acesso reenviado → ${transaction.user.email} | produto: ${productKey} | admin: ${admin.id}`
        );

        return NextResponse.json({
            success: true,
            message: `E-mail de acesso reenviado para ${transaction.user.email}`,
        });

    } catch (error) {
        console.error('[reenviar-acesso] Erro inesperado:', error);
        return NextResponse.json(
            { error: 'Erro interno ao reenviar acesso' },
            { status: 500 }
        );
    }
}
