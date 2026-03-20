'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { generateVerificationCode } from '@/lib/auth/email';
import { Resend } from 'resend';
import EmailChangeEmail from '@/emails/EmailChangeEmail';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { logActivity } from '@/lib/activity-log';

type ActionResult = { success: true } | { success: false; error: string };

// ─── updateProfile ────────────────────────────────────────────────────────────

const profileSchema = z.object({
    name:      z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres.'),
    whatsapp:  z.string().trim().optional(),
    weight:    z.number().positive().max(500).nullable(),
    height:    z.number().int().positive().max(300).nullable(),
    avatarUrl: z.string().url().nullable(),
});

export async function updateProfile(data: {
    name: string;
    whatsapp: string;
    weight: number | null;
    height: number | null;
    avatarUrl: string | null;
}): Promise<ActionResult> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const parsed = profileSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const { name, whatsapp, weight, height, avatarUrl } = parsed.data;

    await prisma.user.update({
        where: { id: session.userId },
        data: {
            name,
            whatsapp:  whatsapp  || null,
            weight:    weight    ?? null,
            height:    height    ?? null,
            avatarUrl: avatarUrl ?? null,
        },
    });

    logActivity({
        userId: session.userId,
        action: 'PROFILE_UPDATE',
        resource: 'profile',
        metadata: {
            updatedFields: [
                name !== undefined && 'name',
                whatsapp !== undefined && 'whatsapp',
                weight  !== undefined && 'weight',
                height  !== undefined && 'height',
                avatarUrl !== undefined && 'avatarUrl',
            ].filter(Boolean),
        },
    }).catch(() => {});

    revalidatePath('/dashboard/perfil');
    revalidatePath('/dashboard');
    return { success: true };
}

// ─── requestEmailChange ───────────────────────────────────────────────────────

export async function requestEmailChange(newEmail: string): Promise<ActionResult> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const emailParsed = z.string().email('E-mail inválido.').safeParse(newEmail.trim());
    if (!emailParsed.success) {
        return { success: false, error: emailParsed.error.issues[0].message };
    }
    const email = emailParsed.data.toLowerCase();

    const currentUser = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { email: true, name: true },
    });
    if (!currentUser) return { success: false, error: 'Usuário não encontrado.' };
    if (currentUser.email.toLowerCase() === email) {
        return { success: false, error: 'Este já é o seu e-mail atual.' };
    }

    // Check if email is already in use
    const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });
    if (existing) {
        return { success: false, error: 'Este e-mail já está em uso por outra conta.' };
    }

    const code    = generateVerificationCode();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
        where: { id: session.userId },
        data: {
            pendingEmail:             email,
            emailChangeToken:         code,
            emailChangeTokenExpires:  expires,
        },
    });

    // Send verification email to the NEW address
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
        const resend = new Resend(apiKey);
        await resend.emails.send({
            from:    'O Ancestral <no-reply@oancestral.com.br>',
            to:      email,
            subject: 'Confirme seu novo e-mail no O Ancestral',
            react:   EmailChangeEmail({ code, name: currentUser.name, newEmail: email }),
        });
    }

    return { success: true };
}

// ─── confirmEmailChange ───────────────────────────────────────────────────────

export async function confirmEmailChange(code: string): Promise<ActionResult> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            pendingEmail:            true,
            emailChangeToken:        true,
            emailChangeTokenExpires: true,
        },
    });

    if (!user?.pendingEmail || !user.emailChangeToken) {
        return { success: false, error: 'Nenhuma alteração de e-mail pendente.' };
    }
    if (user.emailChangeToken !== code.trim()) {
        return { success: false, error: 'Código inválido.' };
    }
    if (user.emailChangeTokenExpires && user.emailChangeTokenExpires < new Date()) {
        return { success: false, error: 'Código expirado. Solicite um novo.' };
    }

    // Double-check the new email is still free (race condition guard)
    const taken = await prisma.user.findUnique({
        where: { email: user.pendingEmail },
        select: { id: true },
    });
    if (taken) {
        return { success: false, error: 'Este e-mail foi registrado por outra conta. Tente outro.' };
    }

    await prisma.user.update({
        where: { id: session.userId },
        data: {
            email:                   user.pendingEmail,
            emailVerified:           new Date(),
            pendingEmail:            null,
            emailChangeToken:        null,
            emailChangeTokenExpires: null,
        },
    });

    revalidatePath('/dashboard/perfil');
    return { success: true };
}

// ─── cancelEmailChange ────────────────────────────────────────────────────────

export async function cancelEmailChange(): Promise<void> {
    const session = await getSession();
    if (!session) return;

    await prisma.user.update({
        where: { id: session.userId },
        data: {
            pendingEmail:            null,
            emailChangeToken:        null,
            emailChangeTokenExpires: null,
        },
    });

    revalidatePath('/dashboard/perfil');
}
