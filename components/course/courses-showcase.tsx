'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    PlayCircle,
    Lock,
    ChevronLeft,
    ChevronRight,
    Info,
} from 'lucide-react';

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    isPremium: boolean;
    published: boolean;
}

export function CoursesShowcase() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const router = useRouter();

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await fetch('/api/cursos');
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data.courses.filter((c: Course) => c.published));
                }
            } catch (error) {
                console.error('Erro ao carregar cursos:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    const handleCourseClick = (courseSlug: string) => {
        router.push(`/cursos/${courseSlug}`);
    };

    const scroll = (direction: 'left' | 'right') => {
        const scrollAmount = 500;
        const newPosition =
            direction === 'left'
                ? Math.max(0, scrollPosition - scrollAmount)
                : scrollPosition + scrollAmount;
        setScrollPosition(newPosition);
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-12 w-64" />
                <div className="flex gap-5 overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex-none w-72">
                            <Skeleton className="aspect-[9/16] rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="text-center py-16">
                <PlayCircle className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Nenhum curso disponível</h3>
                <p className="text-muted-foreground">
                    Novos cursos serão adicionados em breve!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold font-serif mb-2">
                    Todos os Cursos
                </h2>
                <p className="text-muted-foreground">
                    Escolha um curso e aprofunde seus conhecimentos
                </p>
            </div>

            {/* Netflix-style Grid */}
            <div className="relative group">
                {/* Left Scroll Button */}
                {scrollPosition > 0 && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                )}

                {/* Right Scroll Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>

                {/* Course Cards Container */}
                <div
                    className="overflow-x-hidden scrollbar-hide"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div
                        className="flex gap-6 transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(-${scrollPosition}px)` }}
                    >
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="flex-none w-72 group/card cursor-pointer"
                                onMouseEnter={() => setHoveredCourse(course.id)}
                                onMouseLeave={() => setHoveredCourse(null)}
                            >
                                <div
                                    className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted transition-all duration-300 group-hover/card:scale-105 shadow-2xl shadow-black/50"
                                    onClick={() => handleCourseClick(course.slug)}
                                >
                                    {/* Background Image */}
                                    {course.coverImage ? (
                                        <Image
                                            src={course.coverImage}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                                            <PlayCircle className="h-20 w-20 text-muted-foreground/50" />
                                        </div>
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                                        {/* Top Badge */}
                                        <div className="flex justify-end">
                                            {course.isPremium && (
                                                <Badge className="bg-primary/90 text-xs gap-1">
                                                    <Lock className="h-3 w-3" />
                                                    Premium
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Bottom Content */}
                                        <div className="space-y-3">
                                            <div>
                                                <h3 className="font-bold text-white text-lg line-clamp-2 mb-2">
                                                    {course.title}
                                                </h3>
                                                <p className="text-white/80 text-sm line-clamp-3">
                                                    {course.description}
                                                </p>
                                            </div>

                                            <Button
                                                size="sm"
                                                className="w-full"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCourseClick(course.slug);
                                                }}
                                            >
                                                <Info className="mr-2 h-4 w-4" />
                                                Ver Detalhes
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Always Show Title at Bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 group-hover/card:opacity-0 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent">
                                        <h3 className="font-semibold text-white line-clamp-2">
                                            {course.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
