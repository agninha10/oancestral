'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type CategoryWithCount = {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    order: number;
    _count: { posts: number };
};

export type PostSummary = {
    id: string;
    title: string;
    content: string;
    views: number;
    pinned: boolean;
    createdAt: Date;
    author: { id: string; name: string; avatarUrl: string | null };
    category: { id: string; name: string; slug: string; icon: string };
    _count: { replies: number; likes: number };
    likedByMe: boolean;
};

export type PostDetail = PostSummary & {
    replies: {
        id: string;
        content: string;
        createdAt: Date;
        author: { id: string; name: string; avatarUrl: string | null };
    }[];
};

// ─── Queries ───────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryWithCount[]> {
    return prisma.forumCategory.findMany({
        orderBy: { order: 'asc' },
        include: { _count: { select: { posts: true } } },
    });
}

export async function getPosts(categorySlug?: string): Promise<PostSummary[]> {
    const session = await getSession();
    const userId = session?.userId;

    const posts = await prisma.forumPost.findMany({
        where: categorySlug ? { category: { slug: categorySlug } } : undefined,
        orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
        take: 50,
        include: {
            author:   { select: { id: true, name: true, avatarUrl: true } },
            category: { select: { id: true, name: true, slug: true, icon: true } },
            _count:   { select: { replies: true, likes: true } },
            likes:    userId ? { where: { userId }, select: { id: true } } : false,
        },
    });

    return posts.map((p) => ({
        ...p,
        likedByMe: userId ? p.likes.length > 0 : false,
    }));
}

export async function getPostDetails(postId: string): Promise<PostDetail | null> {
    const session = await getSession();
    const userId = session?.userId;

    const post = await prisma.forumPost.findUnique({
        where: { id: postId },
        include: {
            author:   { select: { id: true, name: true, avatarUrl: true } },
            category: { select: { id: true, name: true, slug: true, icon: true } },
            _count:   { select: { replies: true, likes: true } },
            likes:    userId ? { where: { userId }, select: { id: true } } : false,
            replies: {
                orderBy: { createdAt: 'asc' },
                include: { author: { select: { id: true, name: true, avatarUrl: true } } },
            },
        },
    });

    if (!post) return null;

    // Increment view count (fire-and-forget)
    prisma.forumPost.update({
        where: { id: postId },
        data:  { views: { increment: 1 } },
    }).catch(() => {});

    return {
        ...post,
        likedByMe: userId ? post.likes.length > 0 : false,
    };
}

// ─── Mutations ─────────────────────────────────────────────────────────────────

export async function createPost(data: {
    title: string;
    content: string;
    categoryId: string;
}): Promise<{ success: true; postId: string } | { success: false; error: string }> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const { title, content, categoryId } = data;
    if (!title.trim() || title.trim().length < 3)
        return { success: false, error: 'Título deve ter pelo menos 3 caracteres.' };
    if (!content.trim() || content.trim().length < 10)
        return { success: false, error: 'Conteúdo deve ter pelo menos 10 caracteres.' };
    if (!categoryId)
        return { success: false, error: 'Selecione uma categoria.' };

    const post = await prisma.forumPost.create({
        data: {
            title:      title.trim(),
            content:    content.trim(),
            categoryId,
            authorId:   session.userId,
        },
    });

    revalidatePath('/comunidade');
    return { success: true, postId: post.id };
}

export async function createReply(data: {
    postId: string;
    content: string;
}): Promise<{ success: true } | { success: false; error: string }> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const { postId, content } = data;
    if (!content.trim() || content.trim().length < 2)
        return { success: false, error: 'Resposta muito curta.' };

    // Verify post exists
    const post = await prisma.forumPost.findUnique({ where: { id: postId }, select: { id: true } });
    if (!post) return { success: false, error: 'Post não encontrado.' };

    await prisma.forumReply.create({
        data: { postId, content: content.trim(), authorId: session.userId },
    });

    revalidatePath(`/comunidade/post/${postId}`);
    return { success: true };
}

export async function togglePostLike(postId: string): Promise<{
    liked: boolean;
    count: number;
}> {
    const session = await getSession();
    if (!session) return { liked: false, count: 0 };

    const existing = await prisma.postLike.findUnique({
        where: { postId_userId: { postId, userId: session.userId } },
    });

    if (existing) {
        await prisma.postLike.delete({ where: { id: existing.id } });
    } else {
        await prisma.postLike.create({ data: { postId, userId: session.userId } });
    }

    const count = await prisma.postLike.count({ where: { postId } });
    revalidatePath('/comunidade');
    revalidatePath(`/comunidade/post/${postId}`);

    return { liked: !existing, count };
}
