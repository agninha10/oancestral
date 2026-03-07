import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/unsubscribe?email=xxx
 *
 * Um-clique: marca o assinante como inativo na lista de newsletter e
 * redireciona para a página de confirmação.
 *
 * Nota: e-mails transacionais (verificação de conta, acesso a produto) são
 * isentos por lei (LGPD/CAN-SPAM), mas o link ainda existe por boas práticas
 * e para satisfazer os requisitos anti-spam do Gmail.
 */
export async function GET(request: NextRequest) {
    const email = request.nextUrl.searchParams.get('email');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oancestral.com.br';

    if (!email) {
        return NextResponse.redirect(`${baseUrl}/blog`);
    }

    try {
        // Marca o assinante como inativo (se existir)
        await prisma.newsletterSubscriber.updateMany({
            where: { email: email.toLowerCase() },
            data:  { active: false },
        });

        console.log(`[unsubscribe] Descadastro realizado: ${email}`);
    } catch {
        // Falha silenciosa — o usuário pode nem estar na lista (e.g. e-mail transacional)
    }

    // Redireciona para uma URL amigável com mensagem de confirmação
    return NextResponse.redirect(
        `${baseUrl}/blog?descadastrado=1`,
        { status: 302 }
    );
}
