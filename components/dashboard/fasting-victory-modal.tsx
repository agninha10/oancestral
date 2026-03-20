'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, ShieldCheck, Crown, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GamificationResult } from '@/app/dashboard/fasting/actions';

// ─── Badge icon resolver ──────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
    Flame, Zap, ShieldCheck, Crown,
};

function BadgeIcon({ name, className }: { name: string; className?: string }) {
    const Icon = ICON_MAP[name] ?? Star;
    return <Icon className={className} />;
}

// ─── XP Bar ───────────────────────────────────────────────────────────────────

const XP_PER_LEVEL = 2000;

function XpBar({ oldXp, newXp, newLevel }: { oldXp: number; newXp: number; newLevel: number }) {
    const levelStart  = (newLevel - 1) * XP_PER_LEVEL;
    const levelEnd    = newLevel * XP_PER_LEVEL;
    const progress    = ((newXp - levelStart) / XP_PER_LEVEL) * 100;
    const oldProgress = ((Math.max(oldXp, levelStart) - levelStart) / XP_PER_LEVEL) * 100;

    return (
        <div className="w-full space-y-1.5">
            <div className="flex justify-between text-xs text-zinc-500">
                <span>Nível {newLevel}</span>
                <span>{newXp - levelStart} / {XP_PER_LEVEL} XP</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                    initial={{ width: `${oldProgress}%` }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                />
            </div>
        </div>
    );
}

// ─── Particle burst ───────────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (i / 20) * 360,
    distance: 60 + Math.random() * 60,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 0.3,
    color: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f97316' : '#fef3c7',
}));

function ParticleBurst() {
    return (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {PARTICLES.map((p) => {
                const rad = (p.angle * Math.PI) / 180;
                const x = Math.cos(rad) * p.distance;
                const y = Math.sin(rad) * p.distance;
                return (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full"
                        style={{ width: p.size, height: p.size, backgroundColor: p.color }}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{ x, y, opacity: 0, scale: 0 }}
                        transition={{ duration: 1.0, ease: 'easeOut', delay: p.delay }}
                    />
                );
            })}
        </div>
    );
}

// ─── VictoryModal ─────────────────────────────────────────────────────────────

type Props = {
    open: boolean;
    onClose: () => void;
    gamification: GamificationResult;
    durationLabel: string;
};

export function VictoryModal({ open, onClose, gamification, durationLabel }: Props) {
    const { xpEarned, newLevel, leveledUp, badgeUnlocked, totalXp } = gamification;
    const oldXp = totalXp - xpEarned;

    // Close on Escape
    const closeRef = useRef(onClose);
    closeRef.current = onClose;
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        className={cn(
                            'fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm',
                            'rounded-3xl border border-amber-500/30 bg-zinc-950 p-8',
                            'shadow-2xl shadow-amber-500/10',
                        )}
                        initial={{ y: 80, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 80, opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    >
                        {/* Close */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Badge spotlight */}
                        {badgeUnlocked ? (
                            <div className="relative flex flex-col items-center gap-4">
                                <ParticleBurst />

                                {/* Glow ring */}
                                <motion.div
                                    className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-500/40 bg-amber-500/10"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-amber-500/10"
                                        animate={{ scale: [1, 1.4, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                    <BadgeIcon name={badgeUnlocked.icon} className="h-10 w-10 text-amber-400" />
                                </motion.div>

                                <motion.div
                                    className="text-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                >
                                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
                                        Conquista Desbloqueada
                                    </p>
                                    <h2 className="mt-1 font-serif text-2xl font-bold text-zinc-50">
                                        {badgeUnlocked.name}
                                    </h2>
                                    <p className="mt-1 text-sm text-zinc-500">{badgeUnlocked.description}</p>
                                </motion.div>
                            </div>
                        ) : (
                            /* No new badge — just XP celebration */
                            <motion.div
                                className="flex flex-col items-center gap-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
                                    <Flame className="h-7 w-7 text-amber-400" />
                                </div>
                                <h2 className="font-serif text-2xl font-bold text-zinc-50">
                                    Protocolo Concluído
                                </h2>
                            </motion.div>
                        )}

                        {/* Separator */}
                        <div className="my-6 h-px w-full bg-zinc-800" />

                        {/* Stats row */}
                        <motion.div
                            className="grid grid-cols-2 gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                        >
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Duração</p>
                                <p className="mt-1 font-mono text-lg font-black text-zinc-100">{durationLabel}</p>
                            </div>
                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3 text-center">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">XP Ganho</p>
                                <p className="mt-1 font-mono text-lg font-black text-amber-400">+{xpEarned}</p>
                            </div>
                        </motion.div>

                        {/* Level up banner */}
                        {leveledUp && (
                            <motion.div
                                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.55, type: 'spring' }}
                            >
                                <Crown className="h-4 w-4 text-amber-400" />
                                <span className="text-sm font-bold text-amber-300">
                                    Subiu para o Nível {newLevel}!
                                </span>
                            </motion.div>
                        )}

                        {/* XP progress bar */}
                        <motion.div
                            className="mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <XpBar oldXp={oldXp} newXp={totalXp} newLevel={newLevel} />
                        </motion.div>

                        {/* CTA */}
                        <motion.button
                            type="button"
                            onClick={onClose}
                            className={cn(
                                'mt-6 w-full rounded-xl py-3.5',
                                'bg-gradient-to-r from-amber-600 to-amber-500',
                                'text-sm font-black uppercase tracking-[0.2em] text-zinc-950',
                                'hover:from-amber-500 hover:to-amber-400',
                                'transition-all active:scale-[0.98]',
                            )}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            Continuar a Forja
                        </motion.button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
