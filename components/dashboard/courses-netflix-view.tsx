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
    CheckCircle,
    Info,
} from 'lucide-react';

interface Lesson {
    id: string;
    title: string;
    slug: string;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    isPremium: boolean;
    isEnrolled: boolean;
    progress: number;
    modules: Module[];
}

interface CoursesNetflixViewProps {
    if (loading) {
        return (
            <div className="p-6 lg:p-8 space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="group/card cursor-pointer"
                            onMouseEnter={() => setHoveredCourse(course.id)}
                            onMouseLeave={() => setHoveredCourse(null)}
                            onClick={() => onCourseClick(course)}
                        >
                            <div className="relative aspect-2/3 rounded-lg overflow-hidden bg-muted transition-transform duration-300 group-hover/card:scale-105 shadow-lg shadow-black/40">
                                {course.coverImage ? (
                                    <Image
                                        src={course.coverImage}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <PlayCircle className="h-16 w-16 text-muted-foreground/50" />
                                    </div>
                                )}

                                {/* Overlay on hover */}
                                {hoveredCourse === course.id && (
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                                        <h3 className="font-semibold text-white mb-2 line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            {course.isEnrolled ? (
                                                <Badge variant="secondary" className="bg-green-600/90 text-white text-xs">
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                    Matriculado
                                                </Badge>
                                            ) : course.isPremium ? (
                                                <Badge variant="secondary" className="bg-primary/90 text-xs">
                                                    <Lock className="mr-1 h-3 w-3" />
                                                    Premium
                                                </Badge>
                                            ) : null}
                                        </div>
                                    </div>
                                )}

                                {/* Progress indicator */}
                                {course.isEnrolled && course.progress > 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary/50">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 space-y-1">
                                <h3 className="font-semibold line-clamp-1 group-hover/card:text-primary transition-colors">
                                    {course.title}
                                </h3>
                                {course.isEnrolled && course.progress > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        {Math.round(course.progress)}% concluído
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Novos cursos serão adicionados em breve!
                        </p>
                        <Button onClick={() => router.push('/cursos')}>
                            Explorar Catálogo
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface CourseRowProps {
    title: string;
    courses: Course[];
    onCourseClick: (course: Course) => void;
    hoveredCourse: string | null;
    setHoveredCourse: (id: string | null) => void;
}

function CourseRow({
    title,
    courses,
    onCourseClick,
    hoveredCourse,
    setHoveredCourse,
}: CourseRowProps) {
    const rowRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollButtons = () => {
        const el = rowRef.current;
        if (!el) return;

        const left = el.scrollLeft > 8;
        const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 8;

        setCanScrollLeft(left);
        setCanScrollRight(right);
    };

    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;

        updateScrollButtons();
        el.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);

        return () => {
            el.removeEventListener('scroll', updateScrollButtons);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [courses.length]);

    const scrollLeft = () => {
        rowRef.current?.scrollBy({ left: -420, behavior: 'smooth' });
    };

    const scrollRight = () => {
        rowRef.current?.scrollBy({ left: 420, behavior: 'smooth' });
    };

    return (
        <div className="space-y-4 w-full min-w-0">
            <h2 className="text-2xl font-bold font-serif">{title}</h2>
            <div className="relative group max-w-full overflow-hidden">
                {/* Scroll Buttons */}
                {canScrollLeft && (
                    <button
                        onClick={scrollLeft}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                        aria-label="Rolar cursos para a esquerda"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                )}

                <button
                    onClick={scrollRight}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    aria-label="Rolar cursos para a direita"
                    disabled={!canScrollRight}
                >
                    <ChevronRight className="h-6 w-6" />
                </button>

                {/* Course Cards */}
                <div
                    ref={rowRef}
                    className="overflow-x-auto scrollbar-hide scroll-smooth overscroll-x-contain px-12"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="flex gap-5 w-max pb-2">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="flex-none w-64 group/card cursor-pointer"
                                onMouseEnter={() => setHoveredCourse(course.id)}
                                onMouseLeave={() => setHoveredCourse(null)}
                                onClick={() => onCourseClick(course)}
                            >
                                <div className="relative aspect-2/3 rounded-lg overflow-hidden bg-muted transition-transform duration-300 group-hover/card:scale-105 shadow-lg shadow-black/40">
                                    {course.coverImage ? (
                                        <Image
                                            src={course.coverImage}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <PlayCircle className="h-16 w-16 text-muted-foreground/50" />
                                        </div>
                                    )}

                                    {/* Overlay on hover */}
                                    {hoveredCourse === course.id && (
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                                            <h3 className="font-semibold text-white mb-2 line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                {course.isEnrolled ? (
                                                    <Badge variant="secondary" className="bg-green-600/90 text-white text-xs">
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Matriculado
                                                    </Badge>
                                                ) : course.isPremium ? (
                                                    <Badge variant="secondary" className="bg-primary/90 text-xs">
                                                        <Lock className="mr-1 h-3 w-3" />
                                                        Premium
                                                    </Badge>
                                                ) : null}
                                            </div>
                                        </div>
                                    )}

                                    {/* Progress indicator */}
                                    {course.isEnrolled && course.progress > 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary/50">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-2 space-y-1">
                                    <h3 className="font-semibold line-clamp-1 group-hover/card:text-primary transition-colors">
                                        {course.title}
                                    </h3>
                                    {course.isEnrolled && course.progress > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            {Math.round(course.progress)}% concluído
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
