'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth/session';

// ─── Constants ────────────────────────────────────────────────────────────────

const XP_PER_HOUR   = 50;
const XP_PER_LEVEL  = 2000;

// ─── Types ────────────────────────────────────────────────────────────────────

export type OngoingFast = {
    id: string;
    startTime: Date;
    targetHours: number;
};

export type EndedFastStatus = 'COMPLETED' | 'BROKEN';

export type BadgeUnlocked = {
    id: string;
    name: string;
    description: string;
    icon: string;
};

export type GamificationResult = {
    xpEarned: number;
    totalXp: number;
    oldLevel: number;
    newLevel: number;
    leveledUp: boolean;
    badgeUnlocked: BadgeUnlocked | null;
};

export type FastingHistory = {
    id: string;
    startTime: Date;
    endTime: Date | null;
    targetHours: number;
    status: string;
    durationSeconds: number | null;
};

export type UserGameProfile = {
    xp: number;
    level: number;
    userBadges: { badge: BadgeUnlocked; unlockedAt: Date }[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function levelFromXp(xp: number): number {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
}

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

// ─── getGameProfile ───────────────────────────────────────────────────────────

export async function getGameProfile(): Promise<UserGameProfile | null> {
    const session = await getSession();
    if (!session) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            xp: true,
            level: true,
            userBadges: {
                orderBy: { unlockedAt: 'asc' },
                select: {
                    unlockedAt: true,
                    badge: { select: { id: true, name: true, description: true, icon: true } },
                },
            },
        },
    });

    if (!user) return null;
    return user;
}

// ─── getAllBadges ─────────────────────────────────────────────────────────────

export async function getAllBadges(): Promise<BadgeUnlocked[]> {
    return prisma.badge.findMany({
        orderBy: { order: 'asc' },
        select: { id: true, name: true, description: true, icon: true },
    });
}

// ─── getFastingHistory ────────────────────────────────────────────────────────

export async function getFastingHistory(limit = 10): Promise<FastingHistory[]> {
    const session = await getSession();
    if (!session) return [];

    const rows = await prisma.fastingSession.findMany({
        where: { userId: session.userId, status: { not: 'ONGOING' } },
        orderBy: { startTime: 'desc' },
        take: limit,
        select: { id: true, startTime: true, endTime: true, targetHours: true, status: true },
    });

    return rows.map((r) => ({
        ...r,
        durationSeconds: r.endTime
            ? Math.floor((r.endTime.getTime() - r.startTime.getTime()) / 1000)
            : null,
    }));
}

// ─── startFast ────────────────────────────────────────────────────────────────

export async function startFast(
    targetHours: number,
    offsetHours: number = 0,
): Promise<{ success: true; fast: OngoingFast } | { success: false; error: string }> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    if (![12, 16, 18, 24, 36, 48, 72].includes(targetHours)) {
        return { success: false, error: 'Meta de jejum inválida.' };
    }

    if (offsetHours < 0 || offsetHours >= targetHours) {
        return { success: false, error: 'Horário retroativo inválido.' };
    }

    const existing = await prisma.fastingSession.findFirst({
        where: { userId: session.userId, status: 'ONGOING' },
        select: { id: true },
    });
    if (existing) return { success: false, error: 'Você já tem um jejum ativo.' };

    const startTime = new Date(Date.now() - offsetHours * 3_600_000);

    const fast = await prisma.fastingSession.create({
        data: { userId: session.userId, startTime, targetHours, status: 'ONGOING' },
        select: { id: true, startTime: true, targetHours: true },
    });

    revalidatePath('/dashboard');
    return { success: true, fast };
}

// ─── endFast ──────────────────────────────────────────────────────────────────

export async function endFast(sessionId: string): Promise<
    | { success: true;  status: 'COMPLETED'; gamification: GamificationResult }
    | { success: true;  status: 'BROKEN';    gamification: null }
    | { success: false; error: string }
> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const fast = await prisma.fastingSession.findUnique({
        where: { id: sessionId },
        select: { userId: true, startTime: true, targetHours: true, status: true },
    });

    if (!fast) return { success: false, error: 'Jejum não encontrado.' };
    if (fast.userId !== session.userId) return { success: false, error: 'Não autorizado.' };
    if (fast.status !== 'ONGOING') return { success: false, error: 'Este jejum não está ativo.' };

    const endTime      = new Date();
    const elapsedHours = (endTime.getTime() - fast.startTime.getTime()) / 3_600_000;
    const newStatus: EndedFastStatus = elapsedHours >= fast.targetHours ? 'COMPLETED' : 'BROKEN';

    await prisma.fastingSession.update({
        where: { id: sessionId },
        data: { endTime, status: newStatus },
    });

    if (newStatus === 'BROKEN') {
        revalidatePath('/dashboard/jejum');
        revalidatePath('/dashboard');
        return { success: true, status: 'BROKEN', gamification: null };
    }

    // ── Gamification ─────────────────────────────────────────────────────────

    const completedHours = Math.floor(elapsedHours);
    const xpEarned       = completedHours * XP_PER_HOUR;

    // Fetch current user XP + existing badges
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            xp: true,
            level: true,
            userBadges: { select: { badgeId: true } },
        },
    });
    if (!user) return { success: false, error: 'Usuário não encontrado.' };

    const oldXp    = user.xp;
    const newXp    = oldXp + xpEarned;
    const oldLevel = levelFromXp(oldXp);
    const newLevel = levelFromXp(newXp);
    const leveledUp = newLevel > oldLevel;

    // Check badge eligibility — find highest badge the user earns and hasn't unlocked yet
    const ownedBadgeIds = new Set(user.userBadges.map((ub) => ub.badgeId));
    const eligibleBadges = await prisma.badge.findMany({
        where: { requiredHours: { lte: completedHours } },
        orderBy: { requiredHours: 'desc' },
    });
    const newBadge = eligibleBadges.find((b) => !ownedBadgeIds.has(b.id)) ?? null;

    // Atomic update: XP + level + optional badge
    await prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: session.userId },
            data: { xp: newXp, level: newLevel },
        });

        if (newBadge) {
            await tx.userBadge.create({
                data: { userId: session.userId, badgeId: newBadge.id },
            });
        }
    });

    revalidatePath('/dashboard/jejum');
    revalidatePath('/dashboard');

    return {
        success: true,
        status: 'COMPLETED',
        gamification: {
            xpEarned,
            totalXp: newXp,
            oldLevel,
            newLevel,
            leveledUp,
            badgeUnlocked: newBadge
                ? { id: newBadge.id, name: newBadge.name, description: newBadge.description, icon: newBadge.icon }
                : null,
        },
    };
}
