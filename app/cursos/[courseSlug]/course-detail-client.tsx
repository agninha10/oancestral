'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    Crown,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Star,
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
    membersOnly: boolean;
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

        // Cursos membersOnly sem checkout individual → vai para página de assinatura
        if (course.membersOnly && !course.kiwifyUrl) {
            router.push('/cla-ancestral');
            return;
        }

        setEnrolling(true);
        try {
            const response = await fetch(`/api/cursos/${course.slug}/enroll`, {
                method: 'POST',
            });

            const data = await response.json();

            if (response.ok) {
                // Redirecionar para o player
                router.push(`/play/${course.slug}`);
            } else if (response.status === 401) {
                // Redirecionar para login
                router.push(`/login?redirect=/cursos/${course.slug}`);
            } else if (response.status === 403) {
                // Assinatura necessária
                router.push('/cla-ancestral');
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

    const coursePriceText = course.price
        ? (course.price / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })
        : null;

    const clanAnnualPriceText = (190).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    const showDualOffer = !course.isEnrolled && !course.waitlistEnabled && Boolean(course.kiwifyUrl);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="border-b border-border/40 bg-linear-to-br from-primary/10 via-background to-accent/10">
                    <div className="container px-4 md:px-6 py-12">
                        <div className="mx-auto max-w-6xl">
                            <div className="grid gap-8 lg:grid-cols-2 items-center">
                                {/* Course Info */}
                                <div className="space-y-6">
                                    <div className="flex gap-2 flex-wrap">
                                        {course.membersOnly && (
                                            <Link href="/cla-ancestral">
                                                <Badge className="bg-amber-500 hover:bg-amber-600 text-white cursor-pointer">
                                                    <Star className="mr-1 h-3 w-3" />
                                                    Somente para membros
                                                </Badge>
                                            </Link>
                                        )}
                                        {course.isPremium && !course.membersOnly && (
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
                                            <Button size="lg" onClick={() => router.push(`/play/${course.slug}`)}>
                                                <PlayCircle className="mr-2 h-5 w-5" />
                                                Continuar Assistindo
                                            </Button>
                                        ) : course.waitlistEnabled ? null : course.membersOnly ? (
                                            // Curso exclusivo para membros — redireciona para assinar
                                            <Button
                                                size="lg"
                                                onClick={() => router.push('/cla-ancestral')}
                                            >
                                                Assinar o Clã Ancestral
                                            </Button>
                                        ) : showDualOffer ? (
                                            <Button
                                                size="lg"
                                                className="w-full sm:w-auto"
                                                onClick={() => {
                                                    const section = document.getElementById('oferta');
                                                    if (section) {
                                                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                    }
                                                }}
                                            >
                                                Ver opções de acesso
                                            </Button>
                                        ) : (
                                            // Curso por assinatura genérico
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

                {/* Oferta Dupla */}
                {showDualOffer && (
                    <section id="oferta" className="container px-4 md:px-6 pb-16">
                        <div className="mx-auto max-w-5xl space-y-4">
                            <div className="text-center space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
                                    Escolha seu acesso
                                </p>
                                <h2 className="font-serif text-3xl md:text-4xl font-bold">
                                    A Oferta Mais Inteligente para Evoluir Mais Rápido
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-4">
                                {/* Card Esquerdo - Acesso Individual */}
                                <Card className="order-last md:order-first border-zinc-800 bg-zinc-900">
                                    <CardHeader className="space-y-2">
                                        <CardTitle className="text-2xl font-serif">Acesso Individual</CardTitle>
                                        <p className="text-sm text-zinc-400">Apenas este curso</p>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold text-zinc-100">
                                            {coursePriceText ?? 'Consulte'}
                                        </p>

                                        <ul className="mt-6 space-y-3">
                                            {[
                                                'Acesso vitalício a este curso.',
                                                'Atualizações deste material.',
                                                'Suporte básico.',
                                            ].map((item) => (
                                                <li key={item} className="flex items-start gap-2 text-zinc-400">
                                                    <CheckCircle className="mt-0.5 h-4 w-4 text-zinc-500" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            variant="outline"
                                            className="mt-7 w-full border-amber-500 bg-transparent text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
                                            onClick={() => {
                                                window.location.href = course.kiwifyUrl!;
                                            }}
                                        >
                                            Comprar Curso Individual
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Card Direito - Clã Ancestral */}
                                <Card className="order-first md:order-last relative border-amber-500 bg-linear-to-br from-amber-500/10 to-zinc-900 shadow-2xl shadow-amber-500/20 overflow-visible">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="border border-amber-400/60 bg-amber-500 text-zinc-950 uppercase tracking-wider text-[10px] font-extrabold px-3 py-1">
                                            A Escolha Mais Inteligente
                                        </Badge>
                                    </div>

                                    <CardHeader className="space-y-2 pt-8">
                                        <CardTitle className="text-2xl font-serif flex items-center gap-2 text-zinc-50">
                                            <Crown className="h-5 w-5 text-amber-500" />
                                            O Clã Ancestral
                                        </CardTitle>
                                        <p className="text-sm text-zinc-200">Acesso a TUDO</p>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-4xl font-bold text-zinc-50">
                                            {clanAnnualPriceText}
                                            <span className="ml-1 text-lg font-medium text-zinc-300">/ano</span>
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-amber-400">
                                            Mais barato que um curso individual
                                        </p>

                                        <ul className="mt-6 space-y-3">
                                            {[
                                                'Este curso completo.',
                                                'TODOS os outros cursos e masterclasses já lançados.',
                                                'Acesso VIP ao Fórum Ancestral.',
                                                'Ferramentas exclusivas (Rastreador de Jejum, Gamificação).',
                                                'Manuais e E-books bônus.',
                                            ].map((item) => (
                                                <li key={item} className="flex items-start gap-2 text-zinc-100">
                                                    <CheckCircle className="mt-0.5 h-4 w-4 text-amber-500" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="relative mt-7">
                                            <span className="pointer-events-none absolute inset-0 rounded-md bg-amber-500/40 animate-ping" />
                                            <Button
                                                asChild
                                                className="relative w-full bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400"
                                            >
                                                <Link href="/assinatura">Entrar para o Clã</Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
