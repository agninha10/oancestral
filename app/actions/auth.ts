'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
    name:     z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres.'),
    email:    z.string().trim().toLowerCase().email('E-mail inválido.'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
});

export type RegisterResult =
    | { success: true }
    | { success: false; error: string };

export async function registerUser(
    name: string,
    email: string,
    password: string,
): Promise<RegisterResult> {
    const parsed = registerSchema.safeParse({ name, email, password });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const existing = await prisma.user.findUnique({
        where:  { email: parsed.data.email },
        select: { id: true },
    });

    if (existing) {
        return { success: false, error: 'Este e-mail já está em uso. Tente fazer login.' };
    }

    const hash = await bcrypt.hash(parsed.data.password, 10);

    await prisma.user.create({
        data: {
            name:     parsed.data.name,
            email:    parsed.data.email,
            password: hash,
        },
    });

    return { success: true };
}
