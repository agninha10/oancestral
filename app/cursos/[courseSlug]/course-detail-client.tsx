'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Lock,
    PlayCircle,
    CheckCircle,
    BookOpen,
    ChevronDown,
    ChevronUp,
    ShoppingCart,
} from 'lucide-react';

interface Lesson {
    id: string;
    title: string;
    slug: string;
    videoUrl: string | null;
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
    description: string;
    coverImage: string | null;
    isPremium: boolean;
    price: number | null;
    kiwifyUrl: string | null;
    waitlistEnabled: boolean;
    isEnrolled: boolean;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    introVideoUrl: string | null;
    modules: Module[];
}

export default function CourseDetailClient({ courseSlug }: { courseSlug: string }) {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const [waitlistForm, setWaitlistForm] = useState({ name: '', email: '' });
    const [waitlistState, setWaitlistState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const router = useRouter();

    useEffect(() => {
        async function fetchCourse() {
            try {
                const response = await fetch(`/api/cursos/${courseSlug}`);
                if (response.ok) {
                    const data = await response.json();
                    setCourse(data.course);
                    // Expandir o primeiro módulo por padrão
                    if (data.course.modules.length > 0) {
                        setExpandedModules(new Set([data.course.modules[0].id]));
                    }
                } else if (response.status === 404) {
                    router.push('/cursos');
                }
            } catch (error) {
                console.error('Erro ao carregar curso:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [courseSlug, router]);

    const handleEnroll = async () => {
        if (!course) return;

        setEnrolling(true);
        try {
            const response = await fetch(`/api/cursos/${course.slug}/enroll`, {
                method: 'POST',
            });

            const data = await response.json();

            if (response.ok) {
                // Redirecionar para o dashboard
                router.push('/dashboard');
            } else if (response.status === 401) {
                // Redirecionar para login
                router.push(`/auth/login?redirect=/cursos/${course.slug}`);
            } else if (response.status === 403) {
                // Mostrar mensagem de assinatura necessária
                alert('Este curso requer uma assinatura premium ativa.');
            } else {
                alert(data.error || 'Erro ao se inscrever no curso');
            }
        } catch (error) {
            console.error('Erro ao se inscrever:', error);
            alert('Erro ao se inscrever no curso');
        } finally {
            setEnrolling(false);
        }
    };

    const handleWaitlist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!course) return;
        setWaitlistState('loading');
        try {
            const res = await fetch(`/api/cursos/${course.slug}/waitlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(waitlistForm),
            });
            setWaitlistState(res.ok ? 'success' : 'error');
        } catch {
            setWaitlistState('error');
        }
    };

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(moduleId)) {
                newSet.delete(moduleId);
            } else {
                newSet.add(moduleId);
            }
            return newSet;
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                    <div className="container px-4 md:px-6 py-12">
                        <div className="mx-auto max-w-6xl space-y-8">
                            <Skeleton className="h-96 w-full rounded-lg" />
                            <Skeleton className="h-12 w-3/4" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!course) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="border-b border-border/40 bg-gradient-to-br from-primary/10 via-background to-accent/10">
                    <div className="container px-4 md:px-6 py-12">
                        <div className="mx-auto max-w-6xl">
                            <div className="grid gap-8 lg:grid-cols-2 items-center">
                                {/* Course Info */}
                                <div className="space-y-6">
                                    <div className="flex gap-2">
                                        {course.isPremium && (
                                            <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                                                <Lock className="mr-1 h-3 w-3" />
                                                Premium
                                            </Badge>
                                        )}
                                        {course.isEnrolled && (
                                            <Badge variant="secondary" className="bg-green-600/90 text-white">
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                Matriculado
                                            </Badge>
                                        )}
                                    </div>

                                    <h1 className="font-serif text-4xl font-bold md:text-5xl">
                                        {course.title}
                                    </h1>

                                    <p className="text-lg text-muted-foreground">
                                        {course.description}
                                    </p>

                                    {/* Course Stats */}
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            <span>{course.totalLessons} aulas</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <PlayCircle className="h-4 w-4 text-primary" />
                                            <span>{course.modules.length} módulos</span>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    {course.isEnrolled && course.progress > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Seu progresso</span>
                                                <span className="font-medium">{Math.round(course.progress)}%</span>
                                            </div>
                                            <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Lista de Espera */}
                                    {course.waitlistEnabled && !course.isEnrolled && (
                                        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-4">
                                            <div>
                                                <p className="font-semibold text-base">
                                                    🔔 Este curso está em breve
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Entre na lista de espera e seja o primeiro a saber quando abrir as vagas.
                                                </p>
                                            </div>

                                            {waitlistState === 'success' ? (
                                                <div className="rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-700 dark:text-green-400 font-medium">
                                                    ✅ Você está na lista! Avisaremos assim que o curso for lançado.
                                                </div>
                                            ) : (
                                                <form onSubmit={handleWaitlist} className="space-y-3">
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Seu nome"
                                                        value={waitlistForm.name}
                                                        onChange={(e) =>
                                                            setWaitlistForm((prev) => ({ ...prev, name: e.target.value }))
                                                        }
                                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                    />
                                                    <input
                                                        type="email"
                                                        required
                                                        placeholder="Seu melhor e-mail"
                                                        value={waitlistForm.email}
                                                        onChange={(e) =>
                                                            setWaitlistForm((prev) => ({ ...prev, email: e.target.value }))
                                                        }
                                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                    />
                                                    {waitlistState === 'error' && (
                                                        <p className="text-xs text-destructive">
                                                            Algo deu errado. Tente novamente.
                                                        </p>
                                                    )}
                                                    <Button
                                                        type="submit"
                                                        className="w-full"
                                                        disabled={waitlistState === 'loading'}
                                                    >
                                                        {waitlistState === 'loading' ? 'Entrando...' : 'Quero ser avisado'}
                                                    </Button>
                                                </form>
                                            )}
                                        </div>
                                    )}

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col gap-3">
                                        {course.isEnrolled ? (
                                            <Button size="lg" onClick={() => router.push('/dashboard')}>
                                                <PlayCircle className="mr-2 h-5 w-5" />
                                                Continuar Assistindo
                                            </Button>
                                        ) : course.kiwifyUrl ? (
                                            // Curso pago — redireciona para checkout Kiwify
                                            <div className="space-y-2">
                                                {course.price && (
                                                    <p className="text-2xl font-bold">
                                                        {(course.price / 100).toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL',
                                                        })}
                                                        <span className="text-sm font-normal text-muted-foreground ml-2">
                                                            acesso vitalício
                                                        </span>
                                                    </p>
                                                )}
                                                <Button
                                                    size="lg"
                                                    className="w-full sm:w-auto"
                                                    onClick={() => {
                                                        window.location.href = course.kiwifyUrl!;
                                                    }}
                                                >
                                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                                    Comprar Curso
                                                </Button>
                                            </div>
                                        ) : (
                                            // Curso por assinatura
                                            <Button
                                                size="lg"
                                                onClick={handleEnroll}
                                                disabled={enrolling}
                                            >
                                                {enrolling ? 'Inscrevendo...' : 'Inscrever-se Neste Curso'}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Cover Image or Intro Video */}
                                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                                    {course.introVideoUrl ? (
                                        <iframe
                                            src={course.introVideoUrl}
                                            className="absolute inset-0 h-full w-full"
                                            allowFullScreen
                                            title="Vídeo de introdução"
                                        />
                                    ) : course.coverImage ? (
                                        <Image
                                            src={course.coverImage}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <PlayCircle className="h-24 w-24 text-muted-foreground/50" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Course Content */}
                <section className="container px-4 md:px-6 py-12">
                    <div className="mx-auto max-w-4xl space-y-8">
                        <div>
                            <h2 className="font-serif text-3xl font-bold mb-6">Conteúdo do Curso</h2>
                            <div className="space-y-4">
                                {course.modules.map((module, moduleIndex) => (
                                    <Card key={module.id}>
                                        <CardHeader>
                                            <button
                                                onClick={() => toggleModule(module.id)}
                                                className="flex w-full items-center justify-between text-left hover:text-primary transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                                                        {moduleIndex + 1}
                                                    </div>
                                                    <CardTitle className="text-xl">{module.title}</CardTitle>
                                                </div>
                                                {expandedModules.has(module.id) ? (
                                                    <ChevronUp className="h-5 w-5" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5" />
                                                )}
                                            </button>
                                        </CardHeader>

                                        {expandedModules.has(module.id) && (
                                            <CardContent>
                                                <div className="space-y-2">
                                                    {module.lessons.map((lesson, lessonIndex) => (
                                                        <div
                                                            key={lesson.id}
                                                            className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-muted/50 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm text-muted-foreground w-8">
                                                                    {lessonIndex + 1}.
                                                                </span>
                                                                <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-sm">{lesson.title}</span>
                                                            </div>
                                                            {lesson.isFree && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    Grátis
                                                                </Badge>
                                                            )}
                                                            {!lesson.isFree && !course.isEnrolled && (
                                                                <Lock className="h-4 w-4 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
