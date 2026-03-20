import { Swords } from 'lucide-react';
import { getAdminForumPosts, getAdminForumReplies } from './actions';
import { ForumModerationTable } from '@/components/admin/forum-moderation-table';

export const dynamic = 'force-dynamic';

export default async function AdminForumPage() {
    const [posts, replies] = await Promise.all([
        getAdminForumPosts(),
        getAdminForumReplies(),
    ]);

    const totalReplies = replies.length;
    const pinnedCount = posts.filter((p) => p.pinned).length;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = posts.filter((p) => new Date(p.createdAt) >= todayStart).length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                        <Swords className="h-5 w-5 text-amber-500" />
                    </div>
                    <h1 className="text-3xl font-bold">A Forja — Moderação</h1>
                </div>
                <p className="ml-12 text-muted-foreground">
                    Gerencie posts e respostas do fórum da comunidade.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                <StatCard label="Total de posts" value={posts.length} />
                <StatCard label="Total de respostas" value={totalReplies} />
                <StatCard label="Posts fixados" value={pinnedCount} />
                <StatCard label="Posts hoje" value={todayCount} />
            </div>

            {/* Table */}
            <ForumModerationTable initialPosts={posts} initialReplies={replies} />
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
    );
}
