import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { awardUserXP, XP_EVENTS } from '@/lib/gamification';

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

        // Verifica estado anterior para garantir XP apenas na PRIMEIRA conclusão
        const existing = await prisma.userProgress.findUnique({
            where:  { userId_lessonId: { userId: session.userId, lessonId } },
            select: { isCompleted: true },
        });

        const isFirstCompletion = isCompleted && (!existing || !existing.isCompleted);

        const progress = await prisma.userProgress.upsert({
            where: {
                userId_lessonId: { userId: session.userId, lessonId },
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

        // Concede XP somente na primeira conclusão (idempotente)
        if (isFirstCompletion) {
            await awardUserXP(session.userId, XP_EVENTS.LESSON_COMPLETED);
        }

        return NextResponse.json({ success: true, progress });
    } catch (error) {
        console.error('Erro ao atualizar progresso:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar progresso' },
            { status: 500 }
        );
    }
}
