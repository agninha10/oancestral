import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getSession } from '@/lib/auth/session';
import { getCategories } from '@/app/actions/forum';
import { CommunitySidebar } from '@/components/forum/community-sidebar';

export const dynamic = 'force-dynamic';

export default async function ComunidadeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) redirect('/auth/login?redirect=/comunidade');

    const categories = await getCategories();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Top bar */}
            <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-20">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-xl font-bold text-amber-400 tracking-tight">
                            A Forja
                        </h1>
                        <p className="text-xs text-zinc-500 mt-0.5">Fórum da Comunidade Ancestral</p>
                    </div>
                    <a
                        href="/dashboard"
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        ← Voltar ao Dashboard
                    </a>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar — 25% */}
                    <div className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-[73px]">
                            <Suspense>
                                <CommunitySidebar categories={categories} />
                            </Suspense>
                        </div>
                    </div>

                    {/* Main content — 75% */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
