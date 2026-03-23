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

    return (
        <div
            title={user.name ?? 'Guerreiro'}
            className="
                relative w-9 h-9 flex-shrink-0
                rounded-full border-2 border-zinc-950
                overflow-hidden
                ring-1 ring-zinc-800
            "
        >
            {user.avatarUrl ? (
                <Image
                    src={user.avatarUrl}
                    alt={user.name ?? 'Guerreiro'}
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
