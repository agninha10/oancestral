'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Role, SubscriptionStatus } from '@prisma/client';
import { z } from 'zod';

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
