'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth/session';

export async function markLessonComplete(
    lessonId: string,
    courseSlug: string,
): Promise<{ success: boolean; error?: string }> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado' };

    await prisma.userProgress.upsert({
        where: { userId_lessonId: { userId: session.userId, lessonId } },
        create: {
            userId: session.userId,
            lessonId,
            isCompleted: true,
            completedAt: new Date(),
        },
        update: {
            isCompleted: true,
            completedAt: new Date(),
        },
    });

    revalidatePath(`/play/${courseSlug}`);
    revalidatePath('/dashboard/cursos');

    return { success: true };
}
