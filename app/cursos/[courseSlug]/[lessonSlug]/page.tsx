import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LessonPlayer } from '@/components/course/lesson-player';
import { CourseSidebar } from '@/components/course/course-sidebar';

type Props = {
    params: Promise<{ courseSlug: string; lessonSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { courseSlug, lessonSlug } = await params;
    
    const lesson = await prisma.lesson.findFirst({
        where: {
            slug: lessonSlug,
            module: {
                course: {
                    slug: courseSlug,
                    published: true,
                },
            },
        },
        include: {
            module: {
                include: {
                    course: true,
                },
            },
        },
    });

    if (!lesson) {
        return {
            title: 'Aula não encontrada',
        };
    }

    return {
        title: `${lesson.title} | ${lesson.module.course.title}`,
        description: lesson.module.course.description,
    };
}

async function getUserFromSession() {
    const session = await getSession();
    
    if (!session?.userId) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            subscriptionStatus: true,
        },
    });

    return user;
}

export default async function LessonPage({ params }: Props) {
    const { courseSlug, lessonSlug } = await params;
    const user = await getUserFromSession();

    // Buscar aula com dados do módulo e curso
    const lesson = await prisma.lesson.findFirst({
        where: {
            slug: lessonSlug,
            module: {
                course: {
                    slug: courseSlug,
                    published: true,
                },
            },
        },
        include: {
            module: {
                include: {
                    course: {
                        include: {
                            modules: {
                                orderBy: { order: 'asc' },
                                include: {
                                    lessons: {
                                        orderBy: { order: 'asc' },
                                        select: {
                                            id: true,
                                            title: true,
                                            slug: true,
                                            isFree: true,
                                            order: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!lesson) {
        notFound();
    }

    // Verificar acesso
    const hasAccess =
        lesson.isFree ||
        (user && user.subscriptionStatus === 'ACTIVE') ||
        !lesson.module.course.isPremium;

    // Buscar progresso do usuário
    let userProgress = null;
    if (user) {
        userProgress = await prisma.userProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId: lesson.id,
                },
            },
        });
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                <div className="flex flex-col lg:flex-row">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block lg:w-80 xl:w-96 border-r border-border bg-muted/30">
                        <CourseSidebar
                            course={lesson.module.course}
                            currentLessonId={lesson.id}
                            userId={user?.id}
                        />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <LessonPlayer
                            lesson={lesson}
                            course={lesson.module.course}
                            hasAccess={hasAccess}
                            isCompleted={userProgress?.isCompleted ?? false}
                            userId={user?.id}
                        />
                    </div>
                </div>

                {/* Sidebar - Mobile (Below video) */}
                <div className="lg:hidden border-t border-border">
                    <CourseSidebar
                        course={lesson.module.course}
                        currentLessonId={lesson.id}
                        userId={user?.id}
                        isMobile
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
