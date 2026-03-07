'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle2,
    Loader2,
    Lock,
    Shield,
    X,
    Zap,
} from 'lucide-react';

// ─── Persistence helpers (7-day expiry) ──────────────────────────────────────

const STORAGE_KEY = 'oancestral_lead_magnet_v1';
const EXPIRY_MS   = 7 * 24 * 60 * 60 * 1000; // 7 days

function isDismissed(): boolean {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const { expiry } = JSON.parse(raw) as { expiry: number };
        if (Date.now() > expiry) {
            localStorage.removeItem(STORAGE_KEY);
            return false;
        }
        return true;
    } catch {
        return false; // SSR or Safari private mode
    }
}

function markDismissed(): void {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ expiry: Date.now() + EXPIRY_MS })
        );
    } catch {
        // Silently fail on restricted storage environments
    }
}

// ─── Static content ───────────────────────────────────────────────────────────

const BENEFITS = [
    { Icon: Shield, text: 'Descubra o óleo assassino silencioso.' },
    { Icon: Zap,    text: 'Como reverter a névoa mental hoje.'   },
    { Icon: Shield, text: 'O hack de jejum para blindar seus hormônios.' },
] as const;

// ─── Animation variants ───────────────────────────────────────────────────────

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.18 } },
};

const modalVariants = {
    hidden:  { opacity: 0, scale: 0.93, y: 16 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 300, damping: 28, delay: 0.05 },
    },
    exit: {
        opacity: 0,
        scale: 0.96,
        y: 8,
        transition: { duration: 0.16 },
    },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LeadMagnetModal() {
    const [isOpen,   setIsOpen]   = useState(false);
    const [email,    setEmail]    = useState('');
    const [loading,  setLoading]  = useState(false);
    const [success,  setSuccess]  = useState(false);
    const [error,    setError]    = useState('');

    // Refs avoid stale closures inside addEventListener callbacks
    const hasTriggeredRef = useRef(false);
    const readyRef        = useRef(false); // safety: only active after 5 s
    const timerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Trigger / dismiss ─────────────────────────────────────────────────────

    const triggerOpen = useCallback(() => {
        if (hasTriggeredRef.current || isDismissed()) return;
        hasTriggeredRef.current = true;
        setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        markDismissed();
    }, []);

    // ── Event-listener setup ──────────────────────────────────────────────────

    useEffect(() => {
        // ── Safety gate: listeners only activate after 5 seconds ─────────────
        timerRef.current = setTimeout(() => {
            readyRef.current = true;
        }, 5_000);

        const isMobile = () => window.innerWidth < 768;

        // Desktop: Exit-Intent (cursor exits viewport from the top)
        const handleMouseLeave = (e: MouseEvent) => {
            if (!readyRef.current || isMobile()) return;
            if (e.clientY <= 0) triggerOpen();
        };

        // Mobile: Scroll depth ≥ 60% of total page height
        const handleScroll = () => {
            if (!readyRef.current || !isMobile()) return;
            const scrolled = window.scrollY + window.innerHeight;
            const total    = document.documentElement.scrollHeight;
            if (total > 0 && scrolled / total >= 0.6) triggerOpen();
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('scroll', handleScroll);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [triggerOpen]);

    // ── Body scroll lock ──────────────────────────────────────────────────────

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // ── Form submission ───────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/newsletter', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    source: 'LEAD_MAGNET',
                    tags: ['lead-magnet', 'dossie-alimentos'],
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao processar');

            setSuccess(true);
            markDismissed(); // won't show again after successful sign-up
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="lead-magnet-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="lm-title"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    // Click outside → close
                    onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-amber-500/30 shadow-2xl shadow-amber-900/20 overflow-hidden"
                    >
                        {/* Decorative glows */}
                        <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-amber-500/8 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-red-900/8 blur-3xl" />

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            aria-label="Fechar"
                            className="absolute top-4 right-4 z-10 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* ── Content area ─────────────────────────────────────────── */}
                        <div className="relative px-7 py-8 sm:px-9 sm:py-10">
                            <AnimatePresence mode="wait">

                                {/* ── Success state ──────────────────────────────────── */}
                                {success ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.92 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center gap-5 py-8 text-center"
                                    >
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                                            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                                        </div>

                                        <div className="space-y-1.5">
                                            <h2 className="text-2xl font-bold text-zinc-100">
                                                Dossiê Enviado!
                                            </h2>
                                            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
                                                Verifique sua caixa de entrada. O conhecimento que o
                                                sistema não quer que você tenha está a caminho.
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleClose}
                                            className="text-xs text-zinc-600 underline underline-offset-2 transition-colors hover:text-zinc-400"
                                        >
                                            Fechar
                                        </button>
                                    </motion.div>

                                ) : (

                                    /* ── Form state ────────────────────────────────────── */
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        {/* Badge */}
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/40 bg-amber-900/40 px-3 py-1">
                                            <Lock className="h-3 w-3 text-amber-400" />
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                                                Conteúdo Restrito
                                            </span>
                                        </div>

                                        {/* Headline */}
                                        <div className="space-y-3">
                                            <h2
                                                id="lm-title"
                                                className="text-2xl font-bold leading-tight text-zinc-100 sm:text-3xl"
                                            >
                                                O Sistema Quer Você{' '}
                                                <span className="text-red-400">
                                                    Fraco e Inflamado.
                                                </span>
                                            </h2>

                                            <p className="text-sm leading-relaxed text-zinc-400">
                                                Baixe o{' '}
                                                <span className="font-semibold text-amber-400">
                                                    Dossiê Gratuito
                                                </span>
                                                : Os 5 Alimentos Modernos (que estão na sua cozinha) e
                                                destroem sua testosterona.
                                            </p>
                                        </div>

                                        {/* Benefits list */}
                                        <ul className="space-y-2.5">
                                            {BENEFITS.map(({ Icon, text }) => (
                                                <li key={text} className="flex items-start gap-3">
                                                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/15">
                                                        <Icon className="h-3 w-3 text-amber-400" />
                                                    </span>
                                                    <span className="text-sm text-zinc-300">{text}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Divider */}
                                        <div className="border-t border-zinc-800" />

                                        {/* Form */}
                                        <form onSubmit={handleSubmit} className="space-y-3">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="seu@email.com"
                                                required
                                                autoComplete="email"
                                                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                                            />

                                            {error && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-xs text-red-400"
                                                >
                                                    {error}
                                                </motion.p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full rounded-xl bg-amber-600 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-zinc-950 shadow-lg shadow-amber-900/30 transition-colors duration-150 hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Enviando...
                                                    </span>
                                                ) : (
                                                    'Enviar o Dossiê Agora'
                                                )}
                                            </button>

                                            <p className="text-center text-[11px] text-zinc-600">
                                                🔒 Odiamos spam. Cancele quando quiser.
                                            </p>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
