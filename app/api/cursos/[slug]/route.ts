import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getSession();
        const { slug } = await params;

        const course = await prisma.course.findUnique({
            where: {
                slug,
                published: true,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                coverImage: true,
                isPremium: true,
                published: true,
                featured: true,
                createdAt: true,
                modules: {
                    orderBy: {
                        order: 'asc',
                    },
                    select: {
                        id: true,
                        title: true,
                        order: true,
                        lessons: {
                            orderBy: {
                                order: 'asc',
                            },
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                videoUrl: true,
                                isFree: true,
                                order: true,
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

        // Verificar se o usuário está matriculado
        let isEnrolled = false;
        let totalLessons = 0;
        let completedLessons = 0;

        if (session?.userId) {
            const enrollment = await prisma.courseEnrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: session.userId,
                        courseId: course.id,
                    },
                },
            });

            isEnrolled = !!enrollment;

            // Calcular progresso
            totalLessons = course.modules.reduce(
                (acc, module) => acc + module.lessons.length,
                0
            );

            if (totalLessons > 0) {
                const lessonIds = course.modules.flatMap(
                    (module) => module.lessons.map((lesson) => lesson.id)
                );

                completedLessons = await prisma.userProgress.count({
                    where: {
                        userId: session.userId,
                        lessonId: {
                            in: lessonIds,
                        },
                        isCompleted: true,
                    },
                });
            }
        }

        const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        // Encontrar vídeo de introdução (primeira aula gratuita)
        let introVideoUrl: string | null = null;
        for (const module of course.modules) {
            const freeLesson = module.lessons.find((lesson) => lesson.isFree);
            if (freeLesson?.videoUrl) {
                introVideoUrl = freeLesson.videoUrl;
                break;
            }
        }

        return NextResponse.json({
            course: {
                ...course,
                isEnrolled,
                progress,
                totalLessons,
                completedLessons,
                introVideoUrl,
            },
        });
    } catch (error) {
        console.error('Erro ao buscar curso:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar curso' },
            { status: 500 }
        );
    }
}
