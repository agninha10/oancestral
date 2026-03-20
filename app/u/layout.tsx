import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { DashboardMain } from '@/components/dashboard/dashboard-main';
import Link from 'next/link';
import { Swords, LogIn } from 'lucide-react';

export const dynamic = 'force-dynamic';

function PublicHeader() {
    return (
        <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Swords className="h-5 w-5 text-amber-400" />
                    <span className="font-serif text-lg font-bold text-amber-400">O Ancestral</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link
                        href="/auth/login"
                        className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition-colors"
                    >
                        <LogIn className="h-3.5 w-3.5" /> Entrar
                    </Link>
                    <Link
                        href="/auth/register"
                        className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition-colors"
                    >
                        Criar conta
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default async function UserProfileLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (session) {
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { id: true, name: true, email: true, role: true, subscriptionStatus: true, avatarUrl: true },
        });

        if (user) {
            return (
                <DashboardClient>
                    <div className="flex min-h-screen">
                        <DashboardSidebar user={user} />
                        <DashboardMain>
                            <DashboardHeader user={user} />
                            <main className="flex-1 bg-zinc-950">
                                {children}
                            </main>
                        </DashboardMain>
                    </div>
                </DashboardClient>
            );
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <PublicHeader />
            {children}
        </div>
    );
}
