/**
 * app/admin/comentarios/page.tsx
 *
 * Painel de moderação de comentários da plataforma.
 * Server Component: busca todos os comentários e passa ao Client Component.
 */

import { MessageCircle } from 'lucide-react';
import { getAllPlatformComments } from './actions';
import { CommentModerationTable } from '@/components/admin/comment-moderation-table';

export const dynamic = 'force-dynamic';

export default async function AdminComentariosPage() {
    const comments = await getAllPlatformComments();

    const rootCount = comments.filter((c) => c.parentId === null).length;
    const replyCount = comments.length - rootCount;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10">
                        <MessageCircle className="h-5 w-5 text-sky-500" />
                    </div>
                    <h1 className="text-3xl font-bold">Moderação de Comentários</h1>
                </div>
                <p className="ml-12 text-muted-foreground">
                    Acompanhe, responda e modere todas as interações dos alunos nas aulas.
                </p>
            </div>

            {/* Stats strip */}
            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Total de comentários" value={comments.length} />
                <StatCard label="Comentários principais" value={rootCount} />
                <StatCard label="Respostas" value={replyCount} />
            </div>

            {/* Table */}
            <CommentModerationTable initialComments={comments} />
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
