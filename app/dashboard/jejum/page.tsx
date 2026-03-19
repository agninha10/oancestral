import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getCurrentFast } from '@/app/dashboard/fasting/actions';
import { FastingTracker } from '@/components/dashboard/fasting-tracker';

export const dynamic = 'force-dynamic';

export default async function JejumPage() {
    const session = await getSession();
    if (!session) redirect('/auth/login?redirect=/dashboard/jejum');

    const currentFast = await getCurrentFast();

    return (
        <div className="min-h-screen bg-zinc-950">
            <FastingTracker initialFast={currentFast} />
        </div>
    );
}
