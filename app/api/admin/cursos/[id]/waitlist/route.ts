import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

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
