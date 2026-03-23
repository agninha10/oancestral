import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function getAdminUser() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') return null;
    return { id: session.user.id };
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const { id: courseId } = await params;
        const body = await request.json();
        const { title, order } = body;

        const module = await prisma.module.create({
            data: {
                title,
                order,
                courseId,
            },
            include: {
                _count: {
                    select: { lessons: true },
                },
            },
        });

        return NextResponse.json(module);
    } catch (error) {
        console.error('Erro ao criar módulo:', error);
        return NextResponse.json(
            { error: 'Erro ao criar módulo' },
            { status: 500 }
        );
    }
}
