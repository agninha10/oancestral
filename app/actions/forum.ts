'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import { generateForumSlug } from '@/lib/forum-utils';

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
    slug: string;
    title: string;
    content: string;
    views: number;
    pinned: boolean;
    createdAt: Date;
    author: { id: string; name: string | null; username: string | null; avatarUrl: string | null };
    category: { id: string; name: string; slug: string; icon: string };
    _count: { replies: number; likes: number };
    likedByMe: boolean;
};

export type ReplyItem = {
    id: string;
    content: string;
    createdAt: Date;
    parentId: string | null;
    author: { id: string; name: string | null; username: string | null; avatarUrl: string | null };
    replies: {
        id: string;
        content: string;
        createdAt: Date;
        parentId: string | null;
        author: { id: string; name: string | null; username: string | null; avatarUrl: string | null };
    }[];
};

export type PostDetail = PostSummary & {
    replies: ReplyItem[];
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
            author:   { select: { id: true, name: true, username: true, avatarUrl: true } },
            category: { select: { id: true, name: true, slug: true, icon: true } },
            _count:   { select: { replies: true, likes: true } },
            likes:    userId ? { where: { userId }, select: { id: true } } : false,
        },
    });

    return posts.map((p) => ({
        ...p,
        slug: p.slug ?? p.id,
        likedByMe: userId ? p.likes.length > 0 : false,
    }));
}

export async function getPostDetails(slug: string): Promise<PostDetail | null> {
    const session = await getSession();
    const userId = session?.userId;

    // Support both slug and legacy id lookup
    const post = await prisma.forumPost.findFirst({
        where: { OR: [{ slug }, { id: slug }] },
        include: {
            author:   { select: { id: true, name: true, username: true, avatarUrl: true } },
            category: { select: { id: true, name: true, slug: true, icon: true } },
            _count:   { select: { replies: true, likes: true } },
            likes:    userId ? { where: { userId }, select: { id: true } } : false,
            replies: {
                where:   { parentId: null },
                orderBy: { createdAt: 'asc' },
                include: {
                    author:  { select: { id: true, name: true, username: true, avatarUrl: true } },
                    replies: {
                        orderBy: { createdAt: 'asc' },
                        include: { author: { select: { id: true, name: true, username: true, avatarUrl: true } } },
                    },
                },
            },
        },
    });

    if (!post) return null;

    prisma.forumPost.update({
        where: { id: post.id },
        data:  { views: { increment: 1 } },
    }).catch(() => {});

    return {
        ...post,
        slug: post.slug ?? post.id,
        likedByMe: userId ? post.likes.length > 0 : false,
    };
}

// ─── Mutations ─────────────────────────────────────────────────────────────────

export async function createPost(data: {
    title: string;
    content: string;
    categoryId: string;
}): Promise<{ success: true; postSlug: string } | { success: false; error: string }> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const { title, content, categoryId } = data;
    if (!title.trim() || title.trim().length < 3)
        return { success: false, error: 'Título deve ter pelo menos 3 caracteres.' };
    if (!content.trim() || content.trim().length < 10)
        return { success: false, error: 'Conteúdo deve ter pelo menos 10 caracteres.' };
    if (!categoryId)
        return { success: false, error: 'Selecione uma categoria.' };

    const slug = generateForumSlug(title.trim());

    const post = await prisma.forumPost.create({
        data: { title: title.trim(), content: content.trim(), slug, categoryId, authorId: session.userId },
    });

    revalidatePath('/comunidade');
    return { success: true, postSlug: post.slug! };
}

export async function createReply(data: {
    postId: string;
    content: string;
    parentId?: string;
}): Promise<{ success: true } | { success: false; error: string }> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const { postId, content, parentId } = data;
    if (!content.trim() || content.trim().length < 2)
        return { success: false, error: 'Resposta muito curta.' };

    const post = await prisma.forumPost.findUnique({ where: { id: postId }, select: { id: true, slug: true } });
    if (!post) return { success: false, error: 'Post não encontrado.' };

    await prisma.forumReply.create({
        data: { postId, content: content.trim(), authorId: session.userId, parentId: parentId ?? null },
    });

    revalidatePath(`/comunidade/post/${post.slug ?? post.id}`);
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

    return { liked: !existing, count };
}
