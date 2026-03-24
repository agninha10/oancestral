import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TrendingUp, Users, Megaphone, Layers } from 'lucide-react'

export const metadata = { title: 'Tráfego UTM' }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                <Icon className="h-5 w-5 text-amber-500" />
            </div>
            <div>
                <p className="text-2xl font-bold text-zinc-100">{value.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">{label}</p>
            </div>
        </div>
    )
}

function Table({ title, rows }: { title: string; rows: { key: string; count: number }[] }) {
    if (rows.length === 0) return null
    const max = rows[0].count
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <div className="border-b border-zinc-800 px-6 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">{title}</h2>
            </div>
            <ul className="divide-y divide-zinc-800/60">
                {rows.map(({ key, count }) => (
                    <li key={key} className="flex items-center gap-4 px-6 py-3">
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-zinc-200">{key || '—'}</p>
                            {/* progress bar */}
                            <div className="mt-1.5 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-amber-500"
                                    style={{ width: `${Math.round((count / max) * 100)}%` }}
                                />
                            </div>
                        </div>
                        <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-300">
                            {count.toLocaleString('pt-BR')}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

async function getStats() {
    const [total, byCampaign, bySource, byMedium, recentVisits] = await Promise.all([
        prisma.utmVisit.count(),

        prisma.utmVisit.groupBy({
            by: ['campaign'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 20,
        }),

        prisma.utmVisit.groupBy({
            by: ['source'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 20,
        }),

        prisma.utmVisit.groupBy({
            by: ['medium'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 20,
        }),

        prisma.utmVisit.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            select: {
                id:        true,
                source:    true,
                medium:    true,
                campaign:  true,
                content:   true,
                landing:   true,
                createdAt: true,
            },
        }),
    ])

    return { total, byCampaign, bySource, byMedium, recentVisits }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TrafegoPage() {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') redirect('/')

    const { total, byCampaign, bySource, byMedium, recentVisits } = await getStats()

    const campaigns = byCampaign.map((r) => ({ key: r.campaign ?? '(sem campanha)', count: r._count.id }))
    const sources   = bySource.map((r)   => ({ key: r.source   ?? '(sem source)',   count: r._count.id }))
    const mediums   = byMedium.map((r)   => ({ key: r.medium   ?? '(sem medium)',   count: r._count.id }))

    return (
        <div className="space-y-8 p-6 lg:p-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-100">Tráfego Pago</h1>
                <p className="mt-1 text-sm text-zinc-500">Visitas rastreadas via parâmetros UTM</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Visitas UTM"  value={total}            icon={TrendingUp} />
                <StatCard label="Campanhas"    value={campaigns.length} icon={Megaphone}  />
                <StatCard label="Sources"      value={sources.length}   icon={Layers}     />
                <StatCard label="Mediums"      value={mediums.length}   icon={Users}      />
            </div>

            {/* Grouped tables */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Table title="Por Campanha" rows={campaigns} />
                <Table title="Por Source"   rows={sources}   />
                <Table title="Por Medium"   rows={mediums}   />
            </div>

            {/* Recent visits */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                        Visitas Recentes
                    </h2>
                    <span className="rounded-lg bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                        últimas 50
                    </span>
                </div>

                {recentVisits.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
                        <TrendingUp className="h-8 w-8 text-zinc-700" />
                        <p className="text-sm text-zinc-600">
                            Nenhuma visita UTM registrada ainda.
                        </p>
                        <p className="text-xs text-zinc-700">
                            Compartilhe um link com ?utm_source=instagram&amp;utm_medium=stories&amp;utm_campaign=...
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-800 text-left">
                                    {['Campanha', 'Source', 'Medium', 'Conteúdo', 'Landing', 'Data'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {recentVisits.map((v) => (
                                    <tr key={v.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-4 py-2.5 font-medium text-zinc-200">{v.campaign ?? '—'}</td>
                                        <td className="px-4 py-2.5 text-zinc-400">{v.source   ?? '—'}</td>
                                        <td className="px-4 py-2.5 text-zinc-400">{v.medium   ?? '—'}</td>
                                        <td className="px-4 py-2.5 text-zinc-500">{v.content  ?? '—'}</td>
                                        <td className="px-4 py-2.5 text-zinc-500 max-w-[160px] truncate">{v.landing ?? '—'}</td>
                                        <td className="px-4 py-2.5 text-zinc-600 whitespace-nowrap">
                                            {v.createdAt.toLocaleDateString('pt-BR', {
                                                day: '2-digit', month: '2-digit', year: '2-digit',
                                                hour: '2-digit', minute: '2-digit',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
