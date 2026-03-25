'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, CheckCircle2, ChevronRight, FileDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LessonMaterial {
    label: string;
    filename: string;
}

interface Lesson {
    id: string;
    title: string;
    slug: string;
    videoUrl: string | null;
    content: string | null;
    isFree: boolean;
    order: number;
    materials?: unknown;
    module: {
        id: string;
        title: string;
        course: {
            slug: string;
        };
    };
}

interface Course {
    slug: string;
    isPremium: boolean;
    modules: Array<{
        id: string;
        lessons: Array<{
            id: string;
            slug: string;
            order: number;
        }>;
    }>;
}

interface LessonPlayerProps {
    lesson: Lesson;
    course: Course;
    hasAccess: boolean;
    isCompleted: boolean;
    userId?: string;
}

export function LessonPlayer({
    lesson,
    course,
    hasAccess,
    isCompleted: initialCompleted,
    userId,
}: LessonPlayerProps) {
    const router = useRouter();
    const [isCompleted, setIsCompleted] = useState(initialCompleted);
    const [isMarkingComplete, setIsMarkingComplete] = useState(false);

    const handleMarkComplete = async () => {
        if (!userId) {
            router.push('/login');
            return;
        }

        setIsMarkingComplete(true);

        try {
            const response = await fetch(`/api/cursos/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lessonId: lesson.id,
                    isCompleted: !isCompleted,
                }),
            });

            if (response.ok) {
                setIsCompleted(!isCompleted);

                // If marking as complete, auto-advance to next lesson
                if (!isCompleted) {
                    const nextLesson = findNextLesson();
                    if (nextLesson) {
                        setTimeout(() => {
                            router.push(`/cursos/${course.slug}/${nextLesson.slug}`);
                        }, 1000);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao marcar aula:', error);
        } finally {
            setIsMarkingComplete(false);
        }
    };

    const findNextLesson = () => {
        // Flatten all lessons in order
        const allLessons = course.modules.flatMap((module) =>
            module.lessons.map((l) => ({ ...l, moduleId: module.id }))
        );

        // Find current lesson index
        const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);

        // Return next lesson if exists
        if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
            return allLessons[currentIndex + 1];
        }

        return null;
    };

    return (
        <div className="space-y-6">
            {/* Video Player */}
            <div className="relative w-full bg-black">
                {hasAccess && lesson.videoUrl ? (
                    <div className="aspect-video">
                        <iframe
                            src={lesson.videoUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={lesson.title}
                        />
                    </div>
                ) : (
                    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <Card className="max-w-md mx-4 p-8 text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-primary/10 p-4">
                                    <Lock className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="font-serif text-2xl font-semibold">
                                Conteúdo Premium
                            </h3>
                            <p className="text-muted-foreground">
                                Esta aula está disponível apenas para assinantes Premium.
                                Assine agora e tenha acesso a todo o conteúdo exclusivo!
                            </p>
                            <Button
                                size="lg"
                                className="w-full"
                                onClick={() => router.push('/dashboard')}
                            >
                                Assinar Premium
                            </Button>
                        </Card>
                    </div>
                )}
            </div>

            {/* Lesson Info */}
            <div className="container px-4 md:px-6 max-w-4xl">
                {/* Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            {lesson.module.title}
                        </p>
                        <h1 className="font-serif text-3xl font-bold">
                            {lesson.title}
                        </h1>
                    </div>

                    {hasAccess && userId && (
                        <Button
                            variant={isCompleted ? 'outline' : 'default'}
                            onClick={handleMarkComplete}
                            disabled={isMarkingComplete}
                            className="shrink-0"
                        >
                            {isCompleted ? (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Concluída
                                </>
                            ) : (
                                <>
                                    Marcar como Concluída
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    )}
                </div>

                {/* Lesson Content */}
                {hasAccess && lesson.content && (
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                    </div>
                )}

                {/* Materials / Downloads */}
                {hasAccess && (() => {
                    const mats = Array.isArray(lesson.materials)
                        ? (lesson.materials as LessonMaterial[])
                        : [];
                    return mats.length > 0 ? (
                    <div className="mt-8 rounded-xl border border-border bg-muted/30 p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <FileDown className="h-5 w-5 text-primary" />
                            <h2 className="font-semibold">Materiais desta aula</h2>
                        </div>
                        <div className="space-y-2">
                            {mats.map((material) => (
                                <a
                                    key={material.filename}
                                    href={`/api/download/${encodeURIComponent(material.filename)}`}
                                    download={material.filename}
                                    className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:bg-muted"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <FileDown className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="truncate text-sm font-medium">
                                            {material.label}
                                        </span>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                        <Download className="h-3.5 w-3.5" />
                                        Baixar
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                    ) : null;
                })()}
            </div>
        </div>
    );
}
