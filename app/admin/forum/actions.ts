'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type AdminForumPost = {
    id: string;
    slug: string | null;
    title: string;
    content: string;
    pinned: boolean;
    views: number;
    createdAt: Date;
    author: { id: string; name: string | null; avatarUrl: string | null };
    category: { id: string; name: string; icon: string };
    _count: { replies: number; likes: number };
};

export type AdminForumReply = {
    id: string;
    content: string;
    createdAt: Date;
    parentId: string | null;
    postId: string;
    postTitle: string;
    postSlug: string | null;
    author: { id: string; name: string | null; avatarUrl: string | null };
};

// ─── Queries ───────────────────────────────────────────────────────────────────

export async function getAdminForumPosts(): Promise<AdminForumPost[]> {
    const posts = await prisma.forumPost.findMany({
        orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
        include: {
            author:   { select: { id: true, name: true, avatarUrl: true } },
            category: { select: { id: true, name: true, icon: true } },
            _count:   { select: { replies: true, likes: true } },
        },
    });
    return posts;
}

export async function getAdminForumReplies(): Promise<AdminForumReply[]> {
    const replies = await prisma.forumReply.findMany({
        orderBy: { createdAt: 'desc' },
        take: 200,
        include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
            post:   { select: { title: true, slug: true } },
        },
    });

    return replies.map((r) => ({
        id: r.id,
        content: r.content,
        createdAt: r.createdAt,
        parentId: r.parentId,
        postId: r.postId,
        postTitle: r.post.title,
        postSlug: r.post.slug,
        author: r.author,
    }));
}

// ─── Mutations ─────────────────────────────────────────────────────────────────

async function assertAdmin() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') throw new Error('Não autorizado.');
}

export async function adminDeletePost(
    postId: string,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await assertAdmin();
        // Delete likes and replies first (cascade may not cover all paths)
        await prisma.postLike.deleteMany({ where: { postId } });
        await prisma.forumReply.deleteMany({ where: { postId } });
        await prisma.forumPost.delete({ where: { id: postId } });
        revalidatePath('/comunidade');
        revalidatePath('/admin/forum');
        return { success: true };
    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Erro ao apagar post.' };
    }
}

export async function adminDeleteReply(
    replyId: string,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await assertAdmin();
        // Delete sub-replies first
        await prisma.forumReply.deleteMany({ where: { parentId: replyId } });
        await prisma.forumReply.delete({ where: { id: replyId } });
        revalidatePath('/comunidade');
        revalidatePath('/admin/forum');
        return { success: true };
    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Erro ao apagar resposta.' };
    }
}

export async function adminTogglePin(
    postId: string,
    pinned: boolean,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await assertAdmin();
        await prisma.forumPost.update({ where: { id: postId }, data: { pinned } });
        revalidatePath('/comunidade');
        revalidatePath('/admin/forum');
        return { success: true };
    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : 'Erro ao fixar post.' };
    }
}
