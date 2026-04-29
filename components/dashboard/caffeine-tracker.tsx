'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import {
    Brain,
    Zap,
    Moon,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Trophy,
    ChevronDown,
    ChevronUp,
    XCircle,
    Play,
    History,
    BookOpen,
    Activity,
    Coffee,
} from 'lucide-react';
import {
    startDetox,
    endDetox,
    type OngoingDetox,
    type CaffeineProtocol,
    type DetoxHistoryItem,
    type DetoxStats,
} from '@/app/dashboard/caffeine/actions';

// ─── Estágios biológicos ──────────────────────────────────────────────────────

type Stage = {
    minHours: number;
    maxHours: number;
    title: string;
    subtitle: string;
    description: string;
    color: 'zinc' | 'yellow' | 'orange' | 'red' | 'amber' | 'emerald' | 'green';
    icon: React.ElementType;
    intensity: number; // 0–100 para a barra de abstinência
};

const DETOX_STAGES: Stage[] = [
    {
        minHours: 0,
        maxHours: 6,
        title: 'Cafeína Circulando',
        subtitle: 'Sistema ainda sob influência',
        description:
            'A cafeína possui meia-vida de ~5 horas. Seu organismo ainda processa a última dose. Os receptores de adenosina permanecem bloqueados.',
        color: 'zinc',
        icon: Coffee,
        intensity: 10,
    },
    {
        minHours: 6,
        maxHours: 12,
        title: 'Primeiros Sinais',
        subtitle: 'Receptores começam a "gritar"',
        description:
            'Com a cafeína diminuindo, os receptores de adenosina acumulados começam a se ativar. Leve dor de cabeça e cansaço surgem — esses são os sinais que a cafeína estava mascarando.',
        color: 'yellow',
        icon: AlertTriangle,
        intensity: 40,
    },
    {
        minHours: 12,
        maxHours: 24,
        title: 'Pico de Abstinência',
        subtitle: 'Vasodilatação + dor de cabeça intensa',
        description:
            'Sem cafeína para constringir os vasos sanguíneos, ocorre vasodilatação intensa — causando dores de cabeça pulsantes. Este é o pico de abstinência. A tempestade antes da calma.',
        color: 'red',
        icon: AlertTriangle,
        intensity: 90,
    },
    {
        minHours: 24,
        maxHours: 48,
        title: 'Crise de Recalibração',
        subtitle: 'Letargia máxima',
        description:
            'O organismo ainda busca o estimulante ausente. Fadiga profunda, irritabilidade e dificuldade de foco são normais. Hidrate-se e descanse — o sistema está se reorganizando.',
        color: 'orange',
        icon: Zap,
        intensity: 75,
    },
    {
        minHours: 48,
        maxHours: 72,
        title: 'A Virada',
        subtitle: 'Abstinência diminuindo',
        description:
            'Os sintomas mais agudos cedem. O corpo começa a produzir energia de forma endógena. Pequenas vitórias de foco e clareza começam a emergir.',
        color: 'amber',
        icon: Activity,
        intensity: 45,
    },
    {
        minHours: 72,
        maxHours: 168,
        title: 'Receptores Recalibrando',
        subtitle: '72h — Marco de recalibração neural',
        description:
            'Os receptores de adenosina começam a se normalizar — reduzindo em número e aumentando em sensibilidade. O sono começa a se aprofundar. A fadiga crônica cede lugar a um cansaço natural e saudável.',
        color: 'amber',
        icon: Brain,
        intensity: 25,
    },
    {
        minHours: 168,
        maxHours: 336,
        title: 'Sono REM Restaurado',
        subtitle: '7 dias — Sonhos vívidos, recuperação profunda',
        description:
            'Sem a supressão do sono REM causada pela cafeína, os sonhos voltam com intensidade. A memória melhora. O cortisol matinal segue seu ritmo natural — você desperta com energia real.',
        color: 'green',
        icon: Moon,
        intensity: 10,
    },
    {
        minHours: 336,
        maxHours: Infinity,
        title: 'Sistema Livre',
        subtitle: '14+ dias — Soberania biológica',
        description:
            'Energia estável sem picos e quedas. Testosterona otimizada. Sono profundo. O sistema nervoso autônomo opera sem a interferência do estimulante externo. Você atingiu a soberania biológica.',
        color: 'emerald',
        icon: CheckCircle2,
        intensity: 0,
    },
];

