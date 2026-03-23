import { Shield, Flame, Zap, Star, Trophy, Crown, Award, Target, Heart, Swords } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { XP_PER_LEVEL } from '@/lib/gamification'

// ─── Mapa estático de ícones Lucide usados como badges ────────────────────────
// Fallback: se o campo `icon` for um emoji, renderiza direto como texto.
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
    Shield, Flame, Zap, Star, Trophy, Crown, Award, Target, Heart, Swords,
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

type BadgeSlot = {
    id: string
    badge: {
        name: string
        icon: string
    }
}

type GamificationHeaderProps = {
    name:    string | null
    xp:      number
    level:   number
    badges:  BadgeSlot[]   // últimas 3 destravadas
}

// ─── Sub-componente: ícone de badge ───────────────────────────────────────────

function BadgeIcon({ icon, name }: { icon: string; name: string }) {
    const LucideIcon = ICON_MAP[icon]
    return (
        <div
            title={name}
            className="
                flex items-center justify-center
                w-10 h-10 rounded-xl
                bg-amber-500/10 border border-amber-500/30
                text-amber-400 text-xl
                hover:scale-110 transition-transform cursor-default
            "
        >
            {LucideIcon
                ? <LucideIcon className="w-5 h-5" />
                : <span>{icon}</span>
            }
        </div>
    )
}

function EmptyBadgeSlot() {
    return (
        <div
            className="
                flex items-center justify-center
                w-10 h-10 rounded-xl
                bg-zinc-800/60 border border-zinc-700/40
                opacity-30
            "
        >
            <Shield className="w-5 h-5 text-zinc-500" />
        </div>
    )
}

// ─── Componente Principal ──────────────────────────────────────────────────────

export function GamificationHeader({ name, xp, level, badges }: GamificationHeaderProps) {
    const firstName     = (name ?? 'Guerreiro').split(' ')[0]
    const xpInLevel     = xp % XP_PER_LEVEL
    const percentage    = Math.round((xpInLevel / XP_PER_LEVEL) * 100)
    const xpToNext      = XP_PER_LEVEL - xpInLevel

    // Garante sempre 3 slots (preenche com null se faltar)
    const slots: (BadgeSlot | null)[] = [
        badges[0] ?? null,
        badges[1] ?? null,
        badges[2] ?? null,
    ]

    return (
        <div
            className="
                relative overflow-hidden
                bg-zinc-900/50 border border-zinc-800
                rounded-2xl p-5 sm:p-6
            "
        >
            {/* Glow decorativo de fundo */}
            <div
                className="
                    pointer-events-none absolute -top-16 -left-16
                    w-48 h-48 rounded-full
                    bg-amber-500/5 blur-3xl
                "
                aria-hidden
            />

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">

                {/* ── Esquerda: Identidade ────────────────────────────────────── */}
                <div className="flex-shrink-0 space-y-1 sm:min-w-[180px]">
                    <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
                        Forjando a Soberania
                    </p>
                    <h2 className="text-lg sm:text-xl font-bold text-zinc-100 leading-tight">
                        {firstName}
                    </h2>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400 tracking-wide">
                            Nível {level}
                        </span>
                    </div>
                </div>

                {/* ── Centro: Barra de XP ─────────────────────────────────────── */}
                <div className="flex-1 space-y-2">
                    {/* Labels acima */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-zinc-400">
                            {xpInLevel.toLocaleString('pt-BR')} XP
                        </span>
                        <span className="text-xs text-zinc-500">
                            {XP_PER_LEVEL.toLocaleString('pt-BR')} XP
                        </span>
                    </div>

                    {/* Trilho da barra */}
                    <div className="relative h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                        {/* Preenchimento */}
                        <div
                            className="
                                absolute inset-y-0 left-0 rounded-full
                                bg-gradient-to-r from-amber-600 to-amber-400
                                shadow-[0_0_8px_0px_rgba(245,158,11,0.5)]
                                transition-[width] duration-700 ease-out
                            "
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {/* Label abaixo */}
                    <p className="text-xs text-zinc-500">
                        Faltam{' '}
                        <span className="text-zinc-400 font-medium">
                            {xpToNext.toLocaleString('pt-BR')} XP
                        </span>
                        {' '}para o Nível {level + 1}
                    </p>
                </div>

                {/* ── Direita: Badges ─────────────────────────────────────────── */}
                <div className="flex-shrink-0 flex items-center gap-2 sm:pl-2">
                    {slots.map((slot, i) =>
                        slot
                            ? <BadgeIcon key={slot.id} icon={slot.badge.icon} name={slot.badge.name} />
                            : <EmptyBadgeSlot key={`empty-${i}`} />
                    )}
                </div>

            </div>
        </div>
    )
}
