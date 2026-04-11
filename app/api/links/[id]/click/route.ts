import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/links/[id]/click
 *
 * Incrementa o contador de cliques do link e redireciona o usuário para
 * a URL de destino. Usado na página pública /links para rastreamento.
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        const link = await prisma.quickLink.findUnique({
            where: { id },
            select: { url: true, isActive: true },
        });

        if (!link || !link.isActive) {
            return NextResponse.redirect(new URL('/', _req.url));
        }

        // Incrementa em background — não bloqueia o redirect.
        prisma.quickLink
            .update({ where: { id }, data: { clicks: { increment: 1 } } })
            .catch(() => {/* silencioso */});

        // Destino interno ou externo.
        const destination = link.url.startsWith('http')
            ? link.url
            : new URL(link.url, _req.url).toString();

        return NextResponse.redirect(destination, { status: 302 });
    } catch {
        return NextResponse.redirect(new URL('/', _req.url));
    }
}
