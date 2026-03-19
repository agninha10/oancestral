'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Flame,
    Shield,
    ChevronDown,
    ChevronUp,
    Check,
    ArrowRight,
    ArrowDown,
    Clock,
    Star,
    Zap,
    Brain,
    Play,
    Award,
    Quote,
    BookOpen,
    Monitor,
    Infinity,
    Gift,
    Dna,
    Swords,
    Utensils,
    FlameKindling,
} from 'lucide-react';
import { TransformationSection } from '@/app/jejum/transformation-section';

// ─── Substitua pelo ID real do YouTube quando o vídeo estiver pronto ──────────
const YOUTUBE_VIDEO_ID = ''; // ex: 'dQw4w9WgXcQ'

// ─── Preço âncora fixo (exibido cortado) ──────────────────────────────────────
const ANCHOR_PRICE_CENTS = 49700; // R$ 497,00

// ─── Types ────────────────────────────────────────────────────────────────────

type CourseLanding = {
    title: string;
    description: string;
    price: number | null;
    kiwifyUrl: string | null;
    coverImage: string | null;
    waitlistEnabled: boolean;
    slug: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBRL(centavos: number) {
    return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatInstallment(centavos: number, n = 12) {
    return (centavos / n / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ─── Sub: Waitlist Form ────────────────────────────────────────────────────────

function WaitlistForm({ slug }: { slug: string }) {
    const [form, setForm] = useState({ name: '', email: '' });
    const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setState('loading');
        try {
            const res = await fetch(`/api/cursos/${slug}/waitlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            setState(res.ok ? 'success' : 'error');
        } catch {
            setState('error');
        }
    };

    if (state === 'success') {
        return (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-8 text-center">
                <div className="text-4xl mb-3">🔥</div>
                <p className="font-serif text-xl font-bold text-white mb-2">Você está dentro.</p>
                <p className="text-zinc-400 text-sm">
                    Assim que o curso abrir, você será o primeiro a saber.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-md mx-auto">
            <input
                required
                type="text"
                placeholder="Seu nome"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-colors"
            />
            <input
                required
                type="email"
                placeholder="Seu melhor e-mail"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-colors"
            />
            {state === 'error' && (
                <p className="text-xs text-red-400">Algo deu errado. Tente novamente.</p>
            )}
            <button
                type="submit"
                disabled={state === 'loading'}
                className="w-full rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-zinc-950 transition-all hover:bg-amber-400 disabled:opacity-60"
            >
                {state === 'loading' ? 'Entrando...' : 'Quero ser avisado'}
            </button>
        </form>
    );
}

// ─── Sub: Pulsing CTA Button ───────────────────────────────────────────────────

function PulseCTA({
    href,
    external,
    label,
}: {
    href: string;
    external?: boolean;
    label: string;
}) {
    return (
        <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-amber-500 px-8 py-5 text-sm font-black uppercase tracking-[0.1em] text-zinc-950 shadow-2xl shadow-amber-500/30 transition-all hover:bg-amber-400 hover:shadow-amber-400/40 active:scale-[0.98]"
        >
            {/* pulse ring */}
            <span
                aria-hidden
                className="absolute inset-0 rounded-2xl ring-2 ring-amber-400/50 animate-ping opacity-30"
            />
            <span className="relative">{label}</span>
            <ArrowRight className="relative h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
        </a>
    );
}

// ─── Sub: Video Player ─────────────────────────────────────────────────────────

function VideoPlayer() {
    const [playing, setPlaying] = useState(false);

    if (playing && YOUTUBE_VIDEO_ID) {
        return (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl shadow-black/60">
                <iframe
                    src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                    title="O Protocolo de Jejum Ancestral — Apresentação"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <button
            onClick={() => setPlaying(true)}
            aria-label="Assistir apresentação do curso"
            className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-900 shadow-2xl shadow-black/60 transition-all hover:border-amber-500/40 hover:shadow-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900"
            />
            <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(245,158,11,0.12),transparent)]"
            />
            <div aria-hidden className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                <Flame className="h-64 w-64 text-amber-500" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-500/60 bg-amber-500/15 shadow-2xl shadow-amber-500/20 transition-all group-hover:border-amber-500 group-hover:bg-amber-500/25 group-hover:scale-110">
                    <span
                        aria-hidden
                        className="absolute inset-0 rounded-full border border-amber-500/30 animate-ping"
                    />
                    <Play className="h-8 w-8 translate-x-0.5 fill-amber-400 text-amber-400" />
                </div>

                {YOUTUBE_VIDEO_ID ? (
                    <p className="text-sm font-semibold text-zinc-400 transition-colors group-hover:text-zinc-200">
                        Assistir apresentação completa
                    </p>
                ) : (
                    <div className="space-y-1 text-center px-4">
                        <p className="text-sm font-bold text-zinc-300">Vídeo de apresentação em breve</p>
                        <p className="text-xs text-zinc-600">
                            Clique para assistir quando estiver disponível
                        </p>
                    </div>
                )}
            </div>

            <div className="absolute bottom-4 right-4 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-zinc-300 backdrop-blur-sm">
                ~12 min
            </div>

            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)',
                }}
            />
        </button>
    );
}

// ─── Sub: Module Accordion Card ────────────────────────────────────────────────

type ModuleData = {
    number: string;
    title: string;
    subtitle: string;
    items: string[];
    isBonus?: boolean;
    defaultOpen?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Icon: React.ComponentType<any>;
};

function ModuleCard({ number, title, subtitle, items, isBonus, defaultOpen, Icon }: ModuleData) {
    const [open, setOpen] = useState(defaultOpen ?? false);

    return (
        <div
            className={`rounded-2xl border transition-all duration-200 ${
                isBonus
                    ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/8 to-zinc-900'
                    : open
                      ? 'border-zinc-600 bg-zinc-900'
                      : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
            }`}
        >
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-start gap-4 p-6 sm:p-7 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 rounded-2xl"
                aria-expanded={open}
            >
                {/* Icon pill */}
                <div
                    className={`flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl mt-0.5 transition-colors ${
                        isBonus
                            ? 'bg-amber-500/20 text-amber-400'
                            : open
                              ? 'bg-amber-500/15 text-amber-500'
                              : 'bg-zinc-800 text-zinc-500'
                    }`}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
                        <span
                            className={`font-mono text-xs font-bold tracking-widest ${
                                isBonus ? 'text-amber-500' : 'text-zinc-600'
                            }`}
                        >
                            {number}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-white leading-snug">
                            {title}
                        </h3>
                        {isBonus && (
                            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                                Bônus
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-zinc-500 leading-snug">{subtitle}</p>
                </div>

                <div
                    className={`flex-shrink-0 mt-1 transition-colors ${
                        open ? 'text-amber-500' : 'text-zinc-600'
                    }`}
                >
                    {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
            </button>

            {open && (
                <div className="border-t border-zinc-800/80 px-6 pb-6 pt-5 sm:px-7 sm:pb-7">
                    <ul className="grid gap-2.5 sm:grid-cols-2">
                        {items.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                                <div className="mt-[3px] flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/15">
                                    <Check className="h-2.5 w-2.5 text-amber-500" />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MentoriaLandingPage({ course }: { course: CourseLanding }) {
    const checkoutUrl = course.kiwifyUrl ?? '#oferta';
    const realPrice = course.price ?? 19700;
    const isWaitlistOnly = course.waitlistEnabled && !course.kiwifyUrl;

    const ctaLabel = `QUERO DESTRAVAR MEU ACESSO · ${formatBRL(realPrice)}`;

    // ── Dados de conteúdo ────────────────────────────────────────────────────

    const modules: ModuleData[] = [
        {
            number: 'MÓDULO 01',
            title: 'A Base Biológica',
            subtitle: 'Entendendo a insulina, testosterona e a mentira da indústria alimentícia.',
            defaultOpen: true,
            Icon: Dna,
            items: [
                'Por que comer de 3 em 3h sabota seus hormônios',
                'Insulina crônica: o inimigo invisível do homem moderno',
                'Como o excesso de refeições derruba a testosterona',
                'A janela metabólica que a indústria não quer que você saiba',
                'O que acontece nas primeiras 12h de jejum (a ciência real)',
                'Autofagia: a limpeza celular que nenhum suplemento replica',
            ],
        },
        {
            number: 'MÓDULO 02',
            title: 'A Forja do Jejum',
            subtitle: 'Protocolos progressivos de 16h, 24h até o jejum profundo de 72h.',
            Icon: FlameKindling,
            items: [
                'Jejum 16:8 — a fundação: como começar sem sofrimento',
                'Quebrando o medo: o que realmente acontece se você "errar"',
                'Jejum 24h — o primeiro salto metabólico real',
                'Jejum 48h: cetose profunda e início da autofagia máxima',
                'Jejum 72h: território de elite, GH 300% acima do basal',
                'Como avançar de nível com segurança e consistência',
            ],
        },
        {
            number: 'MÓDULO 03',
            title: 'A Quebra Estratégica',
            subtitle: 'Como sair do jejum sem destruir os resultados — foco em carnes e gorduras.',
            Icon: Utensils,
            items: [
                'Os 5 alimentos que potencializam o pós-jejum',
                'Fígado bovino: o multivitamínico ancestral (como preparar)',
                'Tutano, coração e rins — receitas e protocolos completos',
                'O que NUNCA comer para quebrar um jejum longo',
                'A janela de nutrição: timing e macros ideais pós-jejum',
                'O protocolo de primeiro prato após 72h de jejum',
            ],
        },
        {
            number: 'MÓDULO 04',
            title: 'Mentalidade de Soberania',
            subtitle: 'O domínio sobre a fome e o estoicismo aplicado à dieta.',
            Icon: Brain,
            items: [
                'Por que a fome é psicológica após 48h (a neurociência)',
                'O estado de fluxo que os homens ancestrais dominavam',
                'Técnicas estoicas para silenciar o ruído mental',
                'A voz que diz "para" — e como dominá-la definitivamente',
                'Construindo a identidade do homem soberano sobre a comida',
                'Manutenção: como integrar o jejum para o resto da vida',
            ],
        },
        {
            number: 'BÔNUS',
            title: 'O Manual dos Órgãos',
            subtitle: 'Quebrando o jejum com poder ancestral — o guia completo em PDF.',
            isBonus: true,
            Icon: Gift,
            items: [
                'As 5 refeições de quebra mais eficientes (testadas)',
                'Receitas completas com macros e horários',
                'Como preparar fígado para quem nunca comeu',
                'Cardápio semanal de 4 semanas pronto para usar',
                'Lista de compras: o que comprar, onde e como armazenar',
                'E-book em PDF — download imediato após a compra',
            ],
        },
    ];

    const stack = [
        {
            Icon: Monitor,
            label: '4 Módulos em vídeo HD',
            sub: 'Aulas gravadas com acesso imediato e vitalício',
        },
        {
            Icon: Gift,
            label: 'E-book Bônus: O Manual dos Órgãos',
            sub: 'PDF completo para download imediato',
        },
        {
            Icon: Infinity,
            label: 'Acesso vitalício',
            sub: 'Incluindo todas as atualizações futuras gratuitas',
        },
        {
            Icon: BookOpen,
            label: 'Transcrições e resumos de cada módulo',
            sub: 'Para revisar o conteúdo sem assistir novamente',
        },
        {
            Icon: Zap,
            label: 'Protocolo semanal de 4 semanas',
            sub: 'Plano dia a dia para seguir sem precisar pensar',
        },
        {
            Icon: Shield,
            label: 'Garantia incondicional de 7 dias',
            sub: '100% devolvido. Sem perguntas, sem burocracia.',
        },
    ];

    const symptoms = [
        'Acorda cansado mesmo dormindo 8 horas',
        'Precisa de café para funcionar até o meio-dia',
        'Gordura abdominal que não sai com dieta',
        'Falta de foco e clareza mental no trabalho',
        'Humor instável e irritabilidade sem motivo',
        'Digestão pesada e inchaço após as refeições',
        'Libido baixa e disposição reduzida',
        'Sensação de que o corpo "envelheceu" rápido',
    ];

    const faqs = [
        {
            q: 'Para quem é este curso?',
            a: 'Para homens que querem controle real sobre sua biologia, saúde e clareza mental — e que estão dispostos a fazer o trabalho. Iniciantes e experientes são bem-vindos.',
        },
        {
            q: 'Preciso ter experiência com jejum?',
            a: 'Não. O programa começa do zero com protocolos progressivos no Módulo 2. Se você nunca jejuou, melhor ainda — seu corpo vai responder mais rápido.',
        },
        {
            q: 'Como funciona o acesso?',
            a: 'Imediatamente após a confirmação do pagamento, você recebe acesso a todos os módulos em vídeo HD, os PDFs e o e-book bônus. Acesso vitalício — sem prazo de expiração.',
        },
        {
            q: 'E se eu não gostar?',
            a: 'Você tem 7 dias de garantia incondicional. Basta enviar um e-mail e devolvemos 100% do investimento. Sem questionamentos.',
        },
    ];

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">

            {/* ── Grain texture overlay ── */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 z-0 opacity-[0.022]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '180px',
                }}
            />

            {/* ══════════════════════════════════════════════════════════════
                NAV MÍNIMA
            ══════════════════════════════════════════════════════════════ */}
            <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/90 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link href="/" className="font-serif text-lg font-bold text-amber-500 tracking-tight">
                        O Ancestral
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/cursos"
                            className="hidden sm:inline text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            ← Todos os cursos
                        </Link>
                        <a
                            href="#oferta"
                            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-950 transition-all hover:bg-amber-400"
                        >
                            Garantir acesso
                        </a>
                    </div>
                </div>
            </nav>

            {/* ══════════════════════════════════════════════════════════════
                HERO — A Nova Promessa Evergreen
            ══════════════════════════════════════════════════════════════ */}
            <section className="relative isolate overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-3xl"
                />

                <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-amber-400">
                            Curso Completo · Acesso Imediato
                        </span>
                    </div>

                    <h1 className="font-serif text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.2rem]">
                        O Protocolo de Jejum Ancestral:{' '}
                        <span className="text-amber-500">
                            O Método Definitivo para Dominar sua Biologia.
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                        O passo a passo estruturado que já transformou dezenas de homens. Aprenda a{' '}
                        <strong className="text-zinc-200">resetar seus hormônios</strong>,{' '}
                        <strong className="text-zinc-200">destruir a inflamação</strong> e derreter gordura
                        pura através do{' '}
                        <strong className="text-zinc-200">
                            jejum e da nutrição baseada em carnes.
                        </strong>
                    </p>

                    {/* Social proof strip */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                ))}
                            </div>
                            <span>4.9/5 dos alunos</span>
                        </div>
                        <span className="hidden sm:inline text-zinc-700">·</span>
                        <div className="flex items-center gap-1.5">
                            <Monitor className="h-3.5 w-3.5 text-amber-500/60" />
                            <span>4 módulos + bônus</span>
                        </div>
                        <span className="hidden sm:inline text-zinc-700">·</span>
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-amber-500/60" />
                            <span>Acesso vitalício</span>
                        </div>
                        <span className="hidden sm:inline text-zinc-700">·</span>
                        <div className="flex items-center gap-1.5">
                            <Shield className="h-3.5 w-3.5 text-amber-500/60" />
                            <span>Garantia de 7 dias</span>
                        </div>
                    </div>

                    {/* Hero CTA */}
                    {isWaitlistOnly ? (
                        <div className="mt-10 space-y-3">
                            <p className="text-sm font-medium text-zinc-400">
                                🔔 Em breve — entre na lista de espera:
                            </p>
                            <WaitlistForm slug={course.slug} />
                        </div>
                    ) : (
                        <div className="mt-10 flex flex-col items-center gap-3">
                            <a
                                href="#oferta"
                                className="group inline-flex w-full max-w-lg items-center justify-center gap-2.5 rounded-xl bg-amber-500 px-8 py-4 text-sm font-black uppercase tracking-[0.08em] text-zinc-950 shadow-xl shadow-amber-500/20 transition-all hover:bg-amber-400 active:scale-[0.98] sm:w-auto sm:text-base"
                            >
                                QUERO DESTRAVAR MEU ACESSO · {formatBRL(realPrice)}
                                <ArrowRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                            </a>
                            <p className="text-xs text-zinc-600">
                                Acesso imediato · Garantia incondicional de 7 dias
                            </p>
                        </div>
                    )}

                    <div className="mt-14 flex justify-center">
                        <ChevronDown className="h-5 w-5 text-zinc-700 animate-bounce" />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                TRÍADE DA PERSUASÃO
                1 → Vídeo   2 → Antes/Depois   3 → Certificado
            ══════════════════════════════════════════════════════════════ */}

            <div className="relative flex justify-center py-2">
                <div className="h-10 w-px bg-gradient-to-b from-zinc-800 to-transparent" />
            </div>

            {/* ── 1. VÍDEO ──────────────────────────────────────────────── */}
            <section className="relative border-t border-zinc-800/50 py-16 sm:py-24">
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[800px] rounded-full bg-amber-500/5 blur-3xl"
                />

                <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-xs font-black text-amber-400">
                            1
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                            A Apresentação
                        </p>
                    </div>

                    <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl md:text-[2.6rem] leading-tight mb-3">
                        Não é Genética.{' '}
                        <span className="text-amber-400">É Matemática Biológica.</span>
                    </h2>
                    <p className="mb-8 max-w-2xl text-[15px] text-zinc-400 leading-relaxed">
                        Veja como o método funciona — e por que qualquer homem, independente do histórico,
                        consegue resetar sua biologia em 4 semanas com o protocolo certo.
                    </p>

                    <VideoPlayer />

                    <p className="mt-4 text-center text-xs text-zinc-600">
                        Assista até o fim — os primeiros 3 minutos vão mudar a forma como você pensa
                        sobre alimentação para sempre.
                    </p>
                </div>

                <div className="mt-14 flex flex-col items-center gap-2">
                    <div className="h-8 w-px bg-gradient-to-b from-zinc-700 to-transparent" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                        <ArrowDown className="h-4 w-4 text-zinc-500" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                        A Prova Real
                    </p>
                </div>
            </section>

            {/* ── 2. ANTES / DEPOIS ─────────────────────────────────────── */}
            <section className="relative">
                <div className="absolute top-8 left-0 right-0 z-20 flex justify-start px-4 sm:px-8 md:px-16">
                    <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-xs font-black text-amber-400">
                            2
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                            Dia 1: Inflamado → Dia 90: Soberania
                        </p>
                    </div>
                </div>

                <TransformationSection sectionClassName="pt-24 pb-12 sm:pt-28 sm:pb-16" />

                <div className="flex flex-col items-center gap-2 pb-4">
                    <div className="h-8 w-px bg-gradient-to-b from-zinc-700 to-transparent" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                        <ArrowDown className="h-4 w-4 text-zinc-500" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                        A Validação Científica
                    </p>
                </div>
            </section>

            {/* ── 3. CERTIFICADO ────────────────────────────────────────── */}
            <section className="relative border-t border-zinc-800/50 py-16 sm:py-24">
                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-500/5 blur-3xl"
                />

                <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="mb-10 flex items-center gap-3">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-xs font-black text-amber-400">
                            3
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                            A Validação Científica
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                        <div className="relative group">
                            <div
                                aria-hidden
                                className="absolute -inset-2 rounded-3xl bg-amber-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 shadow-2xl shadow-black/60">
                                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-amber-500/40 bg-zinc-950/80 px-3 py-1.5 backdrop-blur-sm">
                                    <Award className="h-3.5 w-3.5 text-amber-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                                        Certificado Oficial
                                    </span>
                                </div>
                                <Image
                                    src="/images/certificados/Intermittent-Fasting.jpg"
                                    alt="Certificado do Curso de Intermittent Fasting — Dr. Frank O'Neill"
                                    width={640}
                                    height={480}
                                    className="w-full object-cover"
                                    loading="lazy"
                                />
                                <div
                                    aria-hidden
                                    className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl leading-tight">
                                Método embasado{' '}
                                <span className="text-amber-400">cientificamente.</span>
                            </h2>

                            <p className="text-[15px] leading-relaxed text-zinc-400">
                                Certificado pelo{' '}
                                <strong className="text-zinc-200">Dr. Frank O'Neill</strong> — um dos maiores
                                especialistas mundiais em intermittent fasting — o protocolo foi desenvolvido
                                na intersecção entre ciência celular moderna e sabedoria alimentar ancestral.
                                Não é opinião. É fisiologia.
                            </p>

                            <p className="text-[15px] leading-relaxed text-zinc-400">
                                Depois de derreter 25kg e recuperar minha biologia, me aprofundei nos
                                mecanismos reais — autofagia, cetose, reprogramação hormonal — para construir
                                um protocolo que{' '}
                                <strong className="text-zinc-200">
                                    qualquer homem pode seguir, do zero ao avançado.
                                </strong>
                            </p>

                            <blockquote className="relative rounded-xl border-l-4 border-amber-500 bg-zinc-900 pl-5 pr-5 py-4">
                                <Quote
                                    aria-hidden
                                    className="absolute -top-2 -left-1 h-5 w-5 text-amber-500/30"
                                />
                                <p className="text-sm italic text-zinc-300 leading-relaxed">
                                    "A autofagia não é um conceito New Age. É um mecanismo de sobrevivência
                                    de 3,5 bilhões de anos. Seu corpo sabe exatamente o que fazer —
                                    você só precisa parar de interrompê-lo."
                                </p>
                            </blockquote>

                            <div className="flex flex-wrap gap-2">
                                {["Dr. Frank O'Neill", 'Intermittent Fasting', 'Autofagia Celular', 'Reprogramação Hormonal'].map(
                                    (c) => (
                                        <span
                                            key={c}
                                            className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400"
                                        >
                                            {c}
                                        </span>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Separador visual pós-Tríade ─────────────────────────────── */}
            <div className="mx-auto max-w-4xl px-4 sm:px-6 py-2">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
                        <Flame className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                DOR — O Inimigo
            ══════════════════════════════════════════════════════════════ */}
            <section className="relative border-t border-zinc-800/50 py-20 sm:py-28">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                        O Diagnóstico
                    </p>
                    <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl leading-tight">
                        A prisão de comer
                        <br className="hidden sm:block" /> a cada 3 horas.
                    </h2>

                    <div className="mt-8 grid gap-8 text-zinc-400 sm:grid-cols-2">
                        <div className="space-y-5 text-[15px] leading-relaxed">
                            <p>
                                A indústria alimentícia passou décadas te convencendo de que{' '}
                                <strong className="text-zinc-200">
                                    você precisa comer de 3 em 3 horas
                                </strong>{' '}
                                para "manter o metabolismo acelerado". Isso não é ciência. É marketing de
                                ultraprocessados.
                            </p>
                            <p>
                                O resultado? Um corpo que{' '}
                                <strong className="text-zinc-200">nunca descansa</strong>, um sistema
                                digestivo cronicamente inflamado e um cérebro dependente de glicose que
                                oscila entre picos e quedas brutais.{' '}
                                <strong className="text-zinc-200">
                                    Névoa mental. Dependência de café. Irritabilidade.
                                </strong>
                            </p>
                        </div>
                        <div className="space-y-5 text-[15px] leading-relaxed">
                            <p>
                                Nossos ancestrais caçavam, construíam impérios e tomavam decisões críticas
                                em estado de jejum. O jejum não é passar fome —{' '}
                                <strong className="text-zinc-200">
                                    é o estado natural de reparo, clareza e domínio do corpo masculino.
                                </strong>
                            </p>
                            <p>
                                A autofagia — o processo pelo qual suas células <em>comem</em> os próprios
                                detritos — só se ativa em jejum profundo. É a{' '}
                                <strong className="text-zinc-200">
                                    limpeza celular que nenhum suplemento consegue imitar.
                                </strong>
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 rounded-2xl border border-red-500/15 bg-red-500/5 px-6 py-6">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-red-400/80">
                            Você se reconhece em algum desses sintomas?
                        </p>
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            {symptoms.map((s) => (
                                <div key={s} className="flex items-start gap-2.5 text-sm text-zinc-400">
                                    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-[9px] font-bold text-red-400">
                                        ✕
                                    </span>
                                    {s}
                                </div>
                            ))}
                        </div>
                        <p className="mt-5 text-sm font-semibold text-white">
                            Se marcou 3 ou mais:{' '}
                            <span className="text-amber-400">
                                você é exatamente o homem que este curso vai transformar.
                            </span>
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                MÓDULOS — O Coração do Curso (Accordion)
            ══════════════════════════════════════════════════════════════ */}
            <section className="relative border-t border-zinc-800/50 py-20 sm:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/3 right-0 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-1/3 left-0 h-64 w-64 rounded-full bg-amber-500/4 blur-3xl"
                />

                <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="mb-14 text-center">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                            Conteúdo do curso
                        </p>
                        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                            4 módulos. Uma transformação.
                        </h2>
                        <p className="mx-auto mt-3 max-w-lg text-zinc-500 text-[15px]">
                            Cada aula foi construída sobre resultado real — não teoria de livro. Clique
                            em cada módulo para ver o que você vai aprender.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {modules.map((mod) => (
                            <ModuleCard key={mod.number} {...mod} />
                        ))}
                    </div>

                    {!isWaitlistOnly && (
                        <div className="mt-12 flex flex-col items-center gap-3">
                            <PulseCTA
                                href={checkoutUrl}
                                external={!!course.kiwifyUrl}
                                label={ctaLabel}
                            />
                            <p className="text-xs text-zinc-600">
                                Acesso imediato a todos os módulos + bônus
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                O STACK — Tudo que você recebe
            ══════════════════════════════════════════════════════════════ */}
            <section className="border-t border-zinc-800/50 py-20 sm:py-24">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="mb-12 text-center">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                            Tudo que você leva
                        </p>
                        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
                            Não é só um curso. É um sistema completo.
                        </h2>
                        <p className="mx-auto mt-3 max-w-lg text-zinc-500 text-[15px]">
                            Cada item foi desenvolvido para eliminar a desculpa de "não sei como" — e
                            colocar você em ação desde o primeiro dia.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {stack.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
                            >
                                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                                    <item.Icon className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="font-serif text-[14px] font-bold text-white mb-0.5 leading-snug">
                                        {item.label}
                                    </p>
                                    <p className="text-xs text-zinc-500 leading-relaxed">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                OFERTA — Preço + CTA Pulsante
            ══════════════════════════════════════════════════════════════ */}
            <section id="oferta" className="relative border-t border-zinc-800/50 py-20 sm:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                    <div className="h-[600px] w-[600px] rounded-full bg-amber-500/6 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-2xl px-4 sm:px-6 text-center">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                        Investimento
                    </p>
                    <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl mb-10 leading-tight">
                        Escolha entre pagar o preço agora{' '}
                        <br className="hidden sm:block" />
                        ou pagar com sua saúde depois.
                    </h2>

                    <div className="rounded-3xl border border-amber-500/25 bg-gradient-to-b from-zinc-900 to-zinc-900/60 p-8 sm:p-10 shadow-2xl shadow-amber-500/5">
                        {/* Stack resumido */}
                        <div className="mb-8 space-y-2.5 text-left">
                            {[
                                '4 módulos em vídeo HD (Base Biológica, Forja, Quebra, Mentalidade)',
                                'E-book Bônus: O Manual dos Órgãos (PDF para download imediato)',
                                'Transcrições e resumos de cada módulo em PDF',
                                'Protocolo semanal de 4 semanas — plano dia a dia completo',
                                'Acesso vitalício + todas as atualizações futuras gratuitas',
                                'Garantia incondicional de 7 dias — risco zero',
                            ].map((d) => (
                                <div key={d} className="flex items-start gap-3 text-sm text-zinc-300">
                                    <div className="mt-[3px] flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                                        <Check className="h-3 w-3 text-amber-500" />
                                    </div>
                                    {d}
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-zinc-800 pt-8">
                            {/* Price anchor */}
                            <div className="flex items-center justify-center gap-3">
                                <p className="text-sm text-zinc-500 line-through">
                                    De {formatBRL(ANCHOR_PRICE_CENTS)}
                                </p>
                                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                                    {Math.round((1 - realPrice / ANCHOR_PRICE_CENTS) * 100)}% OFF
                                </span>
                            </div>

                            {/* Real price */}
                            <div className="mt-3 flex flex-col items-center gap-1">
                                <p className="font-serif text-5xl font-black text-white sm:text-6xl">
                                    {formatBRL(realPrice)}
                                </p>
                                <p className="text-sm text-zinc-500">
                                    ou {formatInstallment(realPrice)}×12 no cartão sem juros
                                </p>
                            </div>

                            {/* CTA pulsante */}
                            <div className="mt-8">
                                {isWaitlistOnly ? (
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-amber-400">
                                            🔔 Próxima turma em breve — garanta sua prioridade:
                                        </p>
                                        <WaitlistForm slug={course.slug} />
                                    </div>
                                ) : (
                                    <PulseCTA
                                        href={checkoutUrl}
                                        external={!!course.kiwifyUrl}
                                        label={ctaLabel}
                                    />
                                )}
                            </div>

                            {/* Garantia */}
                            <div className="mt-6 flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4 text-left">
                                <Shield className="mt-0.5 h-8 w-8 flex-shrink-0 text-amber-500/60" />
                                <div>
                                    <p className="text-sm font-bold text-white">
                                        7 Dias de Garantia. Risco Zero.
                                    </p>
                                    <p className="mt-0.5 text-xs text-zinc-400 leading-relaxed">
                                        Se por qualquer motivo você não ficar satisfeito, devolvemos
                                        100% do seu investimento. Sem perguntas, sem burocracia, sem
                                        complicação.
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-[11px] text-zinc-600">
                                Pagamento processado com segurança via Kiwify · Acesso liberado
                                imediatamente após a confirmação
                            </p>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="mt-12 space-y-3 text-left">
                        {faqs.map((faq) => (
                            <div
                                key={faq.q}
                                className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4"
                            >
                                <p className="font-semibold text-sm text-white mb-1">{faq.q}</p>
                                <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA final */}
                    {!isWaitlistOnly && (
                        <div className="mt-10">
                            <PulseCTA
                                href={checkoutUrl}
                                external={!!course.kiwifyUrl}
                                label={ctaLabel}
                            />
                            <p className="mt-3 text-xs text-zinc-600">
                                Acesso imediato · Garantia incondicional de 7 dias
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                FOOTER MÍNIMO
            ══════════════════════════════════════════════════════════════ */}
            <footer className="border-t border-zinc-800/50 py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <Link href="/" className="font-serif text-base font-bold text-amber-500">
                        O Ancestral
                    </Link>
                    <p className="text-xs text-zinc-600 text-center">
                        © {new Date().getFullYear()} O Ancestral · Todos os direitos reservados
                    </p>
                    <div className="flex gap-4 text-xs text-zinc-600">
                        <Link href="/cursos" className="hover:text-zinc-400 transition-colors">
                            Cursos
                        </Link>
                        <Link href="/sobre" className="hover:text-zinc-400 transition-colors">
                            Sobre
                        </Link>
                        <Link href="/contato" className="hover:text-zinc-400 transition-colors">
                            Contato
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
