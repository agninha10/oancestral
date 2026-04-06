import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activity-log'
import { GamificationHeader } from '@/components/dashboard/gamification-header'
import { getRandomActiveQuote } from '@/app/actions/quotes'
import { Lock, Download, Play, ChevronRight, BookOpen } from 'lucide-react'

// ─── Catálogo de Ebooks ───────────────────────────────────────────────────────

type EbookItem = {
    key: string;
    title: string;
    subtitle: string;
    cover: string;
    buyHref: string;
    clanOnly?: boolean;
    filename?: string;
};

const EBOOK_CATALOG: EbookItem[] = [
    {
        key: 'livro-ancestral',
        title: 'Manual da Cozinha Ancestral',
        subtitle: '+100 Receitas Ancestrais',
        cover: '/images/capa-livro-de-receitas.png',
        buyHref: '/livro-de-receitas-ancestrais',
    },
    {
        key: 'jejum',
        title: 'Guia Definitivo do Jejum',
        subtitle: 'Protocolo completo',
        cover: '/images/capa-livro-de-receitas.png',
        buyHref: '/jejum',
    },
    {
        key: 'nutricao-degeneracao-fisica',
        title: 'Nutrição e Degeneração Física',
        subtitle: 'Weston A. Price (traduzido)',
        cover: '/images/capa-livro-de-receitas.png',
        buyHref: '/cla-ancestral',
        clanOnly: true,
        filename: 'Livro_Nutrição_e_Degeneração_Física_Weston_Price_traduzido.pdf',
    },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({
    label,
    href,
    amber,
}: {
    label: string
    href?: string
    amber?: boolean
}) {
    return (
        <div className="flex items-center justify-between mb-4">
            <p
                className={
                    amber
                        ? 'text-sm font-bold uppercase tracking-widest text-amber-500'
                        : 'text-xs font-semibold uppercase tracking-widest text-zinc-500'
                }
            >
                {label}
            </p>
            {href && (
                <Link
                    href={href}
                    className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                    Ver todos <ChevronRight className="h-3 w-3" />
                </Link>
            )}
        </div>
    )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default async function DashboardPage() {
    const session = await getSession()
    if (!session) redirect('/login')

    logActivity({ userId: session.userId, action: 'DASHBOARD_ACCESS' }).catch(() => {})

    const [user, allCourses, ebookPurchases, enrolledCourses, quote] = await Promise.all([
        // 1. Usuário + badges (para o GamificationHeader)
        prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                name: true,
                xp: true,
                level: true,
                role: true,
                subscriptionStatus: true,
                userBadges: {
                    orderBy: { unlockedAt: 'desc' },
                    take: 3,
                    select: {
                        id: true,
                        badge: { select: { name: true, icon: true } },
                    },
                },
            },
        }),

        // 2. Todos os cursos publicados (vitrine)
        prisma.course.findMany({
            where: { published: true },
            orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
            take: 12,
            select: {
                id: true,
                title: true,
                slug: true,
                coverImage: true,
                isPremium: true,
                _count: { select: { modules: true } },
            },
        }),

        // 3. Ebooks adquiridos
        prisma.transaction.findMany({
            where: {
                userId: session.userId,
                status: 'PAID',
                product: { in: ['livro-ancestral', 'jejum'] },
            },
            select: { product: true },
        }),

        // 4. Cursos com enrollment + progresso de aulas (Continuar Assistindo)
        prisma.course.findMany({
            where: {
                published: true,
                enrollments: { some: { userId: session.userId } },
            },
            take: 8,
            select: {
                id: true,
                title: true,
                slug: true,
                coverImage: true,
                modules: {
                    orderBy: { order: 'asc' },
                    select: {
                        lessons: {
                            orderBy: { order: 'asc' },
                            select: {
                                id: true,
                                title: true,
                                thumbnailUrl: true,
                                progress: {
                                    where: { userId: session.userId },
                                    select: { isCompleted: true, updatedAt: true },
                                },
                            },
                        },
                    },
                },
            },
        }),

        // 5. Frase estoica aleatória do banco
        getRandomActiveQuote(),
    ])

    if (!user) redirect('/login')

    // ── Processa "Continuar Assistindo" ──────────────────────────────────────
    const continueWatching = enrolledCourses
        .map((course) => {
            const allLessons = course.modules.flatMap((m) => m.lessons)
            const total = allLessons.length
            const completed = allLessons.filter((l) => l.progress[0]?.isCompleted).length
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0

            // Primeira aula não concluída (para o link de retomada)
            const nextLesson = allLessons.find((l) => !l.progress[0]?.isCompleted)
            const thumb = nextLesson?.thumbnailUrl ?? course.coverImage

            return { ...course, total, completed, pct, nextLesson, thumb }
        })
        .filter((c) => c.completed > 0) // só mostra se o usuário já começou
        .sort((a, b) => {
            // Prioriza em andamento (pct < 100) sobre concluídos
            if (a.pct === 100 && b.pct < 100) return 1
            if (b.pct === 100 && a.pct < 100) return -1
            return b.pct - a.pct
        })

    // ── Ebooks com estado de acesso ───────────────────────────────────────────
    const purchasedSet = new Set(
        ebookPurchases.map((p) => p.product).filter(Boolean) as string[],
    )
    const hasClanAccess = user.subscriptionStatus === 'ACTIVE' || user.role === 'ADMIN'

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-16">
            <div className="px-4 sm:px-6 lg:px-8 pt-6 space-y-10">

                {/* ── Gamification Header ─────────────────────────────────── */}
                <GamificationHeader
                    name={user.name}
                    xp={user.xp}
                    level={user.level}
                    badges={user.userBadges}
                />

                {/* ── Frase Estoica ────────────────────────────────────────── */}
                {quote && (
                    <blockquote className="border-l-2 border-amber-500/30 pl-4">
                        <p className="text-sm italic text-zinc-500 leading-relaxed">
                            &ldquo;{quote.text}&rdquo;
                        </p>
                        <footer className="mt-1 text-xs text-zinc-700">— {quote.author}</footer>
                    </blockquote>
                )}

                {/* ── Continuar Forjando ───────────────────────────────────── */}
                {continueWatching.length > 0 && (
                    <section>
                        <SectionHeader
                            label="Continuar Forjando"
                            href="/dashboard/cursos"
                        />
                        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {continueWatching.map((item) => {
                                const href = item.nextLesson
                                    ? `/play/${item.slug}/aula/${item.nextLesson.id}`
                                    : `/play/${item.slug}`

                                return (
                                    <Link
                                        key={item.id}
                                        href={href}
                                        className="group relative shrink-0 w-64 sm:w-72 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-all hover:scale-[1.02]"
                                    >
                                        {/* Thumbnail 16:9 */}
                                        <div className="relative aspect-video w-full bg-zinc-800">
                                            {item.thumb ? (
                                                <Image
                                                    src={item.thumb}
                                                    alt={item.title}
                                                    fill
                                                    sizes="288px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Play className="h-8 w-8 text-zinc-700" />
                                                </div>
                                            )}
                                            {/* Play overlay on hover */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Play className="h-10 w-10 text-white fill-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-3 space-y-2">
                                            <p className="text-sm font-semibold text-zinc-100 leading-snug line-clamp-2">
                                                {item.title}
                                            </p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-zinc-600">
                                                    <span>{item.completed}/{item.total} aulas</span>
                                                    <span
                                                        className={
                                                            item.pct === 100
                                                                ? 'text-emerald-500'
                                                                : 'text-amber-500'
                                                        }
                                                    >
                                                        {item.pct}%
                                                    </span>
                                                </div>
                                                {/* Progress bar */}
                                                <div className="h-1 w-full rounded-full bg-zinc-800">
                                                    <div
                                                        className={`h-full rounded-full transition-[width] ${
                                                            item.pct === 100
                                                                ? 'bg-emerald-500'
                                                                : 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                                                        }`}
                                                        style={{ width: `${item.pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* ── Treinamentos Disponíveis ─────────────────────────────── */}
                <section>
                    <SectionHeader
                        label="Treinamentos Disponíveis"
                        href="/dashboard/cursos"
                        amber
                    />
                    {allCourses.length === 0 ? (
                        <p className="text-sm text-zinc-600">Nenhum curso disponível no momento.</p>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {allCourses.map((course) => (
                                <Link
                                    key={course.id}
                                    href={`/dashboard/cursos/${course.slug}`}
                                    className="group relative shrink-0 w-56 sm:w-64 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-all hover:scale-[1.02]"
                                >
                                    {/* Cover 16:9 */}
                                    <div className="relative aspect-video w-full bg-zinc-800">
                                        {course.coverImage ? (
                                            <Image
                                                src={course.coverImage}
                                                alt={course.title}
                                                fill
                                                sizes="256px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Play className="h-7 w-7 text-zinc-700" />
                                            </div>
                                        )}
                                        {/* Gradient bottom overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-transparent to-transparent" />
                                        {course.isPremium && (
                                            <div className="absolute top-2 right-2 rounded-md bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-bold text-zinc-950 uppercase tracking-wide">
                                                Premium
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-3">
                                        <p className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug">
                                            {course.title}
                                        </p>
                                        <p className="mt-1 text-[10px] text-zinc-600">
                                            {course._count.modules} módulo{course._count.modules !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── Biblioteca Ancestral (Ebooks) ────────────────────────── */}
                <section>
                    <SectionHeader
                        label="Biblioteca Ancestral"
                        href="/dashboard/ebooks"
                        amber
                    />
                    <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {EBOOK_CATALOG.map((ebook) => {
                            const owned = ebook.clanOnly ? hasClanAccess : purchasedSet.has(ebook.key)
                            const href = owned
                                ? (ebook.clanOnly
                                    ? `/api/download/${ebook.filename}`
                                    : `/api/download/ebook?product=${ebook.key}`)
                                : ebook.buyHref

                            return (
                                <Link
                                    key={ebook.key}
                                    href={href}
                                    className="group relative shrink-0 w-36 sm:w-44 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-all hover:scale-[1.02]"
                                >
                                    {/* Poster vertical 3:4 */}
                                    <div className="relative w-full bg-zinc-800" style={{ aspectRatio: '3/4' }}>
                                        <Image
                                            src={ebook.cover}
                                            alt={ebook.title}
                                            fill
                                            sizes="176px"
                                            className="object-cover"
                                        />
                                        {/* Dark overlay sempre presente */}
                                        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                                        {/* Ícone de acesso */}
                                        <div className="absolute top-2 right-2">
                                            {owned ? (
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500">
                                                    <Download className="h-3.5 w-3.5 text-zinc-950" />
                                                </div>
                                            ) : (
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900/80 border border-zinc-700">
                                                    <Lock className="h-3 w-3 text-zinc-500" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Título sobreposto no rodapé da capa */}
                                        <div className="absolute bottom-0 left-0 right-0 p-2.5">
                                            <p className="text-[10px] font-medium uppercase tracking-wide text-amber-500/80 mb-0.5">
                                                {ebook.subtitle}
                                            </p>
                                            <p className="text-xs font-bold text-zinc-100 leading-tight line-clamp-2">
                                                {ebook.title}
                                            </p>
                                        </div>
                                    </div>

                                    {/* CTA abaixo da capa */}
                                    <div className="px-2.5 py-2">
                                        <span
                                            className={`block text-center text-[10px] font-bold uppercase tracking-wider rounded-lg py-1.5 transition-colors ${
                                                owned
                                                    ? 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20'
                                                    : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700 group-hover:text-zinc-300'
                                            }`}
                                        >
                                            {owned ? 'Baixar PDF' : 'Adquirir'}
                                        </span>
                                    </div>
                                </Link>
                            )
                        })}

                        {/* Card placeholder "em breve" */}
                        <div className="relative shrink-0 w-36 sm:w-44 rounded-xl overflow-hidden bg-zinc-900/40 border border-dashed border-zinc-800 flex flex-col items-center justify-center p-4 gap-2">
                            <div style={{ aspectRatio: '3/4' }} className="w-full flex flex-col items-center justify-center gap-2">
                                <BookOpen className="h-8 w-8 text-zinc-700" />
                                <p className="text-[10px] text-zinc-700 text-center uppercase tracking-widest font-semibold">
                                    Em breve
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}
