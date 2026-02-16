import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

async function getAdminUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');

        if (!token) {
            return null;
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { id: true, role: true },
        });

        if (user?.role !== 'ADMIN') {
            return null;
        }

        return user;
    } catch (error) {
        return null;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const { id } = await params;

        const module = await prisma.module.findUnique({
            where: { id },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
                lessons: {
                    orderBy: { order: 'asc' },
                },
            },
        });

        if (!module) {
            return NextResponse.json(
                { error: 'Módulo não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(module);
    } catch (error) {
        console.error('Erro ao buscar módulo:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar módulo' },
            { status: 500 }
        );
    }
}
