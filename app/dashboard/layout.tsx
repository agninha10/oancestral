import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { DashboardMain } from '@/components/dashboard/dashboard-main';

// Força renderização dinâmica para sempre verificar autenticação
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            subscriptionStatus: true,
            avatarUrl: true,
        },
    });

    if (!user) {
        redirect('/login');
    }

    return (
        <DashboardClient>
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <DashboardSidebar user={user} />

                {/* Main Content */}
                <DashboardMain>
                    <DashboardHeader user={user} />
                    <main className="flex-1 bg-background">
                        {children}
                    </main>
                </DashboardMain>
            </div>
        </DashboardClient>
    );
}
