'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Eye, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Course {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    isPremium: boolean;
    createdAt: string;
    _count: {
        modules: number;
    };
}

export default function CursosAdminPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/admin/cursos');
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            }
        } catch (error) {
            console.error('Erro ao buscar cursos:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Carregando cursos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Cursos</h1>
                    <p className="text-muted-foreground">
                        Gerencie os cursos da plataforma
                    </p>
                </div>
                <Link href="/admin/cursos/novo">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Curso
                    </Button>
                </Link>
            </div>

            {courses.length === 0 ? (
                <Card className="p-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum curso criado</h3>
                    <p className="text-muted-foreground mb-6">
                        Comece criando seu primeiro curso
                    </p>
                    <Link href="/admin/cursos/novo">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Criar Primeiro Curso
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {courses.map((course) => (
                        <Card key={course.id} className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-semibold">
                                            {course.title}
                                        </h3>
                                        <Badge variant={course.published ? 'default' : 'secondary'}>
                                            {course.published ? 'Publicado' : 'Rascunho'}
                                        </Badge>
                                        {course.isPremium && (
                                            <Badge variant="outline">Premium</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {course._count.modules} módulo(s) • Criado em{' '}
                                        {format(new Date(course.createdAt), "dd 'de' MMMM 'de' yyyy", {
                                            locale: ptBR,
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href={`/cursos/${course.slug}`} target="_blank">
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/cursos/${course.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
