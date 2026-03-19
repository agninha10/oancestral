'use client';

import { useState, useEffect, useRef, useTransition, useCallback } from 'react';
import { toast } from 'sonner';
import {
    Timer,
    TrendingDown,
    Flame,
    Zap,
    ShieldCheck,
    Crown,
    ChevronDown,
    Loader2,
    CheckCircle2,
    Lock,
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

// ─── Constants ────────────────────────────────────────────────────────────────

const TARGET_OPTIONS = [
    { hours: 12, label: '12h — Fasting Base' },
    { hours: 16, label: '16h — Leangains (16:8)' },
    { hours: 18, label: '18h — Guerreiro (18:6)' },
    { hours: 24, label: '24h — OMAD (Warrior)' },
    { hours: 36, label: '36h — Protocolo Monk' },
    { hours: 48, label: '48h — Jejum Ancestral' },
    { hours: 72, label: '72h — Soberania Total' },
] as const;

// ─── Biological stages ────────────────────────────────────────────────────────

const STAGES = [
    {
        minHours: 0,
        maxHours: 12,
        label: 'Queda de Insulina',
        desc: 'Glicogênio se esgota, insulina em queda livre',
        range: '0h – 12h',
        Icon: TrendingDown,
        colorText: 'text-sky-400',
        colorBg: 'bg-sky-400/10',
        colorBorder: 'border-sky-500/40',
        colorGlow: '[box-shadow:0_0_20px_rgba(56,189,248,0.15)]',
        colorDot: 'bg-sky-400',
        colorRing: '#38bdf8',
    },
    {
        minHours: 12,
        maxHours: 16,
        label: 'Queima de Gordura',
        desc: 'Beta-oxidação ativa, lipólise acelerada',
        range: '12h – 16h',
        Icon: Flame,
        colorText: 'text-orange-400',
        colorBg: 'bg-orange-400/10',
        colorBorder: 'border-orange-500/40',
        colorGlow: '[box-shadow:0_0_20px_rgba(251,146,60,0.15)]',
        colorDot: 'bg-orange-400',
        colorRing: '#fb923c',
    },
    {
        minHours: 16,
        maxHours: 24,
        label: 'Cetose Leve & Foco',
        desc: 'Corpos cetônicos alimentando o cérebro',
        range: '16h – 24h',
        Icon: Zap,
        colorText: 'text-yellow-400',
        colorBg: 'bg-yellow-400/10',
        colorBorder: 'border-yellow-500/40',
        colorGlow: '[box-shadow:0_0_20px_rgba(250,204,21,0.15)]',
        colorDot: 'bg-yellow-400',
        colorRing: '#facc15',
    },
    {
        minHours: 24,
        maxHours: 48,
        label: 'Autofagia Celular',
        desc: 'Reciclagem profunda ativada — células se renovam',
        range: '24h – 48h',
        Icon: ShieldCheck,
        colorText: 'text-red-400',
        colorBg: 'bg-red-400/10',
        colorBorder: 'border-red-500/40',
        colorGlow: '[box-shadow:0_0_20px_rgba(248,113,113,0.15)]',
        colorDot: 'bg-red-400',
        colorRing: '#f87171',
    },
    {
        minHours: 48,
        maxHours: Infinity,
        label: 'Pico de GH & Reset Imune',
        desc: 'Soberania metabólica total — GH elevado',
        range: '48h – 72h+',
        Icon: Crown,
        colorText: 'text-amber-400',
        colorBg: 'bg-amber-400/10',
        colorBorder: 'border-amber-500/40',
        colorGlow: '[box-shadow:0_0_24px_rgba(251,191,36,0.2)]',
        colorDot: 'bg-amber-400',
        colorRing: '#fbbf24',
    },
] as const;

// ─── Ring constants ───────────────────────────────────────────────────────────

const R = 88;
const SW = 10;          // stroke-width
const CX = R + SW;      // centre x = 98
const SIZE = CX * 2;    // 196px
const CIRC = 2 * Math.PI * R; // ≈ 552.9

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n: number) {
    return String(n).padStart(2, '0');
}

