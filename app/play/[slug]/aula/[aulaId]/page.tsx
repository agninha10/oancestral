import { redirect, notFound } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { CoursePlayer } from '@/components/player/course-player';
import { LessonComments } from '@/components/player/lesson-comments';
import { getLessonComments } from '@/app/play/comment-actions';
import { logActivity } from '@/lib/activity-log';

export default async function AulaPage({
    params,
}: {
    params: Promise<{ slug: string; aulaId: string }>;
}) {
    const session = await getSession();
    if (!session) redirect('/auth/login?redirect=/dashboard/cursos');

    const { slug, aulaId } = await params;

    // Fetch full course structure + current user name (parallel)
    const [course, currentUser] = await Promise.all([
        prisma.course.findUnique({
            where: { slug },
            select: {
                id: true,
                title: true,
                slug: true,
                modules: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        title: true,
                        order: true,
                        lessons: {
                            orderBy: { order: 'asc' },
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                videoUrl: true,
                                content: true,
                                order: true,
                                isFree: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                name: true,
                username: true,
                role: true,
                _count: { select: { blogPosts: true } },
            },
        }),
    ]);

    if (!course) notFound();
    if (!currentUser) redirect('/auth/login');

    // Verify enrollment
    const enrollment = await prisma.courseEnrollment.findUnique({
        where: { userId_courseId: { userId: session.userId, courseId: course.id } },
        select: { id: true },
    });
    if (!enrollment) redirect(`/cursos/${slug}`);

    // Resolve current lesson
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const currentLesson = allLessons.find((l) => l.id === aulaId);
    if (!currentLesson) redirect(`/play/${slug}`);

    // Log lesson access (non-blocking)
    logActivity({
        userId: session.userId,
        action: 'LESSON_ACCESS',
        resource: `lesson-${aulaId}`,
        metadata: { lessonTitle: currentLesson.title, courseSlug: slug, courseTitle: course.title },
    });

    // Progress, next lesson and comments (parallel)
    const [progressRecords, initialComments] = await Promise.all([
        prisma.userProgress.findMany({
            where: {
                userId: session.userId,
                lessonId: { in: allLessons.map((l) => l.id) },
            },
            select: { lessonId: true, isCompleted: true },
        }),
        getLessonComments(aulaId),
    ]);

    const completedIds = new Set(
        progressRecords.filter((p) => p.isCompleted).map((p) => p.lessonId),
    );

    const currentIndex = allLessons.findIndex((l) => l.id === aulaId);
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    const currentModule = course.modules.find((m) =>
        m.lessons.some((l) => l.id === aulaId),
    );

    return (
        <CoursePlayer
            course={{ id: course.id, title: course.title, slug: course.slug }}
            modules={course.modules}
            currentLesson={currentLesson}
            currentModuleId={currentModule?.id ?? ''}
            completedIds={[...completedIds]}
            nextLessonId={nextLesson?.id ?? null}
            commentsSlot={
                <LessonComments
                    lessonId={aulaId}
                    initialComments={initialComments}
                    currentUser={currentUser}
                />
            }
        />
    );
}
