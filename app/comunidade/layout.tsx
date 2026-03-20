import { Suspense } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { getCategories } from '@/app/actions/forum';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { DashboardMain } from '@/components/dashboard/dashboard-main';
import { CommunitySidebar } from '@/components/forum/community-sidebar';
import { Swords, LogIn } from 'lucide-react';

export const dynamic = 'force-dynamic';

// ─── Public top bar ────────────────────────────────────────────────────────────

function PublicHeader() {
    return (
        <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Swords className="h-5 w-5 text-amber-400" />
                    <span className="font-serif text-lg font-bold text-amber-400">A Forja</span>
                    <span className="hidden sm:inline text-xs text-zinc-500 ml-1">— Fórum Ancestral</span>
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

// ─── Forum inner layout (shared between auth/public) ──────────────────────────

function ForumInner({
    categories,
    children,
}: {
    categories: Awaited<ReturnType<typeof getCategories>>;
    children: React.ReactNode;
}) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex gap-6">
                <div className="hidden lg:block w-56 shrink-0">
                    <div className="sticky top-6">
                        <Suspense>
                            <CommunitySidebar categories={categories} />
                        </Suspense>
                    </div>
                </div>
                <div className="flex-1 min-w-0">{children}</div>
            </div>
        </div>
    );
}

// ─── Layout ────────────────────────────────────────────────────────────────────

export default async function ComunidadeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    const categories = await getCategories();

    // ── Authenticated: full dashboard shell ───────────────────────────────────
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
                                <ForumInner categories={categories}>{children}</ForumInner>
                            </main>
                        </DashboardMain>
                    </div>
                </DashboardClient>
            );
        }
    }

    // ── Guest: minimal public layout ─────────────────────────────────────────
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <PublicHeader />
            <ForumInner categories={categories}>{children}</ForumInner>
        </div>
    );
}
