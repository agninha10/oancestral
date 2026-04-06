'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Role, SubscriptionStatus } from '@prisma/client';
import { z } from 'zod';
import { generateVerificationCode, sendVerificationEmail } from '@/lib/auth/email';

async function getAdminUser() {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== 'ADMIN') return null;

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, role: true },
        });

        if (user?.role !== 'ADMIN') return null;
        return user;
    } catch {
        return null;
    }
}

const updateUserSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    role: z.nativeEnum(Role),
    subscriptionStatus: z.nativeEnum(SubscriptionStatus),
    emailVerified: z.boolean(),
});

export async function updateUser(id: string, data: z.infer<typeof updateUserSchema>) {
    const admin = await getAdminUser();
    if (!admin) {
        return { success: false, error: 'Não autorizado' };
    }

    try {
        const validatedData = updateUserSchema.parse(data);

        await prisma.user.update({
            where: { id },
            data: {
                name: validatedData.name,
                role: validatedData.role,
                subscriptionStatus: validatedData.subscriptionStatus,
                emailVerified: validatedData.emailVerified ? new Date() : null,
                verificationToken: validatedData.emailVerified ? null : undefined,
                verificationTokenExpires: validatedData.emailVerified ? null : undefined,
            },
        });

        revalidatePath('/admin/usuarios');
        revalidatePath(`/admin/usuarios/${id}`);

        return { success: true };
    } catch (error) {
        console.error('Failed to update user:', error);
        return { success: false, error: 'Falha ao atualizar usuário' };
    }
}

export async function deleteUser(id: string) {
    const admin = await getAdminUser();
    if (!admin) {
        return { success: false, error: 'Não autorizado' };
    }

    try {
        // Prevent self-deletion
        if (admin.id === id) {
            return { success: false, error: 'Você não pode excluir sua própria conta' };
        }

        await prisma.user.delete({ where: { id } });

        revalidatePath('/admin/usuarios');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete user:', error);
        return { success: false, error: 'Falha ao excluir usuário' };
    }
}

export async function resendVerificationEmail(id: string) {
    const admin = await getAdminUser();
    if (!admin) {
        return { success: false, error: 'Não autorizado' };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, emailVerified: true },
        });

        if (!user) {
            return { success: false, error: 'Usuário não encontrado' };
        }

        if (user.emailVerified) {
            return { success: false, error: 'Usuário já está verificado' };
        }

        const code = generateVerificationCode();

        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken: code,
                verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        await sendVerificationEmail(user.email, code, user.name ?? undefined);

        revalidatePath('/admin/usuarios');
        revalidatePath(`/admin/usuarios/${id}`);

        return { success: true };
    } catch (error) {
        console.error('Failed to resend verification email:', error);
        return { success: false, error: 'Falha ao reenviar e-mail de verificação' };
    }
}
