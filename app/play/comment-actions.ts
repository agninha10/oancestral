'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth/session';
import { z } from 'zod';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CommentWithUser = {
    id: string;
    text: string;
    createdAt: Date;
    user: { id: string; name: string };
};

// ─── getLessonComments ────────────────────────────────────────────────────────

export async function getLessonComments(lessonId: string): Promise<CommentWithUser[]> {
    return prisma.lessonComment.findMany({
        where: { lessonId },
        orderBy: { createdAt: 'asc' },
        select: {
            id: true,
            text: true,
            createdAt: true,
            user: { select: { id: true, name: true } },
        },
    });
}

// ─── postComment ──────────────────────────────────────────────────────────────

const postCommentSchema = z.object({
    text: z
        .string()
        .trim()
        .min(1, 'O comentário não pode estar vazio.')
        .max(2000, 'Máximo de 2000 caracteres.'),
});

export async function postComment(
    lessonId: string,
    text: string,
): Promise<{ success: true; comment: CommentWithUser } | { success: false; error: string }> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const parsed = postCommentSchema.safeParse({ text });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    // Verify the lesson exists and the user is enrolled in its course
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { module: { select: { courseId: true } } },
    });
    if (!lesson) return { success: false, error: 'Aula não encontrada.' };

    const enrollment = await prisma.courseEnrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.userId,
                courseId: lesson.module.courseId,
            },
        },
        select: { id: true },
    });
    if (!enrollment) {
        return { success: false, error: 'Você não tem acesso a este curso.' };
    }

    const comment = await prisma.lessonComment.create({
        data: {
            text: parsed.data.text,
            userId: session.userId,
            lessonId,
        },
        select: {
            id: true,
            text: true,
            createdAt: true,
            user: { select: { id: true, name: true } },
        },
    });

    revalidatePath('/play');

    return { success: true, comment };
}
