'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function bulkUpdateRecipeAccess(recipeIds: string[], isPremium: boolean) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'ADMIN') {
            return { success: false, error: 'Não autorizado.' };
        }

        if (!recipeIds || recipeIds.length === 0) {
            return { success: false, error: 'Nenhuma receita selecionada.' };
        }

        await prisma.recipe.updateMany({
            where: {
                id: { in: recipeIds },
            },
            data: {
                isPremium,
            },
        });

        revalidatePath('/admin/receitas');
        return { success: true };
    } catch (error) {
        console.error('[bulkUpdateRecipeAccess] Erro ao atualizar receitas:', error);
        return { success: false, error: 'Erro ao atualizar o acesso das receitas.' };
    }
}
