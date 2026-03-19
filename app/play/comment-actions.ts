'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth/session';
import { z } from 'zod';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CommentUser = {
    id: string;
    name: string;
    role: string;                    // 'USER' | 'ADMIN'
    _count: { blogPosts: number };   // > 0 → "Autor" badge
};

export type ReplyWithUser = {
    id: string;
    text: string;
    createdAt: Date;
    parentId: string;
    user: CommentUser;
};

export type CommentWithUser = {
    id: string;
    text: string;
    createdAt: Date;
    parentId: string | null;
    user: CommentUser;
    replies: ReplyWithUser[];
};

// Shared user select (includes badge fields)
const userSelect = {
    id: true,
    name: true,
    role: true,
    _count: { select: { blogPosts: true } },
} as const;

// Shared select shape for a comment + its replies
const commentSelect = {
    id: true,
    text: true,
    createdAt: true,
    parentId: true,
    user: { select: userSelect },
    replies: {
        orderBy: { createdAt: 'asc' as const },
        select: {
            id: true,
            text: true,
            createdAt: true,
            parentId: true,
            user: { select: userSelect },
        },
    },
} as const;

// ─── getLessonComments ────────────────────────────────────────────────────────

export async function getLessonComments(lessonId: string): Promise<CommentWithUser[]> {
    return prisma.lessonComment.findMany({
        where: { lessonId, parentId: null },
        orderBy: { createdAt: 'asc' },
        select: commentSelect,
    }) as Promise<CommentWithUser[]>;
}

// ─── postComment ──────────────────────────────────────────────────────────────

const textSchema = z
    .string()
    .trim()
    .min(1, 'O comentário não pode estar vazio.')
    .max(2000, 'Máximo de 2000 caracteres.');

export async function postComment(
    lessonId: string,
    text: string,
    parentId?: string,
): Promise<{ success: true; comment: CommentWithUser } | { success: false; error: string }> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const parsed = textSchema.safeParse(text);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    // Resolve lesson → course for enrollment check
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { module: { select: { courseId: true } } },
    });
    if (!lesson) return { success: false, error: 'Aula não encontrada.' };

    const enrollment = await prisma.courseEnrollment.findUnique({
        where: {
            userId_courseId: { userId: session.userId, courseId: lesson.module.courseId },
        },
        select: { id: true },
    });
    if (!enrollment) return { success: false, error: 'Você não tem acesso a este curso.' };

    // If this is a reply, ensure the parent belongs to the same lesson
    if (parentId) {
        const parent = await prisma.lessonComment.findUnique({
            where: { id: parentId },
            select: { lessonId: true, parentId: true },
        });
        if (!parent || parent.lessonId !== lessonId) {
            return { success: false, error: 'Comentário pai inválido.' };
        }
        // No deeper than 1 level — prevent replying to a reply
        if (parent.parentId !== null) {
            return { success: false, error: 'Só é possível responder comentários principais.' };
        }
    }

    const comment = await prisma.lessonComment.create({
        data: {
            text: parsed.data,
            userId: session.userId,
            lessonId,
            ...(parentId ? { parentId } : {}),
        },
        select: commentSelect,
    });

    revalidatePath('/play');

    return { success: true, comment: comment as CommentWithUser };
}
