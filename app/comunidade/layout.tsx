import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { getCategories } from '@/app/actions/forum';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { DashboardMain } from '@/components/dashboard/dashboard-main';
import { CommunitySidebar } from '@/components/forum/community-sidebar';

export const dynamic = 'force-dynamic';

export default async function ComunidadeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) redirect('/auth/login?redirect=/comunidade');

    const [user, categories] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                subscriptionStatus: true,
                avatarUrl: true,
            },
        }),
        getCategories(),
    ]);

    if (!user) redirect('/api/auth/logout?redirect=/auth/login');

    return (
        <DashboardClient>
            <div className="flex min-h-screen">
                <DashboardSidebar user={user} />
                <DashboardMain>
                    <DashboardHeader user={user} />
                    <main className="flex-1 bg-zinc-950">
                        <div className="mx-auto max-w-7xl px-4 py-6">
                            <div className="flex gap-6">
                                {/* Forum category sidebar */}
                                <div className="hidden lg:block w-56 shrink-0">
                                    <div className="sticky top-6">
                                        <Suspense>
                                            <CommunitySidebar categories={categories} />
                                        </Suspense>
                                    </div>
                                </div>

                                {/* Forum content */}
                                <div className="flex-1 min-w-0">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </main>
                </DashboardMain>
            </div>
        </DashboardClient>
    );
}
