'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth/session';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OngoingFast = {
    id: string;
    startTime: Date;
    targetHours: number;
};

export type EndedFastStatus = 'COMPLETED' | 'BROKEN';

// ─── getCurrentFast ───────────────────────────────────────────────────────────

export async function getCurrentFast(): Promise<OngoingFast | null> {
    const session = await getSession();
    if (!session) return null;

    return prisma.fastingSession.findFirst({
        where: { userId: session.userId, status: 'ONGOING' },
        select: { id: true, startTime: true, targetHours: true },
        orderBy: { startTime: 'desc' },
    });
}

// ─── startFast ────────────────────────────────────────────────────────────────

export async function startFast(
    targetHours: number,
): Promise<{ success: true; fast: OngoingFast } | { success: false; error: string }> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    if (![12, 16, 18, 24, 36, 48, 72].includes(targetHours)) {
        return { success: false, error: 'Meta de jejum inválida.' };
    }

    // Only one active fast at a time
    const existing = await prisma.fastingSession.findFirst({
        where: { userId: session.userId, status: 'ONGOING' },
        select: { id: true },
    });
    if (existing) return { success: false, error: 'Você já tem um jejum ativo.' };

    const fast = await prisma.fastingSession.create({
        data: {
            userId: session.userId,
            startTime: new Date(),
            targetHours,
            status: 'ONGOING',
        },
        select: { id: true, startTime: true, targetHours: true },
    });

    revalidatePath('/dashboard');
    return { success: true, fast };
}

// ─── endFast ──────────────────────────────────────────────────────────────────

export async function endFast(
    sessionId: string,
): Promise<{ success: true; status: EndedFastStatus } | { success: false; error: string }> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const fast = await prisma.fastingSession.findUnique({
        where: { id: sessionId },
        select: { userId: true, startTime: true, targetHours: true, status: true },
    });

    if (!fast) return { success: false, error: 'Jejum não encontrado.' };
    if (fast.userId !== session.userId) return { success: false, error: 'Não autorizado.' };
    if (fast.status !== 'ONGOING') return { success: false, error: 'Este jejum não está ativo.' };

    const endTime = new Date();
    const elapsedHours = (endTime.getTime() - fast.startTime.getTime()) / 3_600_000;
    const newStatus: EndedFastStatus = elapsedHours >= fast.targetHours ? 'COMPLETED' : 'BROKEN';

    await prisma.fastingSession.update({
        where: { id: sessionId },
        data: { endTime, status: newStatus },
    });

    revalidatePath('/dashboard');
    return { success: true, status: newStatus };
}
