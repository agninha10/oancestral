import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import {
    getCurrentFast,
    getGameProfile,
    getAllBadges,
    getFastingHistory,
    getActiveFastingUsers,
} from '@/app/dashboard/fasting/actions';
import { FastingTracker } from '@/components/dashboard/fasting-tracker';
import { TribeInFasting } from '@/components/dashboard/tribe-in-fasting';
import { CompactXpBar } from '@/components/dashboard/compact-xp-bar';
import { logActivity } from '@/lib/activity-log';

export const dynamic = 'force-dynamic';

export default async function JejumPage() {
    const session = await getSession();
    if (!session) redirect('/login?redirect=/dashboard/jejum');

    const [currentFast, gameProfile, allBadges, history, tribeUsers] = await Promise.all([
        getCurrentFast(),
        getGameProfile(),
        getAllBadges(),
        getFastingHistory(20),
        getActiveFastingUsers(),
    ]);

    logActivity({
        userId: session.userId,
        action: 'FASTING_ACCESS',
        resource: 'fasting',
    }).catch(() => {});

    return (
        <div className="min-h-screen bg-zinc-950">
            {gameProfile && (
                <div className="px-4 sm:px-6 pt-6 max-w-2xl mx-auto">
                    <CompactXpBar xp={gameProfile.xp} level={gameProfile.level} />
                </div>
            )}
            <FastingTracker
                initialFast={currentFast}
                gameProfile={gameProfile}
                allBadges={allBadges}
                history={history}
            />
            <TribeInFasting
                users={tribeUsers}
                currentUserId={session.userId}
            />
        </div>
    );
}
