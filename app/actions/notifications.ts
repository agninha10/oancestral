'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { revalidatePath } from 'next/cache';

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType = 'SYSTEM' | 'COURSE' | 'POST' | 'RECIPE' | 'MANUAL';

export type AppNotification = {
    id: string;
    title: string;
    message: string;
    link: string | null;
    isRead: boolean;
    type: string;
    createdAt: Date;
};

// ─── Auth helper (admin) ──────────────────────────────────────────────────────

async function getAdminSession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');
        if (!token) return null;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { id: true, role: true },
        });
        return user?.role === 'ADMIN' ? user : null;
    } catch {
        return null;
    }
}

// ─── User-facing actions ──────────────────────────────────────────────────────

export async function getUserNotifications(): Promise<AppNotification[]> {
    const session = await getSession();
    if (!session) return [];

    return prisma.notification.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
            id: true,
            title: true,
            message: true,
            link: true,
            isRead: true,
            type: true,
            createdAt: true,
        },
    });
}

export async function markAsRead(notificationId: string): Promise<void> {
    const session = await getSession();
    if (!session) return;

    await prisma.notification.updateMany({
        where: { id: notificationId, userId: session.userId },
        data: { isRead: true },
    });
}

export async function markAllAsRead(): Promise<void> {
    const session = await getSession();
    if (!session) return;

    await prisma.notification.updateMany({
        where: { userId: session.userId, isRead: false },
        data: { isRead: true },
    });
    revalidatePath('/dashboard');
}

// ─── Internal helpers (called from API routes / server code) ─────────────────

export async function createNotification(
    userId: string,
    title: string,
    message: string,
    link: string | null,
    type: NotificationType,
): Promise<void> {
    try {
        await prisma.notification.create({
            data: { userId, title, message, link, type },
        });
    } catch {
        // Non-blocking — logging failures should never break the main flow
    }
}

export async function broadcastNotification(
    title: string,
    message: string,
    link: string | null,
    type: NotificationType,
): Promise<void> {
    try {
        const users = await prisma.user.findMany({ select: { id: true } });
        if (users.length === 0) return;
        await prisma.notification.createMany({
            data: users.map((u) => ({ userId: u.id, title, message, link, type })),
        });
    } catch {
        // Non-blocking
    }
}

// Notify only users enrolled in a specific course
export async function notifyEnrolledUsers(
    courseId: string,
    title: string,
    message: string,
    link: string | null,
): Promise<void> {
    try {
        const enrollments = await prisma.courseEnrollment.findMany({
            where: { courseId },
            select: { userId: true },
        });
        if (enrollments.length === 0) return;
        await prisma.notification.createMany({
            data: enrollments.map((e) => ({
                userId: e.userId,
                title,
                message,
                link,
                type: 'COURSE' as NotificationType,
            })),
        });
    } catch {
        // Non-blocking
    }
}

// ─── Admin actions ────────────────────────────────────────────────────────────

export async function adminSendNotification(
    target: 'all' | string,   // 'all' = broadcast, otherwise userId
    title: string,
    message: string,
    link: string | null,
): Promise<{ success: boolean; error?: string; count?: number }> {
    const admin = await getAdminSession();
    if (!admin) return { success: false, error: 'Não autorizado.' };

    if (!title.trim() || !message.trim()) {
        return { success: false, error: 'Título e mensagem são obrigatórios.' };
    }

    if (target === 'all') {
        const users = await prisma.user.findMany({ select: { id: true } });
        if (users.length === 0) return { success: true, count: 0 };
        await prisma.notification.createMany({
            data: users.map((u) => ({
                userId: u.id,
                title: title.trim(),
                message: message.trim(),
                link: link?.trim() || null,
                type: 'MANUAL' as NotificationType,
            })),
        });
        return { success: true, count: users.length };
    }

    const user = await prisma.user.findUnique({
        where: { id: target },
        select: { id: true },
    });
    if (!user) return { success: false, error: 'Usuário não encontrado.' };

    await prisma.notification.create({
        data: {
            userId: user.id,
            title: title.trim(),
            message: message.trim(),
            link: link?.trim() || null,
            type: 'MANUAL',
        },
    });
    return { success: true, count: 1 };
}

export async function searchUsersForAdmin(
    query: string,
): Promise<{ id: string; email: string; name: string }[]> {
    const admin = await getAdminSession();
    if (!admin || query.trim().length < 2) return [];

    return prisma.user.findMany({
        where: {
            OR: [
                { email: { contains: query.trim(), mode: 'insensitive' } },
                { name: { contains: query.trim(), mode: 'insensitive' } },
            ],
        },
        select: { id: true, email: true, name: true },
        take: 8,
    });
}
