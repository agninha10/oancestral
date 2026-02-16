import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.userId) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { lessonId, isCompleted } = body;

        if (!lessonId || typeof isCompleted !== 'boolean') {
            return NextResponse.json(
                { error: 'Dados inválidos' },
                { status: 400 }
            );
        }

        // Upsert progress
        const progress = await prisma.userProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.userId,
                    lessonId,
                },
            },
            create: {
                userId: session.userId,
                lessonId,
                isCompleted,
                completedAt: isCompleted ? new Date() : null,
            },
            update: {
                isCompleted,
                completedAt: isCompleted ? new Date() : null,
            },
        });

        return NextResponse.json({ success: true, progress });
    } catch (error) {
        console.error('Erro ao atualizar progresso:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar progresso' },
            { status: 500 }
        );
    }
}
