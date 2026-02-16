import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { CoursesNetflixView } from '@/components/dashboard/courses-netflix-view';

export default async function DashboardCursosPage() {
    const session = await getSession();

    if (!session) {
        redirect('/auth/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            subscriptionStatus: true,
        },
    });

    if (!user) {
        redirect('/api/auth/logout?redirect=/auth/login');
    }

    return (
        <div className="min-h-screen bg-background">
            <CoursesNetflixView userId={session.userId} />
        </div>
    );
}
