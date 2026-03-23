import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function getAdminUser() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') return null;
    return { id: session.user.id };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { id } = await params;

    const entries = await prisma.courseWaitlist.findMany({
        where: { courseId: id },
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true },
    });

    // Suporte a exportação CSV via ?format=csv
    const format = request.nextUrl.searchParams.get('format');
    if (format === 'csv') {
        const rows = ['Nome,E-mail,Data', ...entries.map((e) =>
            `"${e.name}","${e.email}","${e.createdAt.toISOString()}"`
        )].join('\n');
        return new NextResponse(rows, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="waitlist-${id}.csv"`,
            },
        });
    }

    return NextResponse.json({ entries, total: entries.length });
}
