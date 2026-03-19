'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { z } from 'zod';

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function getAdminUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');
        if (!token) return null;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { id: true, name: true, role: true },
        });
        if (user?.role !== 'ADMIN') return null;
        return user;
    } catch {
        return null;
    }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlatformComment = {
    id: string;
    text: string;
    createdAt: Date;
    parentId: string | null;
    user: { id: string; name: string };
    lesson: {
        id: string;
        title: string;
        module: {
            course: { id: string; title: string; slug: string };
        };
    };
    _count: { replies: number };
};

type ActionResult = { success: true } | { success: false; error: string };

// ─── getAllPlatformComments ────────────────────────────────────────────────────

export async function getAllPlatformComments(): Promise<PlatformComment[]> {
    return prisma.lessonComment.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            text: true,
            createdAt: true,
            parentId: true,
            user: { select: { id: true, name: true } },
            lesson: {
                select: {
                    id: true,
                    title: true,
                    module: {
                        select: {
                            course: { select: { id: true, title: true, slug: true } },
                        },
                    },
                },
            },
            _count: { select: { replies: true } },
        },
    }) as Promise<PlatformComment[]>;
}

// ─── deleteComment ────────────────────────────────────────────────────────────

export async function deleteComment(commentId: string): Promise<ActionResult> {
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: 'Não autorizado.' };

    const comment = await prisma.lessonComment.findUnique({
        where: { id: commentId },
        select: {
            lesson: {
                select: { module: { select: { course: { select: { slug: true } } } } },
            },
        },
    });
    if (!comment) return { success: false, error: 'Comentário não encontrado.' };

    // Cascade handles deleting replies automatically
    await prisma.lessonComment.delete({ where: { id: commentId } });

    const slug = comment.lesson.module.course.slug;
    revalidatePath('/admin/comentarios');
    revalidatePath(`/play/${slug}`);

    return { success: true };
}

// ─── adminReplyComment ────────────────────────────────────────────────────────

const replyTextSchema = z
    .string()
    .trim()
    .min(1, 'A resposta não pode estar vazia.')
    .max(2000, 'Máximo de 2000 caracteres.');

export async function adminReplyComment(
    lessonId: string,
    parentId: string,
    text: string,
): Promise<ActionResult> {
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: 'Não autorizado.' };

    const parsed = replyTextSchema.safeParse(text);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    // Verify parent exists and belongs to this lesson
    const parent = await prisma.lessonComment.findUnique({
        where: { id: parentId },
        select: {
            lessonId: true,
            parentId: true,
            lesson: {
                select: { module: { select: { course: { select: { slug: true } } } } },
            },
        },
    });
    if (!parent || parent.lessonId !== lessonId) {
        return { success: false, error: 'Comentário pai inválido.' };
    }
    // Reply to the root-level parent (flatten threading at 1 level)
    const effectiveParentId = parent.parentId ?? parentId;

    await prisma.lessonComment.create({
        data: {
            text: parsed.data,
            userId: admin.id,
            lessonId,
            parentId: effectiveParentId,
        },
    });

    const slug = parent.lesson.module.course.slug;
    revalidatePath('/admin/comentarios');
    revalidatePath(`/play/${slug}`);

    return { success: true };
}
