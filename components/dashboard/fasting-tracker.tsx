'use client';

import { useState, useEffect, useTransition, useCallback, useId } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Timer,
    TrendingDown,
    Flame,
    Zap,
    ShieldCheck,
    Crown,
    ChevronDown,
    ChevronUp,
    Loader2,
    CheckCircle2,
    Lock,
    History,
    Minus,
    Plus,
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { startFast, endFast, type OngoingFast } from '@/app/dashboard/fasting/actions';

// ─── Config ───────────────────────────────────────────────────────────────────

const TARGET_OPTIONS = [
    { hours: 12, label: '12 horas', sub: 'Fasting Base' },
    { hours: 16, label: '16 horas', sub: 'Leangains · 16:8' },
    { hours: 18, label: '18 horas', sub: 'Guerreiro · 18:6' },
    { hours: 24, label: '24 horas', sub: 'OMAD · Warrior Diet' },
    { hours: 36, label: '36 horas', sub: 'Protocolo Monk' },
    { hours: 48, label: '48 horas', sub: 'Jejum Ancestral' },
    { hours: 72, label: '72 horas', sub: 'Soberania Total' },
] as const;

// ─── Biological stages ────────────────────────────────────────────────────────

const STAGES = [
    {
        minHours: 0,
        maxHours: 12,
        label: 'Queda de Insulina',
        desc: 'Glicogênio se esgota. Insulina em queda livre. O corpo começa a mudar de combustível.',
        range: '0 – 12h',
        Icon: TrendingDown,
        colorText: 'text-sky-400',
        colorBg: 'bg-sky-500/10',
        colorBorder: 'border-sky-500/25',
        colorGlow: 'shadow-sky-500/10',
        colorDot: 'bg-sky-400',
        colorRing: '#38bdf8',
    },
    {
        minHours: 12,
        maxHours: 16,
        label: 'Queima de Gordura',
        desc: 'Beta-oxidação ativada. O corpo usa gordura como combustível primário.',
        range: '12 – 16h',
        Icon: Flame,
        colorText: 'text-orange-400',
        colorBg: 'bg-orange-500/10',
        colorBorder: 'border-orange-500/25',
        colorGlow: 'shadow-orange-500/10',
        colorDot: 'bg-orange-400',
        colorRing: '#fb923c',
    },
    {
        minHours: 16,
        maxHours: 24,
        label: 'Cetose Leve & Foco',
        desc: 'Corpos cetônicos alimentam o cérebro. Clareza mental e foco máximo.',
        range: '16 – 24h',
        Icon: Zap,
        colorText: 'text-yellow-400',
        colorBg: 'bg-yellow-500/10',
        colorBorder: 'border-yellow-500/25',
        colorGlow: 'shadow-yellow-500/10',
        colorDot: 'bg-yellow-400',
        colorRing: '#facc15',
    },
    {
        minHours: 24,
        maxHours: 48,
        label: 'Autofagia Celular',
        desc: 'Reciclagem profunda ativada. Células danificadas são eliminadas e renovadas.',
        range: '24 – 48h',
        Icon: ShieldCheck,
        colorText: 'text-red-400',
        colorBg: 'bg-red-500/10',
        colorBorder: 'border-red-500/25',
        colorGlow: 'shadow-red-500/10',
        colorDot: 'bg-red-400',
        colorRing: '#f87171',
    },
    {
        minHours: 48,
        maxHours: Infinity,
        label: 'Pico de GH & Reset Imune',
        desc: 'Hormônio do crescimento elevado. Reset imunológico. Soberania metabólica total.',
        range: '48 – 72h+',
        Icon: Crown,
        colorText: 'text-amber-400',
        colorBg: 'bg-amber-500/10',
        colorBorder: 'border-amber-500/25',
        colorGlow: 'shadow-amber-500/10',
        colorDot: 'bg-amber-400',
        colorRing: '#fbbf24',
    },
] as const;

// ─── Ring constants (viewBox basis) ──────────────────────────────────────────

const R  = 120;
const SW = 12;
const CX = R + SW;          // 132
const VB = CX * 2;          // 264  (viewBox square)
const CIRC = 2 * Math.PI * R; // ≈ 753.98

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n: number) { return String(n).padStart(2, '0'); }

