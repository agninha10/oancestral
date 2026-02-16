import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const session = await getSession();

        if (!session?.userId) {
            return NextResponse.json({ completedLessonIds: [] });
        }

        // Buscar curso
        const course = await prisma.course.findFirst({
            where: { slug },
            select: {
                id: true,
                modules: {
                    select: {
                        id: true,
                        lessons: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        if (!course) {
            return NextResponse.json(
                { error: 'Curso não encontrado' },
                { status: 404 }
            );
        }

        // Buscar progresso do usuário neste curso
        const lessonIds = course.modules.flatMap((module) =>
            module.lessons.map((lesson) => lesson.id)
        );

        const completedProgress = await prisma.userProgress.findMany({
            where: {
                userId: session.userId,
                lessonId: {
                    in: lessonIds,
                },
                isCompleted: true,
            },
            select: {
                lessonId: true,
            },
        });

        const completedLessonIds = completedProgress.map((p) => p.lessonId);

        return NextResponse.json({ completedLessonIds });
    } catch (error) {
        console.error('Erro ao buscar progresso:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar progresso' },
            { status: 500 }
        );
    }
}
