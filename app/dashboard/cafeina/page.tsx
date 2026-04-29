import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { getCurrentDetox, getDetoxHistory, getDetoxStats } from '@/app/dashboard/caffeine/actions';
import { CaffeineTracker } from '@/components/dashboard/caffeine-tracker';
import { CompactXpBar } from '@/components/dashboard/compact-xp-bar';
import { logActivity } from '@/lib/activity-log';
import { Lock, Crown } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CaffeinaPage() {
    const session = await getSession();
    if (!session) redirect('/login?redirect=/dashboard/cafeina');

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { subscriptionStatus: true, xp: true, level: true },
    });

    if (!user) redirect('/login');

    // Paywall — exclusivo para membros Premium (Clã)
    if (user.subscriptionStatus !== 'ACTIVE') {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30">
                            <Lock className="h-9 w-9 text-amber-500" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
                            Protocolo Exclusivo do Clã
                        </p>
                        <h1 className="font-serif text-3xl font-bold text-zinc-100">
                            Protocolo de Desligamento
                        </h1>
                        <p className="text-zinc-400 leading-relaxed">
                            O desmame de cafeína é uma ferramenta de soberania biológica. Este protocolo
                            completo — com guia educativo e rastreador em tempo real — é exclusivo para
                            membros ativos do Clã Ancestral.
                        </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3 text-left">
                        {[
                            'Relógio de limpeza com fases biológicas',
                            'Guia: O Sequestro da Adenosina',
                            'Comparativo Desmame vs. Cold Turkey',
                            'Histórico e métricas de progresso',
                            'Integração com app mobile (em breve)',
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <Crown className="h-4 w-4 shrink-0 text-amber-500" />
                                <span className="text-sm text-zinc-300">{item}</span>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/assinatura"
                        className="block w-full rounded-xl bg-amber-500 py-3.5 text-center text-sm font-bold text-zinc-950 uppercase tracking-wider transition hover:bg-amber-400"
                    >
                        Entrar para o Clã
                    </Link>

                    <Link
                        href="/dashboard"
                        className="block text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        Voltar ao Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const [currentDetox, history, stats] = await Promise.all([
        getCurrentDetox(),
        getDetoxHistory(15),
        getDetoxStats(),
    ]);

    logActivity({
        userId: session.userId,
        action: 'CAFEINA_ACCESS',
        resource: 'cafeina',
    }).catch(() => {});

    return (
        <div className="min-h-screen bg-zinc-950">
            <div className="px-4 sm:px-6 pt-6 max-w-2xl mx-auto">
                <CompactXpBar xp={user.xp} level={user.level} />
            </div>
            <CaffeineTracker
                initialDetox={currentDetox}
                history={history}
                stats={stats}
            />
        </div>
    );
}
