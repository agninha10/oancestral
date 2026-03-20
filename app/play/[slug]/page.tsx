import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export default async function PlayCoursePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const session = await getSession();
    if (!session) redirect('/login?redirect=/dashboard/cursos');

    const { slug } = await params;

    // Fetch course with ordered modules → lessons
    const course = await prisma.course.findUnique({
        where: { slug },
        select: {
            id: true,
            modules: {
                orderBy: { order: 'asc' },
                select: {
                    lessons: {
                        orderBy: { order: 'asc' },
                        select: { id: true },
                    },
                },
            },
        },
    });

    if (!course) redirect('/dashboard/cursos');

    // Verify enrollment
    const enrollment = await prisma.courseEnrollment.findUnique({
        where: { userId_courseId: { userId: session.userId, courseId: course.id } },
        select: { id: true },
    });

    if (!enrollment) redirect(`/cursos/${slug}`);

    // Flatten all lessons
    const allLessons = course.modules.flatMap((m) => m.lessons);
    if (allLessons.length === 0) redirect('/dashboard/cursos');

    // Get completed lesson IDs
    const completed = await prisma.userProgress.findMany({
        where: { userId: session.userId, isCompleted: true },
        select: { lessonId: true },
    });
    const completedIds = new Set(completed.map((p) => p.lessonId));

    // First unwatched lesson, or first lesson if all done
    const firstUnwatched = allLessons.find((l) => !completedIds.has(l.id));
    const targetLesson = firstUnwatched ?? allLessons[0];

    redirect(`/play/${slug}/aula/${targetLesson.id}`);
}
