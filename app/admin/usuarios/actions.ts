'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { Role, SubscriptionStatus } from '@prisma/client';
import { z } from 'zod';

async function getAdminUser() {
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
});

export async function updateUser(id: string, data: z.infer<typeof updateUserSchema>) {
    try {
        const validatedData = updateUserSchema.parse(data);

        await prisma.user.update({
            where: { id },
            data: {
                name: validatedData.name,
                role: validatedData.role,
                subscriptionStatus: validatedData.subscriptionStatus,
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
