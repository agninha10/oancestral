import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { PlayCircle, ChevronLeft, BookOpen, CheckCircle, Lock } from 'lucide-react';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const course = await prisma.course.findUnique({
        where: { slug },
        select: { title: true },
    });
    return { title: course ? `${course.title} — O Ancestral` : 'Curso' };
}

export default async function CourseStorefrontPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const session = await getSession();
    if (!session) redirect('/login');
    const isAdmin = session.role === 'ADMIN';

    const { slug } = await params;

    // Fetch course with modules → lessons (only ids needed for progress calc)
    const course = await prisma.course.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            coverImage: true,
            isPremium: true,
            modules: {
                orderBy: { order: 'asc' },
                select: {
                    id: true,
                    title: true,
                    order: true,
                    thumbnailUrl: true,
                    lessons: {
                        orderBy: { order: 'asc' },
                        select: { id: true, title: true },
                    },
                },
            },
            enrollments: {
                where: { userId: session.userId },
                select: { id: true },
            },
        },
    });

    if (!course) notFound();

    // Only enrolled users reach this page
    if (course.enrollments.length === 0 && !isAdmin) {
        redirect(`/cursos/${slug}`);
    }

    // Fetch completed lessons in one query
    const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));

    const completedProgress = await prisma.userProgress.findMany({
        where: {
            userId: session.userId,
            lessonId: { in: allLessonIds },
            isCompleted: true,
        },
        select: { lessonId: true },
    });

    const completedSet = new Set(completedProgress.map((p) => p.lessonId));

    // Overall course progress
    const totalLessons = allLessonIds.length;
    const overallCompleted = completedSet.size;
    const overallProgress =
        totalLessons > 0 ? Math.round((overallCompleted / totalLessons) * 100) : 0;

    // Build enriched module list
    const modules = course.modules.map((mod) => {
        const lessonIds = mod.lessons.map((l) => l.id);
        const completedCount = lessonIds.filter((id) => completedSet.has(id)).length;
        const progressPercentage =
            lessonIds.length > 0
                ? Math.round((completedCount / lessonIds.length) * 100)
                : 0;
        const nextLessonId =
            lessonIds.find((id) => !completedSet.has(id)) ?? lessonIds[0] ?? null;

        return {
            id: mod.id,
            title: mod.title,
            thumbnailUrl: mod.thumbnailUrl,
            totalLessons: lessonIds.length,
            completedLessons: completedCount,
            progressPercentage,
            nextLessonId,
            isCompleted: completedCount === lessonIds.length && lessonIds.length > 0,
        };
    });

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* ── Hero ───────────────────────────────────────────────────── */}
            <div className="relative h-[55vh] min-h-105 w-full">
                <div className="absolute inset-0">
                    {course.coverImage ? (
                        <Image
                            src={course.coverImage}
                            alt={course.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="h-full w-full bg-linear-to-br from-primary/30 via-background to-accent/20" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
                </div>

                {/* Back button */}
                <div className="relative pt-6 px-6 lg:px-12">
                    <Link href="/dashboard/cursos">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ChevronLeft className="h-4 w-4" />
                            Meus Cursos
                        </Button>
                    </Link>
                </div>

                {/* Hero content */}
                <div className="relative h-full flex items-end">
                    <div className="px-6 lg:px-12 pb-8 max-w-3xl space-y-4">
                        <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight">
                            {course.title}
                        </h1>
                        <p className="text-base lg:text-lg text-muted-foreground line-clamp-3">
                            {course.description}
                        </p>

                        {/* Overall progress */}
                        {overallProgress > 0 && (
                            <div className="space-y-1.5 max-w-sm">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progresso geral</span>
                                    <span className="font-semibold">{overallProgress}%</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/50">
                                    <div
                                        className="h-full bg-primary transition-all"
                                        style={{ width: `${overallProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-1">
                            <Link href={`/play/${course.slug}`}>
                                <Button size="lg" className="gap-2">
                                    <PlayCircle className="h-5 w-5" />
                                    {overallProgress > 0 ? 'Continuar' : 'Começar'}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Module grid ────────────────────────────────────────────── */}
            <div className="px-6 lg:px-12 mt-10 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-serif">Módulos</h2>
                    <span className="text-sm text-muted-foreground">
                        {overallCompleted} de {totalLessons} aula{totalLessons !== 1 ? 's' : ''} concluída{totalLessons !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                    {modules.map((mod, index) => (
                        <ModuleCard
                            key={mod.id}
                            index={index}
                            courseSlug={course.slug}
                            {...mod}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Module card ─────────────────────────────────────────────────────────────────

type ModuleCardProps = {
    index: number;
    courseSlug: string;
    id: string;
    title: string;
    thumbnailUrl: string | null;
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
    nextLessonId: string | null;
    isCompleted: boolean;
};

function ModuleCard({
    index,
    courseSlug,
    title,
    thumbnailUrl,
    totalLessons,
    completedLessons,
    progressPercentage,
    nextLessonId,
    isCompleted,
}: ModuleCardProps) {
    const href = nextLessonId
        ? `/play/${courseSlug}/aula/${nextLessonId}`
        : `/play/${courseSlug}`;

    return (
        <Link href={href} className="group block">
            {/* Thumbnail */}
            <div className="relative aspect-9/16 rounded-xl overflow-hidden bg-muted shadow-md shadow-black/30 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/50">
                {thumbnailUrl ? (
                    <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
                        <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                )}

                {/* Overlay with play icon on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>

                {/* Completed badge */}
                {isCompleted && (
                    <div className="absolute top-2 right-2">
                        <div className="bg-green-600/90 text-white rounded-full p-1">
                            <CheckCircle className="h-4 w-4" />
                        </div>
                    </div>
                )}

                {/* Progress bar */}
                {progressPercentage > 0 && !isCompleted && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                        <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                )}

                {/* Lesson lock overlay if no lessons */}
                {totalLessons === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Lock className="h-8 w-8 text-white/50" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="mt-2.5 space-y-0.5 px-0.5">
                <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-xs text-muted-foreground">
                    {isCompleted ? (
                        <span className="text-green-600 dark:text-green-400">Concluído</span>
                    ) : progressPercentage > 0 ? (
                        `${completedLessons} de ${totalLessons} aulas`
                    ) : (
                        `${totalLessons} aula${totalLessons !== 1 ? 's' : ''}`
                    )}
                </p>
            </div>
        </Link>
    );
}
