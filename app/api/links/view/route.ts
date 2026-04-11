import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const KEY = 'links_page_views';

/**
 * POST /api/links/view
 * Incrementa o contador de visualizações da página /links.
 * Chamado por um Client Component no mount — sem dados pessoais coletados.
 */
export async function POST() {
    try {
        await prisma.siteMetric.upsert({
            where: { key: KEY },
            update: { value: { increment: 1 } },
            create: { key: KEY, value: 1 },
        });
        return NextResponse.json({ ok: true });
    } catch {
        // Silencioso — não interrompe a experiência do usuário.
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}

/**
 * GET /api/links/view
 * Retorna o total de visualizações (para uso interno/admin).
 */
export async function GET() {
    try {
        const metric = await prisma.siteMetric.findUnique({ where: { key: KEY } });
        return NextResponse.json({ views: metric?.value ?? 0 });
    } catch {
        return NextResponse.json({ views: 0 });
    }
}
