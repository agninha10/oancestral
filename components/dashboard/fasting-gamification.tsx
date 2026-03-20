'use client';

import { Flame, Zap, ShieldCheck, Crown, Star, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BadgeUnlocked, UserGameProfile } from '@/app/dashboard/fasting/actions';

// ─── Constants ────────────────────────────────────────────────────────────────

const XP_PER_LEVEL = 2000;

// ─── Badge icon resolver ──────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
    Flame, Zap, ShieldCheck, Crown,
};

function BadgeIcon({ name, className }: { name: string; className?: string }) {
    const Icon = ICON_MAP[name] ?? Star;
    return <Icon className={className} />;
}

// ─── LevelBar ─────────────────────────────────────────────────────────────────

export function LevelBar({ xp, level }: { xp: number; level: number }) {
    const levelStart  = (level - 1) * XP_PER_LEVEL;
    const xpInLevel   = xp - levelStart;
    const progress    = Math.min((xpInLevel / XP_PER_LEVEL) * 100, 100);
    const xpToNext    = XP_PER_LEVEL - xpInLevel;

    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 space-y-3">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                        Nível
                    </p>
                    <p className="font-serif text-4xl font-black leading-none text-zinc-50">
                        {level}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-semibold text-zinc-400">
                        {xp.toLocaleString('pt-BR')} XP total
                    </p>
                    <p className="text-[11px] text-zinc-600">
                        {xpToNext > 0 ? `${xpToNext} XP para o próximo nível` : 'Nível máximo'}
                    </p>
                </div>
            </div>

            {/* Bar */}
            <div className="space-y-1">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-700">
                    <span>Nv. {level}</span>
                    <span>{Math.round(progress)}%</span>
                    <span>Nv. {level + 1}</span>
                </div>
            </div>

            {/* XP rate hint */}
            <p className="text-[10px] text-zinc-700">
                50 XP por hora de jejum concluído · 2 000 XP por nível
            </p>
        </div>
    );
}

// ─── BadgeGallery ─────────────────────────────────────────────────────────────

type UserBadgeEntry = UserGameProfile['userBadges'][number];

type BadgeGalleryProps = {
    allBadges: BadgeUnlocked[];
    userBadges: UserBadgeEntry[];
};

export function BadgeGallery({ allBadges, userBadges }: BadgeGalleryProps) {
    const unlockedMap = new Map(userBadges.map((ub) => [ub.badge.id, ub.unlockedAt]));

    return (
        <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                Conquistas
            </p>
            <div className="grid grid-cols-2 gap-3">
                {allBadges.map((badge) => {
                    const unlockedAt = unlockedMap.get(badge.id);
                    const owned = unlockedAt !== undefined;

                    return (
                        <div
                            key={badge.id}
                            className={cn(
                                'relative flex flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-all',
                                owned
                                    ? 'border-amber-500/25 bg-amber-500/5'
                                    : 'border-zinc-800/40 bg-zinc-900/20 opacity-40',
                            )}
                        >
                            {/* Icon circle */}
                            <div
                                className={cn(
                                    'flex h-14 w-14 items-center justify-center rounded-full border',
                                    owned
                                        ? 'border-amber-500/30 bg-amber-500/10'
                                        : 'border-zinc-800 bg-zinc-800/60',
                                )}
                            >
                                {owned ? (
                                    <BadgeIcon
                                        name={badge.icon}
                                        className="h-6 w-6 text-amber-400"
                                    />
                                ) : (
                                    <Lock className="h-5 w-5 text-zinc-600" />
                                )}
                            </div>

                            {/* Name & date */}
                            <div className="space-y-0.5">
                                <p
                                    className={cn(
                                        'text-sm font-bold leading-snug',
                                        owned ? 'text-zinc-100' : 'text-zinc-600',
                                    )}
                                >
                                    {badge.name}
                                </p>
                                {owned && unlockedAt ? (
                                    <p className="text-[10px] text-amber-600/80">
                                        {new Date(unlockedAt).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                        })}
                                    </p>
                                ) : (
                                    <p className="text-[10px] text-zinc-700">{badge.description}</p>
                                )}
                            </div>

                            {/* Glow dot for owned */}
                            {owned && (
                                <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-amber-400" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
