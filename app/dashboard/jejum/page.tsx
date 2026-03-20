import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import {
    getCurrentFast,
    getGameProfile,
    getAllBadges,
    getFastingHistory,
} from '@/app/dashboard/fasting/actions';
import { FastingTracker } from '@/components/dashboard/fasting-tracker';
import { logActivity } from '@/lib/activity-log';

export const dynamic = 'force-dynamic';

export default async function JejumPage() {
    const session = await getSession();
    if (!session) redirect('/login?redirect=/dashboard/jejum');

    const [currentFast, gameProfile, allBadges, history] = await Promise.all([
        getCurrentFast(),
        getGameProfile(),
        getAllBadges(),
        getFastingHistory(20),
    ]);

    logActivity({
        userId: session.userId,
        action: 'FASTING_ACCESS',
        resource: 'fasting',
    }).catch(() => {});

    return (
        <div className="min-h-screen bg-zinc-950">
            <FastingTracker
                initialFast={currentFast}
                gameProfile={gameProfile}
                allBadges={allBadges}
                history={history}
            />
        </div>
    );
}