function getStage(elapsedHours: number): Stage {
    return (
        DETOX_STAGES.find(
            (s) => elapsedHours >= s.minHours && elapsedHours < s.maxHours
        ) ?? DETOX_STAGES[DETOX_STAGES.length - 1]
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): { d: number; h: number; m: number; s: number } {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { d, h, m, s };
}

function pad(n: number) {
    return String(n).padStart(2, '0');
}

function formatHistoryDuration(seconds: number): string {
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}min`;
    return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
}

const PROTOCOL_COLOR: Record<CaffeineProtocol, string> = {
    PROGRESSIVE: 'text-amber-400',
    COLD_TURKEY: 'text-red-400',
};

const STATUS_COLOR: Record<string, string> = {
    COMPLETED: 'text-emerald-400',
    ABANDONED: 'text-zinc-500',
    ONGOING: 'text-amber-400',
};

// ─── Seções educativas ────────────────────────────────────────────────────────

const EDUCATION_SECTIONS = [
    {
        id: 'adenosina',
        icon: Brain,
        title: 'O Sequestro da Adenosina',
        tag: 'Neurobiologia',
        tagColor: 'text-amber-500 bg-amber-500/10',
        content: [
            {
                heading: 'Cafeína não dá energia — ela rouba o sono',
                body: 'O cérebro possui receptores especializados para adenosina, um neurotransmissor que se acumula durante o dia e sinaliza cansaço. Quando você dorme, a adenosina é "limpa". Quando acorda, os receptores estão vazios — esse é o alertismo natural.',
            },
            {
                heading: 'O bloqueio molecular',
                body: 'A cafeína possui estrutura molecular quase idêntica à adenosina. Ela se encaixa nos mesmos receptores — mas não os ativa. É um agente bloqueador: senta no receptor, impede a adenosina de sinalizar cansaço, mas não gera energia real. A adenosina continua se acumulando nos bastidores.',
            },
            {
                heading: 'A conta chega',
                body: 'Quando a cafeína é metabolizada (meia-vida ~5h), toda a adenosina acumulada invade os receptores de uma vez. O resultado: fadiga repentina, irritabilidade, dores de cabeça. O "crash" do café não é falta de energia — é o pagamento adiado da dívida de sono.',
            },
        ],
    },
    {
        id: 'cortisol',
        icon: Zap,
        title: 'O Ciclo do Cortisol',
        tag: 'Hormônios',
        tagColor: 'text-red-400 bg-red-500/10',
        content: [
            {
                heading: 'Café e o modo de sobrevivência',
                body: 'Cafeína estimula as glândulas suprarrenais a liberarem adrenalina e cortisol — os hormônios de "luta ou fuga". Em doses moderadas, isso produz foco. Em excesso crônico, mantém o corpo em estado permanente de alerta.',
            },
            {
                heading: 'O que o cortisol cronicamente elevado faz',
                body: 'Cortisol alto à noite destrói o sono profundo. Sem sono profundo, a testosterona não é produzida adequadamente — ela é sintetizada principalmente durante o sono de ondas lentas. O resultado: homens com cafeína excessiva têm ciclos de fadiga, irritabilidade e baixo humor crônico.',
            },
            {
                heading: 'O jantar com inimigos silenciosos',
                body: 'Consumir café após as 14h significa cortisol elevado até a hora de dormir. O sono fica fragmentado, o sono REM suprimido, a recuperação muscular prejudicada. Um terço da vida gastos em sono de baixa qualidade por causa de um hábito diurno.',
            },
        ],
    },
    {
        id: 'protocolo',
        icon: Activity,
        title: 'Desmame vs. Cold Turkey',
        tag: 'Protocolo',
        tagColor: 'text-emerald-400 bg-emerald-500/10',
        content: [
            {
                heading: 'Desmame Progressivo — para a maioria',
                body: 'Reduza 25% da dose a cada 3–5 dias. Se consome 4 cafés/dia: vá para 3, depois 2, depois 1, depois zero. Os sintomas são suaves — leve dor de cabeça, fadiga gerenciável. Ideal para quem não pode interromper produtividade.',
            },
            {
                heading: 'Cold Turkey — choque de sistema',
                body: 'Suspensão total e imediata. Sintomas intensos nos primeiros 2–3 dias (dores de cabeça pulsantes, letargia, irritabilidade). Porém, a recalibração dos receptores de adenosina é mais rápida e completa. Para guerreiros que preferem um sofrimento curto e intenso a um longo e arrastado.',
            },
            {
                heading: 'O que esperar nos primeiros 7 dias',
                body: 'Dias 1–2: sintomas de abstinência. Dia 3: virada. Dias 4–5: clareza mental emergindo. Dia 7: sono REM voltando com força. A maioria relata que a qualidade de energia sem cafeína supera a com cafeína após 2 semanas de adaptação.',
            },
        ],
    },
];

// ─── Componente Principal ─────────────────────────────────────────────────────

interface CaffeineTrackerProps {
    initialDetox: OngoingDetox | null;
    history: DetoxHistoryItem[];
    stats: DetoxStats;
}

export function CaffeineTracker({ initialDetox, history, stats }: CaffeineTrackerProps) {
    const [activeDetox, setActiveDetox] = useState<OngoingDetox | null>(initialDetox);
    const [elapsed, setElapsed] = useState(0);
    const [activeTab, setActiveTab] = useState<'tracker' | 'education' | 'history'>('tracker');
    const [selectedProtocol, setSelectedProtocol] = useState<CaffeineProtocol>('PROGRESSIVE');
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [showEndDialog, setShowEndDialog] = useState(false);
    const [endNotes, setEndNotes] = useState('');
    const [isPending, startTransition] = useTransition();

    // Atualiza o elapsed a cada segundo
    useEffect(() => {
        if (!activeDetox) { setElapsed(0); return; }
        const calc = () =>
            Math.floor((Date.now() - new Date(activeDetox.startTime).getTime()) / 1000);
        setElapsed(calc());
        const interval = setInterval(() => setElapsed(calc()), 1000);
        return () => clearInterval(interval);
    }, [activeDetox]);

    const elapsedHours = elapsed / 3600;
    const stage = getStage(elapsedHours);
    const { d, h, m, s } = formatDuration(elapsed);

    const handleStart = useCallback(() => {
        startTransition(async () => {
            try {
                const detox = await startDetox(selectedProtocol);
                setActiveDetox(detox);
                setActiveTab('tracker');
            } catch {
                // handled silently
            }
        });
    }, [selectedProtocol]);

    const handleEnd = useCallback(
        (status: 'COMPLETED' | 'ABANDONED') => {
            if (!activeDetox) return;
            startTransition(async () => {
                try {
                    await endDetox(activeDetox.id, status, endNotes || undefined);
                    setActiveDetox(null);
                    setShowEndDialog(false);
                    setEndNotes('');
                } catch {
                    // handled silently
                }
            });
        },
        [activeDetox, endNotes]
    );

    // ── Cor do estágio ──────────────────────────────────────────────────────
    const stageColors: Record<Stage['color'], { border: string; bg: string; text: string; bar: string }> = {
        zinc:    { border: 'border-zinc-700',    bg: 'bg-zinc-800/50',    text: 'text-zinc-400',   bar: 'bg-zinc-600' },
        yellow:  { border: 'border-yellow-500/40', bg: 'bg-yellow-500/5',  text: 'text-yellow-400', bar: 'bg-yellow-500' },
        orange:  { border: 'border-orange-500/40', bg: 'bg-orange-500/5',  text: 'text-orange-400', bar: 'bg-orange-500' },
        red:     { border: 'border-red-500/40',    bg: 'bg-red-500/5',     text: 'text-red-400',    bar: 'bg-red-500' },
        amber:   { border: 'border-amber-500/40',  bg: 'bg-amber-500/5',   text: 'text-amber-400',  bar: 'bg-amber-500' },
        green:   { border: 'border-green-500/40',  bg: 'bg-green-500/5',   text: 'text-green-400',  bar: 'bg-green-500' },
        emerald: { border: 'border-emerald-500/40',bg: 'bg-emerald-500/5', text: 'text-emerald-400',bar: 'bg-emerald-500' },
    };
    const sc = stageColors[stage.color];

    return (
        <div className="min-h-screen bg-zinc-950 pb-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 space-y-6">

                {/* ── Cabeçalho ─────────────────────────────────────────────── */}
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
                        Protocolo do Clã
                    </p>
                    <h1 className="font-serif text-3xl font-bold text-zinc-100">
                        Desligamento de Cafeína
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Recalibre seus receptores. Recupere o sono profundo.
                    </p>
                </div>

                {/* ── Abas ──────────────────────────────────────────────────── */}
                <div className="flex gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
                    {(
                        [
                            { id: 'tracker', label: 'Rastreador', icon: Clock },
                            { id: 'education', label: 'Guia', icon: BookOpen },
                            { id: 'history', label: 'Histórico', icon: History },
                        ] as const
                    ).map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
                                activeTab === id
                                    ? 'bg-amber-500 text-zinc-950'
                                    : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>

                {/* ════════════════════════════════════════════════════════════
                    ABA: RASTREADOR
                ════════════════════════════════════════════════════════════ */}
                {activeTab === 'tracker' && (
                    <div className="space-y-5">

                        {/* ── Estado ativo ─────────────────────────────────── */}
                        {activeDetox ? (
                            <>
                                {/* Relógio Principal */}
                                <div
                                    className={`rounded-2xl border ${sc.border} ${sc.bg} p-6 text-center space-y-4`}
                                >
                                    <div className="flex justify-center">
                                        <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 border ${sc.border}`}>
                                            <stage.icon className={`h-7 w-7 ${sc.text}`} />
                                        </div>
                                    </div>

                                    {/* Timer DD:HH:MM:SS */}
                                    <div>
                                        <div className="font-mono text-5xl font-bold tracking-tight text-zinc-100 tabular-nums">
                                            {d > 0 && (
                                                <span>{pad(d)}<span className="text-2xl text-zinc-600">d </span></span>
                                            )}
                                            {pad(h)}<span className="text-2xl text-zinc-600">h </span>
                                            {pad(m)}<span className="text-2xl text-zinc-600">m </span>
                                            {pad(s)}<span className="text-2xl text-zinc-600">s</span>
                                        </div>
                                        <p className="mt-1 text-xs text-zinc-600 uppercase tracking-widest">
                                            sem cafeína
                                        </p>
                                    </div>

                                    {/* Stage info */}
                                    <div className="space-y-1">
                                        <p className={`text-base font-bold ${sc.text}`}>{stage.title}</p>
                                        <p className="text-xs text-zinc-500">{stage.subtitle}</p>
                                    </div>

                                    {/* Barra de intensidade de abstinência */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] text-zinc-600 uppercase tracking-widest">
                                            <span>Intensidade de abstinência</span>
                                            <span>{stage.intensity}%</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-zinc-800">
                                            <div
                                                className={`h-full rounded-full transition-[width] duration-1000 ${sc.bar}`}
                                                style={{ width: `${stage.intensity}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Protocolo badge */}
                                    <div className="flex justify-center">
                                        <span
                                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                                                activeDetox.protocol === 'COLD_TURKEY'
                                                    ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                            }`}
                                        >
                                            {activeDetox.protocol === 'COLD_TURKEY'
                                                ? 'Cold Turkey'
                                                : 'Desmame Progressivo'}
                                        </span>
                                    </div>
                                </div>

                                {/* Descrição do estágio */}
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
                                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                                        O que está acontecendo agora
                                    </p>
                                    <p className="text-sm text-zinc-400 leading-relaxed">{stage.description}</p>
                                </div>

                                {/* Timeline de marcos */}
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                                        Marcos de recalibração
                                    </p>
                                    <div className="space-y-2">
                                        {[
                                            { hours: 12, label: 'Pico de vasodilatação' },
                                            { hours: 24, label: 'Letargia máxima' },
                                            { hours: 72, label: 'Receptores recalibrando' },
                                            { hours: 168, label: 'Sono REM restaurado' },
                                            { hours: 336, label: 'Soberania biológica' },
                                        ].map(({ hours, label }) => {
                                            const reached = elapsedHours >= hours;
                                            return (
                                                <div
                                                    key={hours}
                                                    className={`flex items-center gap-3 ${
                                                        reached ? 'opacity-100' : 'opacity-40'
                                                    }`}
                                                >
                                                    <div
                                                        className={`h-2 w-2 shrink-0 rounded-full ${
                                                            reached ? 'bg-amber-500' : 'bg-zinc-700'
                                                        }`}
                                                    />
                                                    <span className={`text-sm ${reached ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                                        {label}
                                                    </span>
                                                    <span className="ml-auto text-xs text-zinc-600">
                                                        {hours < 24
                                                            ? `${hours}h`
                                                            : `${Math.floor(hours / 24)}d`}
                                                    </span>
                                                    {reached && (
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Ações */}
                                {showEndDialog ? (
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
                                        <p className="text-sm font-semibold text-zinc-100">
                                            Encerrar protocolo
                                        </p>
                                        <textarea
                                            value={endNotes}
                                            onChange={(e) => setEndNotes(e.target.value)}
                                            placeholder="Observações (opcional)..."
                                            rows={2}
                                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none resize-none"
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEnd('COMPLETED')}
                                                disabled={isPending}
                                                className="flex-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 py-2.5 text-sm font-bold text-emerald-400 uppercase tracking-wider transition hover:bg-emerald-500/20 disabled:opacity-50"
                                            >
                                                Concluído
                                            </button>
                                            <button
                                                onClick={() => handleEnd('ABANDONED')}
                                                disabled={isPending}
                                                className="flex-1 rounded-xl bg-zinc-800 py-2.5 text-sm font-bold text-zinc-500 uppercase tracking-wider transition hover:bg-zinc-700 disabled:opacity-50"
                                            >
                                                Abandonado
                                            </button>
                                            <button
                                                onClick={() => setShowEndDialog(false)}
                                                className="rounded-xl border border-zinc-700 px-4 text-sm text-zinc-500 hover:text-zinc-300 transition"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowEndDialog(true)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 py-3 text-sm font-medium text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Encerrar protocolo
                                    </button>
                                )}
                            </>
                        ) : (
                            /* ── Sem sessão ativa — iniciar ─────────────────── */
                            <div className="space-y-5">
                                {/* Estatísticas */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
                                        <p className="text-xs text-zinc-600 uppercase tracking-widest">
                                            Protocolos concluídos
                                        </p>
                                        <p className="text-3xl font-bold text-zinc-100">
                                            {stats.totalCompleted}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
                                        <p className="text-xs text-zinc-600 uppercase tracking-widest">
                                            Maior streak
                                        </p>
                                        <p className="text-3xl font-bold text-amber-400">
                                            {stats.longestStreak < 24
                                                ? `${stats.longestStreak}h`
                                                : `${Math.floor(stats.longestStreak / 24)}d`}
                                        </p>
                                    </div>
                                </div>

                                {/* Seleção de protocolo */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                                        Escolha o protocolo
                                    </p>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {(
                                            [
                                                {
                                                    id: 'PROGRESSIVE' as CaffeineProtocol,
                                                    label: 'Desmame Progressivo',
                                                    badge: 'Recomendado',
                                                    badgeColor: 'text-amber-500 bg-amber-500/10',
                                                    desc: 'Redução gradual. Sintomas suaves. Ideal para quem não pode interromper a rotina.',
                                                    borderActive: 'border-amber-500/60',
                                                    textActive: 'text-amber-400',
                                                },
                                                {
                                                    id: 'COLD_TURKEY' as CaffeineProtocol,
                                                    label: 'Suspensão Total',
                                                    badge: 'Intenso',
                                                    badgeColor: 'text-red-400 bg-red-500/10',
                                                    desc: 'Parada imediata. Sintomas intensos por 2–3 dias. Recalibração mais rápida e completa.',
                                                    borderActive: 'border-red-500/60',
                                                    textActive: 'text-red-400',
                                                },
                                            ] as const
                                        ).map((opt) => {
                                            const isSelected = selectedProtocol === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setSelectedProtocol(opt.id)}
                                                    className={`rounded-xl border p-4 text-left transition-all space-y-2 ${
                                                        isSelected
                                                            ? `${opt.borderActive} bg-zinc-900`
                                                            : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span
                                                            className={`text-sm font-bold ${isSelected ? opt.textActive : 'text-zinc-300'}`}
                                                        >
                                                            {opt.label}
                                                        </span>
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${opt.badgeColor}`}
                                                        >
                                                            {opt.badge}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 leading-relaxed">{opt.desc}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <button
                                    onClick={handleStart}
                                    disabled={isPending}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-4 text-sm font-bold text-zinc-950 uppercase tracking-wider transition hover:bg-amber-400 disabled:opacity-60"
                                >
                                    <Play className="h-4 w-4" />
                                    Iniciar Protocolo
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    ABA: GUIA EDUCATIVO
                ════════════════════════════════════════════════════════════ */}
                {activeTab === 'education' && (
                    <div className="space-y-4">
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Entenda o mecanismo por trás da dependência de cafeína — e por que recuperar
                            seus receptores de adenosina é um dos protocolos mais poderosos de biohacking.
                        </p>

                        {EDUCATION_SECTIONS.map((section) => {
                            const isExpanded = expandedSection === section.id;
                            return (
                                <div
                                    key={section.id}
                                    className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden"
                                >
                                    <button
                                        onClick={() =>
                                            setExpandedSection(isExpanded ? null : section.id)
                                        }
                                        className="flex w-full items-center gap-4 p-5 text-left hover:bg-zinc-900/80 transition"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700">
                                            <section.icon className="h-5 w-5 text-amber-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${section.tagColor}`}
                                                >
                                                    {section.tag}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 font-serif text-base font-bold text-zinc-100">
                                                {section.title}
                                            </p>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="h-4 w-4 shrink-0 text-zinc-600" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 shrink-0 text-zinc-600" />
                                        )}
                                    </button>

                                    {isExpanded && (
                                        <div className="border-t border-zinc-800 p-5 space-y-5">
                                            {section.content.map((block, i) => (
                                                <div key={i} className="space-y-1.5">
                                                    <p className="text-sm font-bold text-zinc-200">
                                                        {block.heading}
                                                    </p>
                                                    <p className="text-sm text-zinc-400 leading-relaxed">
                                                        {block.body}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* CTA para iniciar */}
                        <button
                            onClick={() => setActiveTab('tracker')}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 py-3.5 text-sm font-bold text-amber-400 uppercase tracking-wider transition hover:bg-amber-500/20"
                        >
                            <Play className="h-4 w-4" />
                            Iniciar Protocolo Agora
                        </button>
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    ABA: HISTÓRICO
                ════════════════════════════════════════════════════════════ */}
                {activeTab === 'history' && (
                    <div className="space-y-3">
                        {history.length === 0 ? (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 py-12 text-center space-y-2">
                                <Trophy className="mx-auto h-8 w-8 text-zinc-700" />
                                <p className="text-sm text-zinc-600">
                                    Nenhum protocolo registrado ainda.
                                </p>
                                <button
                                    onClick={() => setActiveTab('tracker')}
                                    className="mt-2 text-xs text-amber-500 hover:text-amber-400 transition"
                                >
                                    Começar agora →
                                </button>
                            </div>
                        ) : (
                            history.map((item) => {
                                const dur = item.durationSeconds
                                    ? formatHistoryDuration(item.durationSeconds)
                                    : '—';
                                const date = new Date(item.startTime).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short',
                                });
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                                            {item.status === 'COMPLETED' ? (
                                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-zinc-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-sm font-semibold ${STATUS_COLOR[item.status]}`}
                                                >
                                                    {item.status === 'COMPLETED'
                                                        ? 'Concluído'
                                                        : 'Abandonado'}
                                                </span>
                                                <span
                                                    className={`text-[10px] font-bold uppercase ${PROTOCOL_COLOR[item.protocol]}`}
                                                >
                                                    {item.protocol === 'COLD_TURKEY' ? 'Cold Turkey' : 'Progressivo'}
                                                </span>
                                            </div>
                                            {item.notes && (
                                                <p className="text-xs text-zinc-600 truncate">{item.notes}</p>
                                            )}
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-mono font-bold text-zinc-300">{dur}</p>
                                            <p className="text-[10px] text-zinc-600">{date}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
