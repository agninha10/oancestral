import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id:            true,
            email:         true,
            name:          true,
            whatsapp:      true,
            birthdate:     true,
            emailVerified: true,
            role:          true,
            xp:            true,
            level:         true,
            avatarUrl:     true,
            subscriptionStatus: true,
            createdAt:     true,
        },
    });

    if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 });
    }

    return NextResponse.json({ user });
}