function formatTime(s: number) {
    return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

type StageStatus = 'done' | 'active' | 'upcoming';

function getStatus(h: number, min: number, max: number): StageStatus {
    if (h >= max) return 'done';
    if (h >= min) return 'active';
    return 'upcoming';
}

// angle in degrees from 12-o'clock, clockwise → SVG coords
function polarPt(deg: number) {
    const r = ((deg - 90) * Math.PI) / 180;
    return { x: CX + R * Math.cos(r), y: CX + R * Math.sin(r) };
}

// ─── ProgressRing (SVG) ───────────────────────────────────────────────────────

function ProgressRing({
    progress,
    activeColor,
    targetHours,
    glowId,
    gradId,
}: {
    progress: number;
    activeColor: string;
    targetHours: number;
    glowId: string;
    gradId: string;
}) {
    const offset = CIRC * (1 - Math.min(progress, 1));

    const ticks = STAGES.slice(1)
        .map((s) => {
            const frac = s.minHours / targetHours;
            if (frac >= 1) return null;
            const pt = polarPt(frac * 360);
            return { ...pt, key: s.minHours };
        })
        .filter(Boolean) as { x: number; y: number; key: number }[];

    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${VB} ${VB}`}
            style={{ transform: 'rotate(-90deg)' }}
            aria-hidden
        >
            <defs>
                {/* Glow filter */}
                <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {/* Radial ambient */}
                <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={activeColor} stopOpacity="0.07" />
                    <stop offset="100%" stopColor={activeColor} stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Ambient fill */}
            <circle cx={CX} cy={CX} r={R} fill={`url(#${gradId})`} />

            {/* Track */}
            <circle
                cx={CX} cy={CX} r={R}
                fill="none"
                stroke="#18181b"
                strokeWidth={SW + 2}
                strokeLinecap="round"
            />
            <circle
                cx={CX} cy={CX} r={R}
                fill="none"
                stroke="#27272a"
                strokeWidth={SW}
                strokeLinecap="round"
            />

            {/* Stage tick marks */}
            {ticks.map(({ x, y, key }) => (
                <circle key={key} cx={x} cy={y} r={3.5} fill="#3f3f46" />
            ))}

            {/* Progress arc */}
            {progress > 0 && (
                <circle
                    cx={CX} cy={CX} r={R}
                    fill="none"
                    stroke={activeColor}
                    strokeWidth={SW}
                    strokeDasharray={CIRC}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    filter={`url(#${glowId})`}
                    style={{
                        transition: 'stroke-dashoffset 0.95s linear, stroke 0.6s ease',
                    }}
                />
            )}
        </svg>
    );
}

// ─── StageCard ────────────────────────────────────────────────────────────────

function StageCard({
    stage,
    status,
    index,
}: {
    stage: (typeof STAGES)[number];
    status: StageStatus;
    index: number;
}) {
    const { Icon, label, desc, range, colorText, colorBg, colorBorder, colorGlow, colorDot } = stage;
    const isActive  = status === 'active';
    const isDone    = status === 'done';
    const isLocked  = !isActive && !isDone;

    return (
        <div
            className={cn(
                'relative flex items-start gap-4 rounded-2xl border px-5 py-4 transition-all duration-500',
                isActive  && ['border', colorBorder, colorBg, 'shadow-lg', colorGlow],
                isDone    && 'border-zinc-800/60 bg-zinc-900/20 opacity-55',
                isLocked  && 'border-zinc-800/30 bg-transparent opacity-35',
            )}
        >
            {/* Stage number watermark */}
            <span
                className={cn(
                    'select-none font-mono text-4xl font-black leading-none tracking-tighter',
                    isActive ? colorText : 'text-zinc-800',
                )}
                aria-hidden
            >
                {String(index + 1).padStart(2, '0')}
            </span>

            {/* Icon */}
            <div
                className={cn(
                    'mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                    isActive ? colorBg : 'bg-zinc-800/40',
                )}
            >
                {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-zinc-600" />
                ) : isLocked ? (
                    <Lock className="h-4 w-4 text-zinc-700" />
                ) : (
                    <Icon className={cn('h-5 w-5', colorText, 'animate-pulse')} />
                )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center gap-2">
                    <p
                        className={cn(
                            'font-semibold leading-snug',
                            isActive ? colorText : isDone ? 'text-zinc-500' : 'text-zinc-700',
                        )}
                    >
                        {label}
                    </p>
                    {isActive && (
                        <span
                            className={cn(
                                'flex h-1.5 w-1.5 rounded-full animate-pulse',
                                colorDot,
                            )}
                        />
                    )}
                </div>
                {isActive && (
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">{desc}</p>
                )}
            </div>

            {/* Hours badge */}
            <span
                className={cn(
                    'shrink-0 self-start rounded-lg px-2.5 py-1 font-mono text-xs font-medium',
                    isActive ? [colorText, colorBg] : 'bg-zinc-800/40 text-zinc-700',
                )}
            >
                {range}
            </span>
        </div>
    );
}

// ─── FastingTracker ───────────────────────────────────────────────────────────

export function FastingTracker({ initialFast }: { initialFast: OngoingFast | null }) {
    const uid = useId();
    const glowId = `glow-${uid.replace(/:/g, '')}`;
    const gradId = `grad-${uid.replace(/:/g, '')}`;

    const [session,        setSession]        = useState<OngoingFast | null>(initialFast);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [targetHours,    setTargetHours]    = useState(16);
    const [retroEnabled,   setRetroEnabled]   = useState(false);
    const [retroHours,     setRetroHours]     = useState(1);
    const [isPending,      startTransition]   = useTransition();

    // Drift-proof ticker
    const startTick = useCallback((startTime: Date) => {
        const tick = () => setElapsedSeconds(Math.floor((Date.now() - startTime.getTime()) / 1000));
        tick();
        return setInterval(tick, 1000);
    }, []);

    useEffect(() => {
        if (!session) { setElapsedSeconds(0); return; }
        const id = startTick(new Date(session.startTime));
        return () => clearInterval(id);
    }, [session, startTick]);

    // Derived
    const elapsedHours = elapsedSeconds / 3600;
    const tgt          = session?.targetHours ?? targetHours;
    const progress     = session ? Math.min(elapsedSeconds / (tgt * 3600), 1) : 0;

    const activeStageIdx = STAGES.reduce<number>((acc, s, i) => elapsedHours >= s.minHours ? i : acc, 0);
    const activeStage    = STAGES[activeStageIdx];
    const ringColor      = session ? activeStage.colorRing : '#71717a';

    // Handlers
    // Clamp retroHours whenever targetHours changes so it stays in range
    const maxRetroHours = targetHours - 0.5;
    const clampedRetro  = Math.min(retroHours, Math.floor(maxRetroHours));

    const handleStart = () => {
        startTransition(async () => {
            const offset = retroEnabled ? clampedRetro : 0;
            const res = await startFast(targetHours, offset);
            if (res.success) {
                setSession(res.fast);
                const msg = offset > 0
                    ? `Protocolo ${targetHours}h iniciado com ${offset}h retroativas. Força!`
                    : `Protocolo ${targetHours}h iniciado. Força!`;
                toast.success(msg);
                setRetroEnabled(false);
            } else {
                toast.error(res.error);
            }
        });
    };

    const handleEnd = () => {
        if (!session) return;
        startTransition(async () => {
            const res = await endFast(session.id);
            if (res.success) {
                toast[res.status === 'COMPLETED' ? 'success' : 'message'](
                    res.status === 'COMPLETED'
                        ? `🏆 Protocolo concluído em ${formatTime(elapsedSeconds)}.`
                        : `Jejum interrompido em ${formatTime(elapsedSeconds)}.`,
                );
                setSession(null);
            } else {
                toast.error(res.error);
            }
        });
    };

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <div className="min-h-full bg-zinc-950 text-zinc-50">

            {/* ── Page header ─────────────────────────────────────────────── */}
            <div className="border-b border-zinc-800/60 px-6 py-5">
                <div className="mx-auto flex max-w-2xl items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="group flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        Voltar ao Painel
                    </Link>

                    <div className="flex flex-col items-center">
                        <h1 className="font-serif text-lg font-bold tracking-tight text-zinc-100 sm:text-xl">
                            A Forja
                        </h1>
                        <p className="text-xs text-zinc-600">Protocolo de Jejum</p>
                    </div>

                    {session ? (
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                            Em Jejum
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-600">
                            <Timer className="h-3 w-3" />
                            Inativo
                        </span>
                    )}
                </div>
            </div>

            {/* ── Main content ────────────────────────────────────────────── */}
            <div className="mx-auto max-w-2xl px-6 pb-24 pt-10">

                {/* ── Ring + clock ──────────────────────────────────────── */}
                <div className="flex flex-col items-center">
                    <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
                        <ProgressRing
                            progress={progress}
                            activeColor={ringColor}
                            targetHours={tgt}
                            glowId={glowId}
                            gradId={gradId}
                        />

                        {/* Overlay text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                            <span
                                className={cn(
                                    'font-mono font-black tabular-nums tracking-tighter leading-none',
                                    'text-5xl sm:text-6xl lg:text-7xl',
                                    session ? 'text-zinc-50' : 'text-zinc-700',
                                )}
                            >
                                {formatTime(elapsedSeconds)}
                            </span>

                            <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                                {session ? `Meta: ${tgt}h` : 'aguardando início'}
                            </span>

                            {session && progress > 0 && (
                                <span
                                    className="mt-2 text-xl font-black leading-none"
                                    style={{ color: ringColor }}
                                >
                                    {Math.round(progress * 100)}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Active stage pill */}
                    {session && (
                        <div
                            className={cn(
                                'mt-6 flex items-center gap-2.5 rounded-2xl border px-5 py-2.5',
                                activeStage.colorBg,
                                activeStage.colorBorder,
                                'border',
                            )}
                        >
                            <activeStage.Icon
                                className={cn('h-4 w-4', activeStage.colorText)}
                            />
                            <span
                                className={cn(
                                    'text-sm font-bold uppercase tracking-[0.12em]',
                                    activeStage.colorText,
                                )}
                            >
                                {activeStage.label}
                            </span>
                        </div>
                    )}

                    {!session && (
                        <p className="mt-6 text-sm text-zinc-600">
                            Selecione seu protocolo abaixo e inicie a forja.
                        </p>
                    )}
                </div>

                {/* ── Biological stages ─────────────────────────────────── */}
                <div className="mt-12">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                        Linha do Tempo Biológica
                    </p>
                    <div className="space-y-3">
                        {STAGES.map((stage, i) => (
                            <StageCard
                                key={stage.minHours}
                                stage={stage}
                                status={session ? getStatus(elapsedHours, stage.minHours, stage.maxHours) : 'upcoming'}
                                index={i}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Controls ──────────────────────────────────────────── */}
                <div className="mt-12">
                    {!session ? (
                        /* ── Start ──────────────────────────────────────── */
                        <div className="space-y-4">
                            {/* Protocol picker */}
                            <div>
                                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                                    Protocolo
                                </label>
                                <div className="relative">
                                    <select
                                        value={targetHours}
                                        onChange={(e) => setTargetHours(Number(e.target.value))}
                                        disabled={isPending}
                                        className={cn(
                                            'w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-900',
                                            'px-5 py-4 pr-12 text-base font-semibold text-zinc-200',
                                            'focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30',
                                            'disabled:opacity-50 cursor-pointer transition-colors',
                                        )}
                                    >
                                        {TARGET_OPTIONS.map((o) => (
                                            <option key={o.hours} value={o.hours}>
                                                {o.label} — {o.sub}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                                </div>
                            </div>

                            {/* Retroactive toggle */}
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setRetroEnabled((v) => !v)}
                                    className="flex w-full items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-zinc-800/50"
                                >
                                    <span className="flex items-center gap-2 text-zinc-400">
                                        <History className="h-4 w-4 text-amber-500/70" />
                                        Comecei antes e esqueci de registrar
                                    </span>
                                    {retroEnabled
                                        ? <ChevronUp className="h-4 w-4 text-zinc-600" />
                                        : <ChevronDown className="h-4 w-4 text-zinc-600" />
                                    }
                                </button>

                                {retroEnabled && (
                                    <div className="border-t border-zinc-800 px-4 pb-4 pt-3 space-y-3">
                                        <p className="text-xs text-zinc-600">
                                            Quantas horas atrás você iniciou o jejum?
                                        </p>

                                        {/* Stepper */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setRetroHours((h) => Math.max(1, h - 1))}
                                                disabled={clampedRetro <= 1}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 transition-colors hover:bg-zinc-700 disabled:opacity-30"
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>

                                            <div className="flex flex-1 flex-col items-center">
                                                <span className="font-mono text-3xl font-black text-amber-400 tabular-nums leading-none">
                                                    {clampedRetro}h
                                                </span>
                                                <span className="mt-1 text-[10px] text-zinc-600 tabular-nums">
                                                    início às {(() => {
                                                        const d = new Date(Date.now() - clampedRetro * 3_600_000);
                                                        return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                                    })()}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setRetroHours((h) => Math.min(Math.floor(maxRetroHours), h + 1))}
                                                disabled={clampedRetro >= Math.floor(maxRetroHours)}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 transition-colors hover:bg-zinc-700 disabled:opacity-30"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        <p className="text-[10px] text-zinc-700">
                                            Máximo: {Math.floor(maxRetroHours)}h (meta de {targetHours}h menos 30 min)
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Start button */}
                            <button
                                onClick={handleStart}
                                disabled={isPending}
                                className={cn(
                                    'group relative w-full overflow-hidden rounded-xl py-5',
                                    'bg-gradient-to-r from-amber-600 to-amber-500',
                                    'text-sm font-black uppercase tracking-[0.25em] text-zinc-950',
                                    'transition-all duration-200',
                                    'hover:from-amber-500 hover:to-amber-400',
                                    'hover:shadow-xl hover:shadow-amber-500/25',
                                    'active:scale-[0.985]',
                                    'disabled:cursor-not-allowed disabled:opacity-50',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
                                )}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2.5">
                                    {isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Iniciando protocolo…
                                        </>
                                    ) : (
                                        <>
                                            <Timer className="h-4 w-4" />
                                            {retroEnabled
                                                ? `Registrar · ${clampedRetro}h já feitas`
                                                : `Iniciar Protocolo · ${targetHours}h`}
                                        </>
                                    )}
                                </span>
                                {/* Shine sweep */}
                                <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-white/15 transition-transform duration-700 group-hover:translate-x-full" />
                            </button>
                        </div>
                    ) : (
                        /* ── Break ───────────────────────────────────────── */
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button
                                    disabled={isPending}
                                    className={cn(
                                        'w-full rounded-xl border-2 border-red-900/50 bg-transparent py-5',
                                        'text-sm font-black uppercase tracking-[0.2em] text-red-500',
                                        'transition-all duration-200',
                                        'hover:border-red-700 hover:bg-red-950/40 hover:text-red-400',
                                        'hover:shadow-xl hover:shadow-red-950/30',
                                        'active:scale-[0.985]',
                                        'disabled:cursor-not-allowed disabled:opacity-50',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
                                    )}
                                >
                                    {isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Encerrando…
                                        </span>
                                    ) : (
                                        '⚠  Quebrar Jejum'
                                    )}
                                </button>
                            </AlertDialogTrigger>

                            <AlertDialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="font-serif text-xl text-red-400">
                                        Quebrar o jejum agora?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription asChild>
                                        <div className="space-y-3 pt-1 text-zinc-500">
                                            <p>
                                                Você está há{' '}
                                                <span className="font-bold text-zinc-200">
                                                    {formatTime(elapsedSeconds)}
                                                </span>{' '}
                                                em jejum —{' '}
                                                <span className="font-bold text-zinc-200">
                                                    {Math.round(progress * 100)}% da meta de {tgt}h.
                                                </span>
                                            </p>
                                            <p>
                                                Seu corpo está em estágio de{' '}
                                                <span className={cn('font-semibold', activeStage.colorText)}>
                                                    {activeStage.label}
                                                </span>
                                                . Quebrar agora interrompe esse processo.
                                            </p>
                                            <p className="font-medium text-zinc-400">
                                                Você tem certeza absoluta?
                                            </p>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-2">
                                    <AlertDialogCancel className="flex-1 border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white">
                                        Continuar o jejum
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleEnd}
                                        className="flex-1 bg-red-800 text-white hover:bg-red-700"
                                    >
                                        Sim, quebrar agora
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>
        </div>
    );
}
