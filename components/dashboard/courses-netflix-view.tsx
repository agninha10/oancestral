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
    ChevronLeft,
    ChevronRight,
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
    userId: string;
}

export function CoursesNetflixView({ userId }: CoursesNetflixViewProps) {
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await fetch('/api/cursos/my-courses');
                if (response.ok) {
                    const data = await response.json();
                    setEnrolledCourses(data.enrolledCourses || []);
                    setAvailableCourses(data.availableCourses || []);
                }
            } catch (error) {
                console.error('Erro ao carregar cursos:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    const handleCourseClick = (course: Course) => {
        if (course.isEnrolled) {
            // Encontrar a primeira aula do primeiro módulo
            const firstModule = course.modules[0];
            if (firstModule && firstModule.lessons.length > 0) {
                const firstLesson = firstModule.lessons[0];
                router.push(`/cursos/${course.slug}/${firstLesson.slug}`);
            } else {
                router.push(`/cursos/${course.slug}`);
            }
        } else {
            router.push(`/cursos/${course.slug}`);
        }
    };

    if (loading) {
        return (
            <div className="p-6 lg:p-8 space-y-12">
                <Skeleton className="h-12 w-64" />
                <div className="space-y-8">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="pb-16">
            {/* Hero Section - Featured Course */}
            {enrolledCourses.length > 0 && (
                <div className="relative h-[60vh] min-h-[500px] w-full">
                    <div className="absolute inset-0">
                        {enrolledCourses[0].coverImage ? (
                            <Image
                                src={enrolledCourses[0].coverImage}
                                alt={enrolledCourses[0].title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-br from-primary/20 via-background to-accent/20" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    </div>

                    <div className="relative h-full flex items-end">
                        <div className="p-6 lg:p-12 max-w-2xl space-y-4">
                            <h1 className="font-serif text-4xl lg:text-6xl font-bold">
                                {enrolledCourses[0].title}
                            </h1>
                            <p className="text-lg text-muted-foreground line-clamp-3">
                                {enrolledCourses[0].description}
                            </p>

                            {/* Progress Bar */}
                            {enrolledCourses[0].progress > 0 && (
                                <div className="space-y-2 max-w-md">
                                    <div className="flex justify-between text-sm">
                                        <span>Seu progresso</span>
                                        <span className="font-medium">
                                            {Math.round(enrolledCourses[0].progress)}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/50">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${enrolledCourses[0].progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button
                                    size="lg"
                                    onClick={() => handleCourseClick(enrolledCourses[0])}
                                >
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    {enrolledCourses[0].progress > 0 ? 'Continuar' : 'Começar'}
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => router.push(`/cursos/${enrolledCourses[0].slug}`)}
                                >
                                    <Info className="mr-2 h-5 w-5" />
                                    Mais Informações
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Lists */}
            <div className="space-y-12 px-6 lg:px-12 mt-8">
                {/* Continue Watching */}
                {enrolledCourses.length > 0 && (
                    <CourseRow
                        title="Continue Assistindo"
                        courses={enrolledCourses}
                        onCourseClick={handleCourseClick}
                        hoveredCourse={hoveredCourse}
                        setHoveredCourse={setHoveredCourse}
                    />
                )}

                {/* Available Courses */}
                {availableCourses.length > 0 && (
                    <CourseRow
                        title="Cursos Disponíveis"
                        courses={availableCourses}
                        onCourseClick={handleCourseClick}
                        hoveredCourse={hoveredCourse}
                        setHoveredCourse={setHoveredCourse}
                    />
                )}

                {enrolledCourses.length === 0 && availableCourses.length === 0 && (
                    <div className="text-center py-16">
                        <PlayCircle className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">
                            Nenhum curso disponível
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
    const [scrollPosition, setScrollPosition] = useState(0);
    const rowRef = useState<HTMLDivElement | null>(null);

    const scroll = (direction: 'left' | 'right') => {
        const scrollAmount = 400;
        const newPosition =
            direction === 'left'
                ? Math.max(0, scrollPosition - scrollAmount)
                : scrollPosition + scrollAmount;
        setScrollPosition(newPosition);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-serif">{title}</h2>
            <div className="relative group">
                {/* Scroll Buttons */}
                {scrollPosition > 0 && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                )}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>

                {/* Course Cards */}
                <div
                    className="overflow-x-auto scrollbar-hide scroll-smooth"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div
                        className="flex gap-4"
                        style={{ transform: `translateX(-${scrollPosition}px)` }}
                    >
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="flex-none w-72 group/card cursor-pointer"
                                onMouseEnter={() => setHoveredCourse(course.id)}
                                onMouseLeave={() => setHoveredCourse(null)}
                                onClick={() => onCourseClick(course)}
                            >
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted transition-transform duration-300 group-hover/card:scale-105">
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
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