function formatTime(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

type StageStatus = 'done' | 'active' | 'upcoming';

function stageStatus(elapsedHours: number, min: number, max: number): StageStatus {
    if (elapsedHours >= max) return 'done';
    if (elapsedHours >= min) return 'active';
    return 'upcoming';
}

// Polar → cartesian for stage tick marks on ring (origin at top, clockwise)
function polar(deg: number): { x: number; y: number } {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: CX + R * Math.cos(rad), y: CX + R * Math.sin(rad) };
}

// ─── ProgressRing ─────────────────────────────────────────────────────────────

interface RingProps {
    progress: number;      // 0 – 1
    elapsedSeconds: number;
    targetHours: number;
    activeColor: string;   // hex
}

function ProgressRing({ progress, elapsedSeconds, targetHours, activeColor }: RingProps) {
    const offset = CIRC * (1 - Math.min(progress, 1));
    const glowId = 'fasting-glow';

    // Stage tick marks (angles = stageMinHours/targetHours × 360°)
    const ticks = STAGES.slice(1).map((s) => {
        const frac = s.minHours / targetHours;
        if (frac >= 1) return null;
        const { x, y } = polar(frac * 360);
        return { x, y, key: s.minHours };
    }).filter(Boolean) as { x: number; y: number; key: number }[];

    return (
        <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{ transform: 'rotate(-90deg)' }}
            aria-hidden
        >
            <defs>
                <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {/* Subtle radial background */}
                <radialGradient id="ring-bg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={activeColor} stopOpacity="0.04" />
                    <stop offset="100%" stopColor={activeColor} stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Background fill glow */}
            <circle cx={CX} cy={CX} r={R} fill="url(#ring-bg)" />

            {/* Track */}
            <circle
                cx={CX}
                cy={CX}
                r={R}
                fill="none"
                stroke="#27272a"
                strokeWidth={SW}
                strokeLinecap="round"
            />

            {/* Stage tick marks */}
            {ticks.map(({ x, y, key }) => (
                <circle
                    key={key}
                    cx={x}
                    cy={y}
                    r={3}
                    fill="#3f3f46"
                    style={{ transform: 'rotate(90deg)', transformOrigin: `${x}px ${y}px` }}
                />
            ))}

            {/* Progress arc */}
            {progress > 0 && (
                <circle
                    cx={CX}
                    cy={CX}
                    r={R}
                    fill="none"
                    stroke={activeColor}
                    strokeWidth={SW}
                    strokeDasharray={CIRC}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    filter={`url(#${glowId})`}
                    style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.6s ease' }}
                />
            )}
        </svg>
    );
}

// ─── StageRow ─────────────────────────────────────────────────────────────────

function StageRow({
    stage,
    status,
}: {
    stage: (typeof STAGES)[number];
    status: StageStatus;
}) {
    const { Icon, label, desc, range, colorText, colorBg, colorBorder, colorGlow, colorDot } = stage;
    const isActive = status === 'active';
    const isDone = status === 'done';

    return (
        <div
            className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-500',
                isActive && [colorBg, colorBorder, 'border', colorGlow],
                isDone && 'opacity-50',
                !isActive && !isDone && 'opacity-40',
            )}
        >
            {/* Status dot / icon */}
            <div className="relative flex shrink-0 items-center justify-center">
                <div
                    className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full',
                        isActive ? colorBg : 'bg-zinc-800/60',
                    )}
                >
                    {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-zinc-500" />
                    ) : !isActive ? (
                        <Lock className="h-3.5 w-3.5 text-zinc-700" />
                    ) : (
                        <Icon
                            className={cn('h-4.5 w-4.5', colorText, isActive && 'animate-pulse')}
                        />
                    )}
                </div>
                {isActive && (
                    <span
                        className={cn(
                            'absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-950',
                            colorDot,
                            'animate-pulse',
                        )}
                    />
                )}
            </div>

            {/* Label */}
            <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                    <span
                        className={cn(
                            'text-sm font-semibold leading-none',
                            isActive ? colorText : isDone ? 'text-zinc-500' : 'text-zinc-600',
                        )}
                    >
                        {label}
                    </span>
                    <span className="text-[10px] text-zinc-700">{range}</span>
                </div>
                {isActive && (
                    <p className="mt-0.5 text-xs leading-tight text-zinc-500">{desc}</p>
                )}
            </div>

            {/* Status badge */}
            {isActive && (
                <span
                    className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                        colorText,
                        colorBg,
                    )}
                >
                    ATIVO
                </span>
            )}
            {isDone && (
                <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium uppercase text-zinc-600">
                    Concluído
                </span>
            )}
        </div>
    );
}

