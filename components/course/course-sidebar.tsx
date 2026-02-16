'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Lock, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lesson {
    id: string;
    title: string;
    slug: string;
    isFree: boolean;
    order: number;
}

interface Module {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface Course {
    id: string;
    title: string;
    slug: string;
    modules: Module[];
}

interface CourseSidebarProps {
    course: Course;
    currentLessonId: string;
    userId?: string;
    isMobile?: boolean;
}

export function CourseSidebar({
    course,
    currentLessonId,
    userId,
    isMobile = false,
}: CourseSidebarProps) {
    const pathname = usePathname();
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

    // Load completed lessons
    useEffect(() => {
        if (!userId) return;

        async function loadProgress() {
            try {
                const response = await fetch(`/api/cursos/${course.slug}/progress`);
                if (response.ok) {
                    const data = await response.json();
                    setCompletedLessons(new Set(data.completedLessonIds));
                }
            } catch (error) {
                console.error('Erro ao carregar progresso:', error);
            }
        }

        loadProgress();
    }, [userId, course.slug]);

    // Auto-expand module containing current lesson
    useEffect(() => {
        const currentModule = course.modules.find((module) =>
            module.lessons.some((lesson) => lesson.id === currentLessonId)
        );

        if (currentModule) {
            setExpandedModules(new Set([currentModule.id]));
        }
    }, [currentLessonId, course.modules]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) => {
            const next = new Set(prev);
            if (next.has(moduleId)) {
                next.delete(moduleId);
            } else {
                next.add(moduleId);
            }
            return next;
        });
    };

    return (
        <div className={cn('h-full overflow-y-auto', isMobile ? 'max-h-96' : 'sticky top-0')}>
            <div className="p-6 border-b border-border">
                <h2 className="font-serif text-xl font-semibold line-clamp-2">
                    {course.title}
                </h2>
            </div>

            <div className="p-4 space-y-2">
                {course.modules.map((module) => {
                    const isExpanded = expandedModules.has(module.id);
                    const completedCount = module.lessons.filter((lesson) =>
                        completedLessons.has(lesson.id)
                    ).length;
                    const totalLessons = module.lessons.length;

                    return (
                        <div key={module.id} className="rounded-lg overflow-hidden border border-border">
                            {/* Module Header */}
                            <button
                                onClick={() => toggleModule(module.id)}
                                className="w-full flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted transition-colors text-left"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm line-clamp-2">
                                        {module.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {completedCount}/{totalLessons} aulas
                                    </p>
                                </div>
                            </button>

                            {/* Lessons List */}
                            {isExpanded && (
                                <div className="bg-background">
                                    {module.lessons.map((lesson) => {
                                        const isCompleted = completedLessons.has(lesson.id);
                                        const isCurrent = lesson.id === currentLessonId;

                                        return (
                                            <Link
                                                key={lesson.id}
                                                href={`/cursos/${course.slug}/${lesson.slug}`}
                                                className={cn(
                                                    'flex items-start gap-3 p-4 pl-8 border-t border-border/50 transition-colors group',
                                                    isCurrent
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'hover:bg-muted/50'
                                                )}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-600" />
                                                ) : (
                                                    <Circle className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                                                )}
                                                
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn(
                                                        'text-sm line-clamp-2',
                                                        isCurrent && 'font-semibold'
                                                    )}>
                                                        {lesson.title}
                                                    </p>
                                                </div>

                                                {!lesson.isFree && (
                                                    <Lock className="h-3 w-3 flex-shrink-0 mt-0.5 text-muted-foreground" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
