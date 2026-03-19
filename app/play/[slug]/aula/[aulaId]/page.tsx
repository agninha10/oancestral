import { redirect, notFound } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { CoursePlayer } from '@/components/player/course-player';

export default async function AulaPage({
    params,
}: {
    params: Promise<{ slug: string; aulaId: string }>;
}) {
    const session = await getSession();
    if (!session) redirect('/auth/login?redirect=/dashboard/cursos');

    const { slug, aulaId } = await params;

    // Fetch full course structure
    const course = await prisma.course.findUnique({
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
    });

    if (!course) notFound();

    // Verify enrollment
    const enrollment = await prisma.courseEnrollment.findUnique({
        where: { userId_courseId: { userId: session.userId, courseId: course.id } },
        select: { id: true },
    });

    if (!enrollment) redirect(`/cursos/${slug}`);

    // Get current lesson
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const currentLesson = allLessons.find((l) => l.id === aulaId);
    if (!currentLesson) redirect(`/play/${slug}`);

    // Get user progress for this course
    const progressRecords = await prisma.userProgress.findMany({
        where: {
            userId: session.userId,
            lessonId: { in: allLessons.map((l) => l.id) },
        },
        select: { lessonId: true, isCompleted: true },
    });
    const completedIds = new Set(
        progressRecords.filter((p) => p.isCompleted).map((p) => p.lessonId),
    );

    // Find next lesson
    const currentIndex = allLessons.findIndex((l) => l.id === aulaId);
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    // Find which module this lesson belongs to
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
        />
    );
}
