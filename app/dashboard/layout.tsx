import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect('/auth/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            subscriptionStatus: true,
        },
    });

    if (!user) {
        redirect('/api/auth/logout?redirect=/auth/login');
    }

    return (
        <DashboardClient>
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <DashboardSidebar user={user} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col lg:pl-64">
                    <DashboardHeader user={user} />
                    <main className="flex-1 bg-background">
                        {children}
                    </main>
                </div>
            </div>
        </DashboardClient>
    );
}
