import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.userId) {
            return NextResponse.json(
                { error: 'Usuário não autenticado' },
                { status: 401 }
            );
        }

        // Buscar matrículas do usuário
        const enrollments = await prisma.courseEnrollment.findMany({
            where: {
                userId: session.userId,
            },
            select: {
                courseId: true,
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        description: true,
                        coverImage: true,
                        isPremium: true,
                        published: true,
                        modules: {
                            orderBy: {
                                order: 'asc',
                            },
                            select: {
                                id: true,
                                title: true,
                                lessons: {
                                    orderBy: {
                                        order: 'asc',
                                    },
                                    select: {
                                        id: true,
                                        title: true,
                                        slug: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // Calcular progresso dos cursos matriculados
        const enrolledCourses = await Promise.all(
            enrollments.map(async (enrollment) => {
                const course = enrollment.course;
                
                // Contar total de aulas
                const totalLessons = course.modules.reduce(
                    (acc, module) => acc + module.lessons.length,
                    0
                );

                let progress = 0;
                if (totalLessons > 0) {
                    const lessonIds = course.modules.flatMap((module) =>
                        module.lessons.map((lesson) => lesson.id)
                    );

                    const completedLessons = await prisma.userProgress.count({
                        where: {
                            userId: session.userId,
                            lessonId: {
                                in: lessonIds,
                            },
                            isCompleted: true,
                        },
                    });

                    progress = (completedLessons / totalLessons) * 100;
                }

                return {
                    ...course,
                    isEnrolled: true,
                    progress,
                };
            })
        );

        // Buscar cursos disponíveis (não matriculados)
        const enrolledCourseIds = enrollments.map((e) => e.courseId);
        const availableCoursesData = await prisma.course.findMany({
            where: {
                published: true,
                NOT: {
                    id: {
                        in: enrolledCourseIds,
                    },
                },
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' },
            ],
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                coverImage: true,
                isPremium: true,
                published: true,
                modules: {
                    select: {
                        id: true,
                        title: true,
                        lessons: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
        });

        const availableCourses = availableCoursesData.map((course) => ({
            ...course,
            isEnrolled: false,
            progress: 0,
        }));

        return NextResponse.json({
            enrolledCourses,
            availableCourses,
        });
    } catch (error) {
        console.error('Erro ao buscar cursos do usuário:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar cursos' },
            { status: 500 }
        );
    }
}
