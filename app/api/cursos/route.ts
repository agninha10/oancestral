import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        type CourseResponse = {
            id: string;
            title: string;
            slug: string;
            description: string;
            coverImage: string | null;
            isPremium: boolean;
            published: boolean;
            progress: number;
        };

        // Buscar cursos publicados
        const courses = await prisma.course.findMany({
            where: {
                published: true,
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
                        lessons: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        // Se o usuário estiver logado, buscar o progresso
        let coursesWithProgress: CourseResponse[] = [];
        
        if (session?.userId) {
            coursesWithProgress = await Promise.all(
                courses.map(async (course) => {
                    // Contar total de aulas
                    const totalLessons = course.modules.reduce(
                        (acc: number, module) => acc + module.lessons.length,
                        0
                    );

                    if (totalLessons === 0) {
                        return {
                            id: course.id,
                            title: course.title,
                            slug: course.slug,
                            description: course.description,
                            coverImage: course.coverImage,
                            isPremium: course.isPremium,
                            published: course.published,
                            progress: 0,
                        };
                    }

                    // Buscar aulas completadas pelo usuário neste curso
                    const completedLessons = await prisma.userProgress.count({
                        where: {
                            userId: session.userId,
                            isCompleted: true,
                            lesson: {
                                moduleId: {
                                    in: course.modules.map((m) => m.id),
                                },
                            },
                        },
                    });

                    const progress = (completedLessons / totalLessons) * 100;

                    return {
                        id: course.id,
                        title: course.title,
                        slug: course.slug,
                        description: course.description,
                        coverImage: course.coverImage,
                        isPremium: course.isPremium,
                        published: course.published,
                        progress,
                    };
                })
            );
        } else {
            coursesWithProgress = courses.map((course) => {
                return {
                    id: course.id,
                    title: course.title,
                    slug: course.slug,
                    description: course.description,
                    coverImage: course.coverImage,
                    isPremium: course.isPremium,
                    published: course.published,
                    progress: 0,
                };
            });
        }

        return NextResponse.json({ courses: coursesWithProgress });
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar cursos' },
            { status: 500 }
        );
    }
}
