'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Flame,
    Shield,
    Users,
    ChevronDown,
    Check,
    ArrowRight,
    ArrowDown,
    Clock,
    Star,
    Zap,
    Brain,
    Sword,
    Play,
    Award,
    Quote,
} from 'lucide-react';
import { TransformationSection } from '@/app/jejum/transformation-section';

// ─── Substitua pelo ID real do YouTube quando o vídeo estiver pronto ──────────
const YOUTUBE_VIDEO_ID = ''; // ex: 'dQw4w9WgXcQ'

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
                    Assim que as vagas abrirem, você será o primeiro a saber.
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

function PulseCTA({ href, external }: { href: string; external?: boolean }) {
    return (
        <a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-amber-500 px-8 py-5 text-sm font-black uppercase tracking-[0.12em] text-zinc-950 shadow-2xl shadow-amber-500/30 transition-all hover:bg-amber-400 hover:shadow-amber-400/40 active:scale-[0.98]"
        >
            {/* pulse ring */}
            <span
                aria-hidden
                className="absolute inset-0 rounded-2xl ring-2 ring-amber-400/50 animate-ping opacity-30"
            />
            QUERO GARANTIR MINHA VAGA NA MENTORIA
            <ArrowRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
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
                    title="Mentoria de Jejum Ancestral — Apresentação"
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
            aria-label="Assistir apresentação da mentoria"
            className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-900 shadow-2xl shadow-black/60 transition-all hover:border-amber-500/40 hover:shadow-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
            {/* Gradient texture */}
            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900"
            />
            {/* Amber radial glow */}
            <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(245,158,11,0.12),transparent)]"
            />

            {/* Flame icon watermark */}
            <div aria-hidden className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                <Flame className="h-64 w-64 text-amber-500" />
            </div>

            {/* Play button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-500/60 bg-amber-500/15 shadow-2xl shadow-amber-500/20 transition-all group-hover:border-amber-500 group-hover:bg-amber-500/25 group-hover:scale-110">
                    {/* outer pulse */}
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
                    <div className="space-y-1 text-center">
                        <p className="text-sm font-bold text-zinc-300">Vídeo de apresentação em breve</p>
                        <p className="text-xs text-zinc-600">
                            O criador adicionará o vídeo em breve
                        </p>
                    </div>
                )}
            </div>

            {/* Duration badge */}
            <div className="absolute bottom-4 right-4 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-zinc-300 backdrop-blur-sm">
                ~12 min
            </div>

            {/* Scanlines texture */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)',
                }}
            />
        </button>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MentoriaLandingPage({ course }: { course: CourseLanding }) {
    const checkoutUrl = course.kiwifyUrl ?? '#oferta';
    const realPrice = course.price ?? 29700;
    const anchorPrice = 99700;
    const isWaitlistOnly = course.waitlistEnabled && !course.kiwifyUrl;

    const pillars = [
        {
            icon: Flame,
            title: 'Protocolos Progressivos',
            text: 'Do jejum de 16h para iniciantes até o jejum profundo de 72h com autofagia máxima. Você avança no seu ritmo, com segurança e precisão.',
            tag: '4 semanas',
        },
        {
            icon: Sword,
            title: 'A Quebra Estratégica',
            text: 'Exatamente o que comer — carnes, órgãos, gorduras ancestrais — para potencializar o resultado, não destruí-lo. A refeição certa na hora certa.',
            tag: 'Nutrição de precisão',
        },
        {
            icon: Users,
            title: 'O Clã (Acompanhamento)',
            text: 'Você não fará isso sozinho. Acompanhamento direto, grupo fechado com os guerreiros da mentoria e suporte durante todo o protocolo.',
            tag: 'Comunidade exclusiva',
        },
    ];

    const modules = [
        {
            number: '01',
            title: 'A Forja Mental',
            subtitle: 'Clareza predatória. Fome emocional aniquilada.',
            items: [
                'Por que a fome é psicológica após 48h de jejum',
                'O estado de fluxo que os homens ancestrais dominavam',
                'Silenciando o ruído mental com o protocolo matinal',
                'A voz que diz "para" — e como ignorá-la definitivamente',
            ],
        },
        {
            number: '02',
            title: 'O Protocolo dos 90 Dias',
            subtitle: 'Cetose, autofagia e reprogramação hormonal completa.',
            items: [
                'Jejum 16:8 — a fundação inabalável',
                'Jejum 24h — o primeiro salto metabólico',
                'Jejum 48h e 72h — território de elite (autofagia profunda)',
                'Como o GH dispara 300% durante o jejum estendido',
            ],
        },
        {
            number: '03',
            title: 'A Quebra Estratégica',
            subtitle: 'O que comer, quando comer e como maximizar cada resultado.',
            items: [
                'Os 5 alimentos que potencializam o resultado do jejum',
                'Fígado bovino: o multivitamínico ancestral',
                'Tutano, coração e rins — receitas e protocolos',
                'O que NUNCA comer para quebrar um jejum longo',
            ],
        },
        {
            number: 'BÔNUS',
            title: 'O Manual dos Órgãos',
            subtitle: 'Quebrando o jejum com poder ancestral.',
            items: [
                'As 5 refeições de quebra mais eficientes (testadas)',
                'Receitas completas com macros e horários',
                'Como preparar fígado para quem nunca comeu',
                'O protocolo de "primeiro prato" pós-jejum de 72h',
            ],
            isBonus: true,
        },
    ];

    const deliverables = [
        '4 semanas de acompanhamento direto e personalizado',
        'Acesso ao grupo exclusivo da mentoria (clã fechado)',
        'Os 3 módulos + Bônus em vídeo e PDF',
        'Suporte direto via mensagem (resposta em 24h)',
        'Gravações de todas as sessões ao vivo',
        'O Manual dos Órgãos completo (BÔNUS)',
        'Acesso vitalício + atualizações futuras gratuitas',
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">

            {/* ── Grain texture overlay ────────────────────────────────────── */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 z-0 opacity-[0.022]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '180px',
                }}
            />

            {/* ═══════════════════════════════════════════════════════════════
                NAV MÍNIMA
            ═══════════════════════════════════════════════════════════════ */}
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
                            Garantir vaga
                        </a>
                    </div>
                </div>
            </nav>

            {/* ═══════════════════════════════════════════════════════════════
                HERO — A Promessa
            ═══════════════════════════════════════════════════════════════ */}
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
                            Vagas abertas · Acompanhamento direto
                        </span>
                    </div>

                    <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                        Domine Sua Biologia:{' '}
                        <span className="text-amber-500">
                            A Mentoria Definitiva de Jejum Ancestral.
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                        Não é apenas parar de comer. É um protocolo guiado para{' '}
                        <strong className="text-zinc-200">resetar seus hormônios</strong>,{' '}
                        <strong className="text-zinc-200">destruir a inflamação</strong> e resgatar a{' '}
                        <strong className="text-zinc-200">clareza mental predatória</strong> em 4 semanas.
                    </p>

                    {/* Social proof strip */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                ))}
                            </div>
                            <span>4.9/5 dos alunos</span>
                        </div>
                        <span className="text-zinc-700">·</span>
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-amber-500/60" />
                            <span>4 semanas de imersão</span>
                        </div>
                        <span className="text-zinc-700">·</span>
                        <div className="flex items-center gap-1.5">
                            <Shield className="h-3.5 w-3.5 text-amber-500/60" />
                            <span>Garantia de 7 dias</span>
                        </div>
                    </div>

                    {/* CTA */}
                    {isWaitlistOnly ? (
                        <div className="mt-10 space-y-3">
                            <p className="text-sm font-medium text-zinc-400">
                                🔔 Próxima turma em breve — entre na lista:
                            </p>
                            <WaitlistForm slug={course.slug} />
                        </div>
                    ) : (
                        <div className="mt-10 flex flex-col items-center gap-3">
                            <a
                                href="#oferta"
                                className="group inline-flex items-center gap-2.5 rounded-xl bg-amber-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-zinc-950 shadow-xl shadow-amber-500/20 transition-all hover:bg-amber-400 active:scale-[0.98]"
                            >
                                Quero garantir minha vaga
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </a>
                            <p className="text-xs text-zinc-600">
                                Acesso imediato · Garantia incondicional de 7 dias
                            </p>
                        </div>
                    )}

                    <div className="mt-16 flex justify-center">
                        <ChevronDown className="h-5 w-5 text-zinc-700 animate-bounce" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                TRÍADE DA PERSUASÃO
                1 → Vídeo   2 → Antes/Depois   3 → Certificado
            ═══════════════════════════════════════════════════════════════ */}

            {/* ── CONECTOR visual entre Hero e Tríade ── */}
            <div className="relative flex justify-center py-2">
                <div className="h-10 w-px bg-gradient-to-b from-zinc-800 to-transparent" />
            </div>

            {/* ── 1. VÍDEO ─────────────────────────────────────────────────── */}
            <section className="relative border-t border-zinc-800/50 py-16 sm:py-24">
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[800px] rounded-full bg-amber-500/5 blur-3xl"
                />

                <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
                    {/* Step indicator */}
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-xs font-black text-amber-400">
                            1
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                            A Apresentação
                        </p>
                    </div>

                    <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl md:text-[2.6rem] leading-tight mb-3">
                        Eu Descobri o Código do Reset Biológico.{' '}
                        <span className="text-amber-400">Deixe-me Te Mostrar Como.</span>
                    </h2>
                    <p className="mb-8 max-w-2xl text-[15px] text-zinc-400 leading-relaxed">
                        Assista à apresentação completa e entenda por que o jejum ancestral é a
                        ferramenta mais poderosa que um homem pode usar para recuperar o controle
                        absoluto da própria biologia.
                    </p>

                    {/* Player */}
                    <VideoPlayer />

                    {/* Micro copy abaixo do vídeo */}
                    <p className="mt-4 text-center text-xs text-zinc-600">
                        Assista até o fim — os primeiros 3 minutos vão mudar a forma como você
                        pensa sobre alimentação para sempre.
                    </p>
                </div>

                {/* Conector numérico para a próxima seção */}
                <div className="mt-14 flex flex-col items-center gap-2">
                    <div className="h-8 w-px bg-gradient-to-b from-zinc-700 to-transparent" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs font-black text-zinc-500">
                        <ArrowDown className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                        A Prova Real
                    </p>
                </div>
            </section>

            {/* ── 2. ANTES / DEPOIS ─────────────────────────────────────────── */}
            <section className="relative">
                {/* Step indicator overlay */}
                <div className="absolute top-8 left-0 right-0 z-20 flex justify-start px-4 sm:px-8 md:px-16">
                    <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-xs font-black text-amber-400">
                            2
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                            A Transformação Real
                        </p>
                    </div>
                </div>

                {/* Reutiliza o componente TransformationSection do /jejum */}
                <TransformationSection sectionClassName="pt-24 pb-12 sm:pt-28 sm:pb-16" />

                {/* Conector para o certificado */}
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

            {/* ── 3. CERTIFICADO ───────────────────────────────────────────── */}
            <section className="relative border-t border-zinc-800/50 py-16 sm:py-24">
                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-500/5 blur-3xl"
                />

                <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
                    {/* Step indicator */}
                    <div className="mb-10 flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-xs font-black text-amber-400">
                            3
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                            A Ciência por Trás da Transformação
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">

                        {/* ── Imagem do certificado ── */}
                        <div className="relative group">
                            {/* Glow externo */}
                            <div
                                aria-hidden
                                className="absolute -inset-2 rounded-3xl bg-amber-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 shadow-2xl shadow-black/60">
                                {/* Ribbon de autoridade */}
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

                                {/* Overlay sutil */}
                                <div
                                    aria-hidden
                                    className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent"
                                />
                            </div>
                        </div>

                        {/* ── Copy de autoridade ── */}
                        <div className="space-y-6">
                            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl leading-tight">
                                Eu não sou apenas{' '}
                                <span className="text-amber-400">um caso de sucesso.</span>
                            </h2>

                            <p className="text-[15px] leading-relaxed text-zinc-400">
                                Depois de derreter 25kg e recuperar minha biologia, eu não parei.
                                Me aprofundei na ciência do jejum com o{' '}
                                <strong className="text-zinc-200">Dr. Frank O'Neill</strong> — um dos
                                maiores especialistas mundiais em intermittent fasting — para entender
                                exatamente o que acontece a nível celular durante o jejum.
                            </p>

                            <p className="text-[15px] leading-relaxed text-zinc-400">
                                O resultado? O{' '}
                                <strong className="text-zinc-200">Protocolo Ancestral</strong> —
                                desenvolvido na intersecção entre{' '}
                                <strong className="text-zinc-200">
                                    ciência moderna e sabedoria ancestral
                                </strong>
                                . Não é opinião. É fisiologia.
                            </p>

                            {/* Quote */}
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

                            {/* Credenciais em chips */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    'Dr. Frank O\'Neill',
                                    'Intermittent Fasting',
                                    'Autofagia Celular',
                                    'Reprogramação Hormonal',
                                ].map((c) => (
                                    <span
                                        key={c}
                                        className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400"
                                    >
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Separador visual pós-Tríade ────────────────────────────────── */}
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
                        <Flame className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                DOR — O Inimigo
            ═══════════════════════════════════════════════════════════════ */}
            <section className="relative border-t border-zinc-800/50 py-20 sm:py-28">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                        O Diagnóstico
                    </p>
                    <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl leading-tight">
                        A prisão de comer<br className="hidden sm:block" />{' '}
                        a cada 3 horas.
                    </h2>

                    <div className="mt-8 grid gap-8 text-zinc-400 sm:grid-cols-2">
                        <div className="space-y-5 text-[15px] leading-relaxed">
                            <p>
                                A indústria alimentícia passou décadas te convencendo de que{' '}
                                <strong className="text-zinc-200">você precisa comer de 3 em 3 horas</strong>{' '}
                                para "manter o metabolismo acelerado". Isso não é ciência. É marketing de
                                ultraprocessados.
                            </p>
                            <p>
                                O resultado? Um corpo que <strong className="text-zinc-200">nunca descansa</strong>,
                                um sistema digestivo cronicamente inflamado e um cérebro dependente de glicose
                                que oscila entre picos e quedas brutais de energia.{' '}
                                <strong className="text-zinc-200">Névoa mental. Dependência de café. Irritabilidade.</strong>
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
                                <strong className="text-zinc-200">limpeza celular que nenhum suplemento consegue imitar.</strong>
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 rounded-2xl border border-red-500/15 bg-red-500/5 px-6 py-6">
                        <p className="mb-4 text-sm font-semibold text-red-400/80 uppercase tracking-widest">
                            Você se reconhece em algum desses sintomas?
                        </p>
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            {[
                                'Acorda cansado mesmo dormindo 8h',
                                'Precisa de café para funcionar até o meio-dia',
                                'Gordura abdominal que não sai com dieta',
                                'Falta de foco e clareza mental no trabalho',
                                'Humor instável e irritabilidade sem motivo',
                                'Digestão pesada e inchaço após as refeições',
                                'Libido baixa e disposição reduzida',
                                'Sensação de que o corpo "envelheceu" rápido',
                            ].map((s) => (
                                <div key={s} className="flex items-start gap-2.5 text-sm text-zinc-400">
                                    <span className="mt-0.5 h-4 w-4 rounded-full border border-red-500/40 bg-red-500/10 flex items-center justify-center text-[9px] text-red-400 font-bold flex-shrink-0">
                                        ✕
                                    </span>
                                    {s}
                                </div>
                            ))}
                        </div>
                        <p className="mt-5 text-sm font-semibold text-white">
                            Se marcou 3 ou mais:{' '}
                            <span className="text-amber-400">
                                você é exatamente o homem que esta mentoria vai transformar.
                            </span>
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                OS 3 PILARES
            ═══════════════════════════════════════════════════════════════ */}
            <section className="relative border-t border-zinc-800/50 py-20 sm:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/3 right-0 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl"
                />

                <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                            Como a mentoria funciona
                        </p>
                        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                            Três pilares. Um resultado.
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-zinc-500 text-[15px]">
                            Cada pilar foi desenvolvido para eliminar as desculpas e garantir
                            que você chegue ao fim da 4ª semana transformado.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                        {pillars.map((p, i) => (
                            <div
                                key={i}
                                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-amber-500/30 hover:bg-zinc-900/80"
                            >
                                <span
                                    aria-hidden
                                    className="absolute -right-3 -top-3 font-serif text-8xl font-bold text-zinc-800/50 select-none leading-none transition-colors group-hover:text-zinc-700/50"
                                >
                                    {i + 1}
                                </span>
                                <div className="relative">
                                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                                        <p.icon className="h-5 w-5" />
                                    </div>
                                    <span className="mb-3 inline-block rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-400">
                                        {p.tag}
                                    </span>
                                    <h3 className="font-serif text-xl font-bold text-white mb-2">{p.title}</h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed">{p.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                MÓDULOS — O Entregável (com nomes premium)
            ═══════════════════════════════════════════════════════════════ */}
            <section className="relative border-t border-zinc-800/50 py-20 sm:py-28">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="mb-14 text-center">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                            O que você recebe
                        </p>
                        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                            Conteúdo da mentoria
                        </h2>
                        <p className="mx-auto mt-3 max-w-lg text-zinc-500 text-[15px]">
                            Cada módulo foi construído sobre o resultado real — não teoria de livro.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {modules.map((mod) => (
                            <div
                                key={mod.number}
                                className={`rounded-2xl border p-6 sm:p-7 transition-colors hover:border-zinc-700 ${
                                    mod.isBonus
                                        ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/40'
                                        : 'border-zinc-800 bg-zinc-900'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div
                                        className={`flex-shrink-0 font-serif text-2xl font-black leading-none ${
                                            mod.isBonus ? 'text-amber-500' : 'text-zinc-700'
                                        }`}
                                    >
                                        {mod.number}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="font-serif text-lg font-bold text-white">
                                                {mod.title}
                                            </h3>
                                            {mod.isBonus && (
                                                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                                                    Bônus
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-zinc-500 mb-4">{mod.subtitle}</p>
                                        <ul className="grid gap-2 sm:grid-cols-2">
                                            {mod.items.map((item) => (
                                                <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
                                                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500/70" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                BENEFÍCIOS — Grid rápido
            ═══════════════════════════════════════════════════════════════ */}
            <section className="border-t border-zinc-800/50 py-16 sm:py-20">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="grid gap-5 sm:grid-cols-3">
                        {[
                            {
                                icon: Flame,
                                title: 'Queime a gordura de verdade',
                                text: 'Não com termogênico. Com cetose e autofagia ativadas pelo protocolo certo.',
                            },
                            {
                                icon: Brain,
                                title: 'Clareza mental de predador',
                                text: 'O estado de foco que seus ancestrais tinham durante a caça. Disponível para você.',
                            },
                            {
                                icon: Zap,
                                title: 'Energia sem dependência',
                                text: 'Liberte-se dos picos de glicose e da névoa pós-almoço. Energia estável o dia todo.',
                            },
                        ].map((b) => (
                            <div
                                key={b.title}
                                className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                            >
                                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                                    <b.icon className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="font-serif text-[15px] font-bold text-white mb-1">{b.title}</h4>
                                    <p className="text-xs text-zinc-500 leading-relaxed">{b.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                OFERTA — Preço + CTA Pulsante
            ═══════════════════════════════════════════════════════════════ */}
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
                    <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl mb-10">
                        Escolha entre pagar o preço agora{' '}
                        <br className="hidden sm:block" />
                        ou pagar com sua saúde depois.
                    </h2>

                    <div className="rounded-3xl border border-amber-500/25 bg-gradient-to-b from-zinc-900 to-zinc-900/60 p-8 sm:p-10 shadow-2xl shadow-amber-500/5">

                        {/* Deliverables */}
                        <div className="mb-8 space-y-2.5 text-left">
                            {deliverables.map((d) => (
                                <div key={d} className="flex items-center gap-3 text-sm text-zinc-300">
                                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                                        <Check className="h-3 w-3 text-amber-500" />
                                    </div>
                                    {d}
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-zinc-800 pt-8">
                            {/* Price anchor */}
                            <p className="text-sm text-zinc-500 line-through">
                                De {formatBRL(anchorPrice)}
                            </p>

                            {/* Real price */}
                            <div className="mt-1 flex flex-col items-center gap-1">
                                <p className="font-serif text-5xl font-black text-white sm:text-6xl">
                                    {formatBRL(realPrice)}
                                </p>
                                <p className="text-sm text-zinc-500">
                                    ou {formatInstallment(realPrice)}×12 no cartão
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
                                    <PulseCTA href={checkoutUrl} external={!!course.kiwifyUrl} />
                                )}
                            </div>

                            {/* Garantia */}
                            <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-3">
                                <Shield className="h-5 w-5 flex-shrink-0 text-amber-500/60" />
                                <p className="text-xs text-zinc-400 text-left leading-relaxed">
                                    <strong className="text-zinc-200">Garantia incondicional de 7 dias.</strong>{' '}
                                    Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do seu
                                    investimento. Sem perguntas.
                                </p>
                            </div>

                            <p className="mt-4 text-[11px] text-zinc-600">
                                Pagamento processado com segurança via Kiwify ·{' '}
                                Acesso liberado imediatamente após a confirmação
                            </p>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="mt-12 space-y-4 text-left">
                        {[
                            {
                                q: 'Para quem é essa mentoria?',
                                a: 'Para homens que querem controle real sobre sua biologia, saúde e clareza mental — e que estão dispostos a fazer o trabalho.',
                            },
                            {
                                q: 'Preciso ter experiência com jejum?',
                                a: 'Não. O programa começa do zero com protocolos progressivos. Se você nunca jejuou, melhor ainda — seu corpo vai responder mais rápido.',
                            },
                            {
                                q: 'Como funciona o acompanhamento?',
                                a: 'Grupo exclusivo + sessões ao vivo + suporte direto via mensagem. Você terá acesso a mim durante as 4 semanas completas.',
                            },
                        ].map((faq) => (
                            <div key={faq.q} className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
                                <p className="font-semibold text-sm text-white mb-1">{faq.q}</p>
                                <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA repetido no fim */}
                    {!isWaitlistOnly && (
                        <div className="mt-10">
                            <PulseCTA href={checkoutUrl} external={!!course.kiwifyUrl} />
                            <p className="mt-3 text-xs text-zinc-600">
                                Acesso imediato · Garantia incondicional de 7 dias
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                FOOTER MÍNIMO
            ═══════════════════════════════════════════════════════════════ */}
            <footer className="border-t border-zinc-800/50 py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <Link href="/" className="font-serif text-base font-bold text-amber-500">
                        O Ancestral
                    </Link>
                    <p className="text-xs text-zinc-600 text-center">
                        © {new Date().getFullYear()} O Ancestral · Todos os direitos reservados
                    </p>
                    <div className="flex gap-4 text-xs text-zinc-600">
                        <Link href="/cursos" className="hover:text-zinc-400 transition-colors">Cursos</Link>
                        <Link href="/sobre" className="hover:text-zinc-400 transition-colors">Sobre</Link>
                        <Link href="/contato" className="hover:text-zinc-400 transition-colors">Contato</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
