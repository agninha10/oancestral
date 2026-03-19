'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    CheckCircle2,
    Circle,
    ChevronDown,
    ChevronUp,
    PlayCircle,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { markLessonComplete } from '@/app/play/actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonData {
    id: string;
    title: string;
    slug: string;
    videoUrl: string | null;
    content: string | null;
    order: number;
    isFree: boolean;
}

interface ModuleData {
    id: string;
    title: string;
    order: number;
    lessons: LessonData[];
}

interface CoursePlayerProps {
    course: { id: string; title: string; slug: string };
    modules: ModuleData[];
    currentLesson: LessonData;
    currentModuleId: string;
    completedIds: string[];
    nextLessonId: string | null;
}

// ─── CoursePlayer ─────────────────────────────────────────────────────────────

export function CoursePlayer({
    course,
    modules,
    currentLesson,
    currentModuleId,
    completedIds: initialCompleted,
    nextLessonId,
}: CoursePlayerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [completedIds, setCompletedIds] = useState(new Set(initialCompleted));
    const [openModules, setOpenModules] = useState<Set<string>>(
        new Set([currentModuleId]),
    );

    const isCurrentCompleted = completedIds.has(currentLesson.id);
    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const totalCompleted = completedIds.size;

    const toggleModule = (moduleId: string) => {
        setOpenModules((prev) => {
            const next = new Set(prev);
            if (next.has(moduleId)) {
                next.delete(moduleId);
            } else {
                next.add(moduleId);
            }
            return next;
        });
    };

    const handleMarkComplete = () => {
        startTransition(async () => {
            const result = await markLessonComplete(currentLesson.id, course.slug);

            if (!result.success) {
                toast.error(result.error ?? 'Erro ao marcar como concluída.');
                return;
            }

            setCompletedIds((prev) => new Set([...prev, currentLesson.id]));
            toast.success('Aula concluída!');

            if (nextLessonId) {
                router.push(`/play/${course.slug}/aula/${nextLessonId}`);
            }
        });
    };

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
            {/* ── Video + controls (70%) ──────────────────────────────────── */}
            <main className="flex flex-col lg:w-[70%] lg:border-r lg:border-zinc-800">
                {/* Video area */}
                <div className="relative aspect-video w-full bg-black">
                    {currentLesson.videoUrl ? (
                        <iframe
                            src={currentLesson.videoUrl}
                            title={currentLesson.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-zinc-600">
                            <PlayCircle className="h-16 w-16" />
                            <p className="text-sm">Vídeo em breve</p>
                        </div>
                    )}
                </div>

                {/* Lesson info + actions */}
                <div className="flex flex-1 flex-col gap-4 p-5 lg:p-7">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <h1 className="text-xl font-bold text-white lg:text-2xl">
                            {currentLesson.title}
                        </h1>

                        {/* Progress pill */}
                        <span className="flex-shrink-0 text-xs text-zinc-500">
                            {totalCompleted}/{totalLessons} aulas
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                            className="h-full rounded-full bg-amber-500 transition-all duration-500"
                            style={{
                                width: `${totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0}%`,
                            }}
                        />
                    </div>

                    {/* Mark complete button */}
                    <div className="flex items-center gap-3 pt-1">
                        {isCurrentCompleted ? (
                            <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                                <CheckCircle2 className="h-5 w-5" />
                                Aula concluída
                            </div>
                        ) : (
                            <Button
                                onClick={handleMarkComplete}
                                disabled={isPending}
                                className="bg-amber-500 font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando…
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Marcar como concluída
                                        {nextLessonId && ' e avançar'}
                                    </>
                                )}
                            </Button>
                        )}

                        {nextLessonId && isCurrentCompleted && (
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.push(`/play/${course.slug}/aula/${nextLessonId}`)
                                }
                                className="border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-white"
                            >
                                Próxima aula →
                            </Button>
                        )}
                    </div>

                    {/* Lesson content / notes */}
                    {currentLesson.content && (
                        <div
                            className="prose prose-invert prose-sm max-w-none pt-2 text-zinc-400"
                            dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                        />
                    )}
                </div>
            </main>

            {/* ── Module sidebar (30%) ────────────────────────────────────── */}
            <aside className="flex flex-col border-t border-zinc-800 lg:w-[30%] lg:border-t-0">
                <div className="sticky top-14 overflow-y-auto lg:max-h-[calc(100vh-3.5rem)]">
                    <div className="p-4 pb-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                            Conteúdo do Curso
                        </p>
                    </div>

                    {modules.map((mod) => {
                        const isOpen = openModules.has(mod.id);
                        const modCompleted = mod.lessons.filter((l) =>
                            completedIds.has(l.id),
                        ).length;

                        return (
                            <div key={mod.id} className="border-b border-zinc-800 last:border-b-0">
                                {/* Module header */}
                                <button
                                    onClick={() => toggleModule(mod.id)}
                                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-zinc-900 transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-semibold text-zinc-200">
                                            {mod.title}
                                        </span>
                                        <span className="text-xs text-zinc-600">
                                            {modCompleted}/{mod.lessons.length} concluídas
                                        </span>
                                    </div>
                                    {isOpen ? (
                                        <ChevronUp className="h-4 w-4 flex-shrink-0 text-zinc-500" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 flex-shrink-0 text-zinc-500" />
                                    )}
                                </button>

                                {/* Lessons list */}
                                {isOpen && (
                                    <ul className="pb-1">
                                        {mod.lessons.map((lesson) => {
                                            const isActive = lesson.id === currentLesson.id;
                                            const isDone = completedIds.has(lesson.id);

                                            return (
                                                <li key={lesson.id}>
                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                `/play/${course.slug}/aula/${lesson.id}`,
                                                            )
                                                        }
                                                        className={cn(
                                                            'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                                                            isActive
                                                                ? 'bg-amber-500/10 text-amber-400'
                                                                : isDone
                                                                  ? 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
                                                                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white',
                                                        )}
                                                    >
                                                        {/* Status icon */}
                                                        <span className="flex-shrink-0">
                                                            {isDone ? (
                                                                <CheckCircle2
                                                                    className={cn(
                                                                        'h-4 w-4',
                                                                        isActive
                                                                            ? 'text-amber-400'
                                                                            : 'text-emerald-500',
                                                                    )}
                                                                />
                                                            ) : isActive ? (
                                                                <PlayCircle className="h-4 w-4 text-amber-400" />
                                                            ) : (
                                                                <Circle className="h-4 w-4" />
                                                            )}
                                                        </span>

                                                        <span className="line-clamp-2 leading-snug">
                                                            {lesson.title}
                                                        </span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            </aside>
        </div>
    );
}