// ─── FastingTracker ───────────────────────────────────────────────────────────

interface FastingTrackerProps {
    initialFast: OngoingFast | null;
}

export function FastingTracker({ initialFast }: FastingTrackerProps) {
    const [session, setSession] = useState<OngoingFast | null>(initialFast);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [targetHours, setTargetHours] = useState(16);
    const [isPending, startTransition] = useTransition();

    // Stable interval — derived from session.startTime at mount/session-change
    const startTick = useCallback((startTime: Date) => {
        const tick = () => {
            setElapsedSeconds(Math.floor((Date.now() - startTime.getTime()) / 1000));
        };
        tick(); // immediate first tick
        return setInterval(tick, 1000);
    }, []);

    useEffect(() => {
        if (!session) {
            setElapsedSeconds(0);
            return;
        }
        const id = startTick(new Date(session.startTime));
        return () => clearInterval(id);
    }, [session, startTick]); // session.id changes → new interval

    // Derived values
    const elapsedHours = elapsedSeconds / 3600;
    const activeSess = session;
    const tgt = activeSess?.targetHours ?? targetHours;
    const progress = activeSess ? Math.min(elapsedSeconds / (tgt * 3600), 1) : 0;

    // Active stage (last stage whose minHours the user has passed)
    const activeStageIdx = STAGES.reduce<number>((acc, s, i) => {
        return elapsedHours >= s.minHours ? i : acc;
    }, 0);
    const activeStage = STAGES[activeStageIdx];

    // Pick ring colour from active stage
    const ringColor = activeSess ? activeStage.colorRing : '#f59e0b';

    // ── Handlers ────────────────────────────────────────────────────────────

    const handleStart = () => {
        startTransition(async () => {
            const result = await startFast(targetHours);
            if (result.success) {
                setSession(result.fast);
                toast.success(`Protocolo ${targetHours}h iniciado. Força!`);
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleEnd = () => {
        if (!session) return;
        startTransition(async () => {
            const result = await endFast(session.id);
            if (result.success) {
                const elapsed = formatTime(elapsedSeconds);
                if (result.status === 'COMPLETED') {
                    toast.success(`🏆 Jejum concluído em ${elapsed}. Missão cumprida!`);
                } else {
                    toast(`Jejum interrompido em ${elapsed}.`, { icon: '🔴' });
                }
                setSession(null);
            } else {
                toast.error(result.error);
            }
        });
    };

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60">

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 px-6 py-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                        <Timer className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-200">
                            Protocolo de Jejum
                        </h2>
                        <p className="text-xs text-zinc-600">Fasting Tracker</p>
                    </div>
                </div>

                {session && (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        EM JEJUM
                    </span>
                )}
            </div>

            {/* ── Ring + timer ─────────────────────────────────────────────── */}
            <div className="flex flex-col items-center px-6 py-8">
                <div className="relative">
                    <ProgressRing
                        progress={progress}
                        elapsedSeconds={elapsedSeconds}
                        targetHours={tgt}
                        activeColor={ringColor}
                    />

                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                        <span className="font-mono text-[2.6rem] font-bold leading-none tracking-tight text-white tabular-nums">
                            {formatTime(elapsedSeconds)}
                        </span>
                        <span className="text-xs font-medium text-zinc-500">
                            meta{' '}
                            <span className="text-zinc-400">{tgt}h</span>
                        </span>
                        {session && (
                            <span
                                className="mt-1 text-sm font-bold"
                                style={{ color: ringColor }}
                            >
                                {Math.round(progress * 100)}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Active stage headline */}
                {session && (
                    <div className="mt-4 text-center">
                        <p
                            className={cn(
                                'text-xs font-semibold uppercase tracking-[0.15em]',
                                activeStage.colorText,
                            )}
                        >
                            <activeStage.Icon className="mr-1.5 inline h-3.5 w-3.5" />
                            {activeStage.label}
                        </p>
                    </div>
                )}
            </div>

            {/* ── Stages timeline ──────────────────────────────────────────── */}
            <div className="space-y-1 px-4 pb-5">
                {STAGES.map((stage) => (
                    <StageRow
                        key={stage.minHours}
                        stage={stage}
                        status={
                            session
                                ? stageStatus(elapsedHours, stage.minHours, stage.maxHours)
                                : 'upcoming'
                        }
                    />
                ))}
            </div>

            {/* ── Controls ─────────────────────────────────────────────────── */}
            <div className="border-t border-zinc-800/60 px-6 pb-6 pt-5">
                {!session ? (
                    <div className="space-y-3">
                        {/* Target selector */}
                        <div className="relative">
                            <select
                                value={targetHours}
                                onChange={(e) => setTargetHours(Number(e.target.value))}
                                disabled={isPending}
                                className={cn(
                                    'w-full appearance-none rounded-xl border border-zinc-700 bg-zinc-900',
                                    'px-4 py-3 pr-10 text-sm font-medium text-zinc-200',
                                    'focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30',
                                    'disabled:opacity-50 cursor-pointer transition-colors',
                                )}
                            >
                                {TARGET_OPTIONS.map((o) => (
                                    <option key={o.hours} value={o.hours}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        </div>

                        {/* Start button */}
                        <button
                            onClick={handleStart}
                            disabled={isPending}
                            className={cn(
                                'group relative w-full overflow-hidden rounded-xl px-6 py-4',
                                'bg-gradient-to-r from-amber-600 to-amber-500',
                                'text-sm font-black uppercase tracking-[0.2em] text-zinc-950',
                                'transition-all duration-200',
                                'hover:from-amber-500 hover:to-amber-400 hover:shadow-lg hover:shadow-amber-500/30',
                                'active:scale-[0.98]',
                                'disabled:cursor-not-allowed disabled:opacity-50',
                                'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-950',
                            )}
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Iniciando…
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Timer className="h-4 w-4" />
                                    Iniciar Protocolo {targetHours}h
                                </span>
                            )}
                            {/* Shine sweep */}
                            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/10 skew-x-12 transition-transform duration-500 group-hover:translate-x-full" />
                        </button>
                    </div>
                ) : (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                disabled={isPending}
                                className={cn(
                                    'w-full rounded-xl border border-red-900/60 bg-red-950/40 px-6 py-3.5',
                                    'text-sm font-bold uppercase tracking-[0.15em] text-red-400',
                                    'transition-all duration-200',
                                    'hover:border-red-700/80 hover:bg-red-900/50 hover:text-red-300 hover:shadow-lg hover:shadow-red-900/20',
                                    'active:scale-[0.98]',
                                    'disabled:cursor-not-allowed disabled:opacity-50',
                                    'focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:ring-offset-zinc-950',
                                )}
                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Encerrando…
                                    </span>
                                ) : (
                                    '⚠ Quebrar Jejum'
                                )}
                            </button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-red-400">
                                    Quebrar o jejum agora?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="space-y-2 text-zinc-500">
                                    <span className="block">
                                        Você está há{' '}
                                        <span className="font-bold text-zinc-300">
                                            {formatTime(elapsedSeconds)}
                                        </span>{' '}
                                        em jejum —{' '}
                                        <span className="font-bold text-zinc-300">
                                            {Math.round(progress * 100)}% da meta.
                                        </span>
                                    </span>
                                    <span className="block">
                                        O corpo está{' '}
                                        <span className={cn('font-semibold', activeStage.colorText)}>
                                            {activeStage.label.toLowerCase()}
                                        </span>
                                        . Quebrar agora interrompe esse processo.
                                    </span>
                                    <span className="block font-medium text-zinc-400">
                                        Você tem certeza absoluta?
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white">
                                    Continuar o jejum
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleEnd}
                                    className="bg-red-800 text-white hover:bg-red-700"
                                >
                                    Sim, quebrar agora
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </div>
    );
}
