import { Flame } from 'lucide-react'
import { XP_PER_LEVEL } from '@/lib/gamification'

type Props = {
    xp:    number
    level: number
}

/**
 * Barra de XP compacta — usada no menu lateral e no topo do /dashboard/jejum.
 * Não precisa de "use client": é puramente presentacional, sem estado.
 */
export function CompactXpBar({ xp, level }: Props) {
    const xpInLevel  = xp % XP_PER_LEVEL
    const percentage = Math.min(Math.round((xpInLevel / XP_PER_LEVEL) * 100), 100)
    const xpToNext   = XP_PER_LEVEL - xpInLevel

    return (
        <div className="space-y-1.5">
            {/* Level label + XP total */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-amber-500" />
                    <span className="text-[11px] font-bold text-amber-500">
                        Nv. {level}
                    </span>
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                    {xpToNext > 0
                        ? `${xpToNext.toLocaleString('pt-BR')} XP p/ Nv. ${level + 1}`
                        : 'Nível máximo'
                    }
                </span>
            </div>

            {/* Trilho */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.4)] transition-[width] duration-700"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}
