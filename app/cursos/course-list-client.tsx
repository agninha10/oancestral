'use client';

import { useEffect, useState } from 'react';
import { CourseCard } from '@/components/course/course-card';
import { Skeleton } from '@/components/ui/skeleton';

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    isPremium: boolean;
    published: boolean;
    progress?: number;
}

export function CourseListClient() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await fetch('/api/cursos');
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data.courses);
                }
            } catch (error) {
                console.error('Erro ao carregar cursos:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">Nenhum curso disponível</h3>
                <p className="text-muted-foreground">
                    Novos cursos serão adicionados em breve!
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}
