import Image from 'next/image'
import type { ActiveFaster } from '@/app/dashboard/fasting/actions'

const MAX_VISIBLE = 7

type Props = {
    users:          ActiveFaster[]
    currentUserId:  string
}

// ─── Avatar individual ────────────────────────────────────────────────────────

function Avatar({ user }: { user: ActiveFaster }) {
    const initial = (user.name ?? '?')[0].toUpperCase()
    const label   = user.name ?? 'Guerreiro'

    return (
        // Wrapper sem overflow-hidden para o tooltip escapar
        <div className="group/avatar relative shrink-0">
            {/* Círculo do avatar */}
            <div className="w-9 h-9 rounded-full border-2 border-zinc-950 ring-1 ring-zinc-800 overflow-hidden">
                {user.avatarUrl ? (
                    <Image
                        src={user.avatarUrl}
                        alt={label}
                        fill
                        sizes="36px"
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-500">{initial}</span>
                    </div>
                )}
            </div>

            {/* Tooltip — aparece acima do avatar no hover */}
            <div
                className="
                    pointer-events-none absolute bottom-full left-1/2 z-20
                    mb-2 -translate-x-1/2
                    rounded-lg border border-zinc-700 bg-zinc-900
                    px-2.5 py-1 text-xs font-medium text-zinc-200
                    whitespace-nowrap shadow-lg
                    opacity-0 scale-95
                    group-hover/avatar:opacity-100 group-hover/avatar:scale-100
                    transition-all duration-150
                "
            >
                {label}
                {/* Setinha */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-700" />
            </div>
        </div>
    )
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function TribeInFasting({ users, currentUserId }: Props) {
    // Coloca o próprio usuário primeiro se ele estiver na lista
    const sorted = [
        ...users.filter((u) => u.id === currentUserId),
        ...users.filter((u) => u.id !== currentUserId),
    ]

    const visible  = sorted.slice(0, MAX_VISIBLE)
    const overflow = sorted.length - MAX_VISIBLE
    const total    = sorted.length
    const others   = total - 1  // todos exceto o próprio usuário

    const isSolo = total <= 1

    return (
        <section className="px-4 sm:px-6 py-5">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3">
                Na Forja neste exato momento:
            </p>

            <div className="flex items-center gap-4 flex-wrap">
                {/* ── Avatar group com overlap ──────────────────────────────── */}
                <div className="flex items-center -space-x-3">
                    {visible.map((user) => (
                        <Avatar key={user.id} user={user} />
                    ))}

                    {overflow > 0 && (
                        <div
                            className="
                                relative w-9 h-9 flex-shrink-0
                                rounded-full border-2 border-zinc-950
                                bg-zinc-800 flex items-center justify-center
                                ring-1 ring-zinc-700
                            "
                            title={`+${overflow} guerreiros na Forja`}
                        >
                            <span className="text-[10px] font-bold text-zinc-300">
                                +{overflow}
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Texto de contexto ─────────────────────────────────────── */}
                <p className="text-sm text-zinc-500 leading-snug">
                    {isSolo ? (
                        <span className="text-amber-500/80 font-medium">
                            Você é o primeiro na Fornalha hoje.{' '}
                            <span className="text-zinc-400">Puxe a fila.</span>
                        </span>
                    ) : (
                        <>
                            Você e{' '}
                            <span className="text-zinc-300 font-semibold">
                                outros {others} {others === 1 ? 'ancestral' : 'ancestrais'}
                            </span>
                            {' '}estão forjando soberania celular agora.
                        </>
                    )}
                </p>
            </div>
        </section>
    )
}
