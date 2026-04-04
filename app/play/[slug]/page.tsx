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
            membersOnly: true,
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

    // ── Verificar acesso ───────────────────────────────────────────────────────
    // ADMIN sempre tem acesso
    const isAdmin = session.role === 'ADMIN';

    if (!isAdmin) {
        // Verificar matrícula direta (curso pago ou manual)
        const enrollment = await prisma.courseEnrollment.findUnique({
            where: { userId_courseId: { userId: session.userId, courseId: course.id } },
            select: { id: true },
        });

        if (!enrollment) {
            // Sem matrícula direta — verificar se o curso é membersOnly e o user tem assinatura ativa
            if (course.membersOnly) {
                const user = await prisma.user.findUnique({
                    where: { id: session.userId },
                    select: { subscriptionStatus: true, subscriptionEndDate: true },
                });

                const hasActiveSubscription =
                    user?.subscriptionStatus === 'ACTIVE' &&
                    (!user.subscriptionEndDate || new Date(user.subscriptionEndDate) > new Date());

                if (!hasActiveSubscription) {
                    // Sem assinatura → manda para /cla-ancestral para assinar
                    redirect('/cla-ancestral');
                }
                // Assinante ACTIVE com curso membersOnly → acesso liberado (sem enrollment explícito)
            } else {
                // Curso não é membersOnly e não está inscrito → página do curso
                redirect(`/cursos/${slug}`);
            }
        }
    }

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
