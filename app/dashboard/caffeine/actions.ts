'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth/session';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CaffeineProtocol = 'PROGRESSIVE' | 'COLD_TURKEY';
export type CaffeineStatus = 'ONGOING' | 'COMPLETED' | 'ABANDONED';

export type OngoingDetox = {
    id: string;
    startTime: Date;
    protocol: CaffeineProtocol;
};

export type DetoxHistoryItem = {
    id: string;
    startTime: Date;
    endTime: Date | null;
    protocol: CaffeineProtocol;
    status: CaffeineStatus;
    durationSeconds: number | null;
    notes: string | null;
};

// ─── getCurrentDetox ──────────────────────────────────────────────────────────

export async function getCurrentDetox(): Promise<OngoingDetox | null> {
    const session = await getSession();
    if (!session) return null;

    const detox = await prisma.caffeineDetoxSession.findFirst({
        where: { userId: session.userId, status: 'ONGOING' },
        orderBy: { createdAt: 'desc' },
        select: { id: true, startTime: true, protocol: true },
    });

    if (!detox) return null;
    return detox as OngoingDetox;
}

// ─── startDetox ───────────────────────────────────────────────────────────────

export async function startDetox(protocol: CaffeineProtocol): Promise<OngoingDetox> {
    const session = await getSession();
    if (!session) throw new Error('Não autenticado');

    // Abandon any existing ongoing session
    await prisma.caffeineDetoxSession.updateMany({
        where: { userId: session.userId, status: 'ONGOING' },
        data: { status: 'ABANDONED', endTime: new Date() },
    });

    const detox = await prisma.caffeineDetoxSession.create({
        data: {
            userId: session.userId,
            startTime: new Date(),
            protocol,
            status: 'ONGOING',
        },
        select: { id: true, startTime: true, protocol: true },
    });

    revalidatePath('/dashboard/cafeina');
    revalidatePath('/dashboard');
    return detox as OngoingDetox;
}

// ─── endDetox ─────────────────────────────────────────────────────────────────

export async function endDetox(
    detoxId: string,
    status: 'COMPLETED' | 'ABANDONED',
    notes?: string
): Promise<void> {
    const session = await getSession();
    if (!session) throw new Error('Não autenticado');

    await prisma.caffeineDetoxSession.update({
        where: { id: detoxId, userId: session.userId },
        data: { status, endTime: new Date(), notes: notes ?? null },
    });

    revalidatePath('/dashboard/cafeina');
    revalidatePath('/dashboard');
}

// ─── getDetoxHistory ──────────────────────────────────────────────────────────

export async function getDetoxHistory(limit = 10): Promise<DetoxHistoryItem[]> {
    const session = await getSession();
    if (!session) return [];

    const sessions = await prisma.caffeineDetoxSession.findMany({
        where: { userId: session.userId, status: { not: 'ONGOING' } },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
            id: true,
            startTime: true,
            endTime: true,
            protocol: true,
            status: true,
            notes: true,
        },
    });

    return sessions.map((s) => ({
        ...s,
        protocol: s.protocol as CaffeineProtocol,
        status: s.status as CaffeineStatus,
        durationSeconds:
            s.endTime
                ? Math.floor((s.endTime.getTime() - s.startTime.getTime()) / 1000)
                : null,
    }));
}

// ─── getDetoxStats ────────────────────────────────────────────────────────────

export type DetoxStats = {
    totalCompleted: number;
    longestStreak: number; // in hours
    currentStreak: number | null; // in hours if ONGOING
};

export async function getDetoxStats(): Promise<DetoxStats> {
    const session = await getSession();
    if (!session) return { totalCompleted: 0, longestStreak: 0, currentStreak: null };

    const completed = await prisma.caffeineDetoxSession.findMany({
        where: { userId: session.userId, status: 'COMPLETED' },
        select: { startTime: true, endTime: true },
    });

    const ongoing = await prisma.caffeineDetoxSession.findFirst({
        where: { userId: session.userId, status: 'ONGOING' },
        select: { startTime: true },
    });

    const longestStreak = completed.reduce((max, s) => {
        if (!s.endTime) return max;
        const hours = (s.endTime.getTime() - s.startTime.getTime()) / 3_600_000;
        return hours > max ? hours : max;
    }, 0);

    const currentStreak = ongoing
        ? (Date.now() - ongoing.startTime.getTime()) / 3_600_000
        : null;

    return {
        totalCompleted: completed.length,
        longestStreak: Math.floor(longestStreak),
        currentStreak: currentStreak !== null ? Math.floor(currentStreak) : null,
    };
}
