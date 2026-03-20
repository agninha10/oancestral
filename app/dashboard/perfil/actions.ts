'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { generateVerificationCode } from '@/lib/auth/email';
import { Resend } from 'resend';
import EmailChangeEmail from '@/emails/EmailChangeEmail';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { logActivity } from '@/lib/activity-log';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

type ActionResult = { success: true } | { success: false; error: string };

// ─── updateProfile ────────────────────────────────────────────────────────────

const profileSchema = z.object({
    name:          z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres.'),
    whatsapp:      z.string().trim().optional(),
    weight:        z.number().positive().max(500).nullable(),
    height:        z.number().int().positive().max(300).nullable(),
    avatarUrl:     z.string().url().nullable(),
    bio:           z.string().trim().max(300, 'Bio deve ter no máximo 300 caracteres.').optional(),
    instagram:     z.string().trim().max(100).optional(),
    twitter:       z.string().trim().max(100).optional(),
    youtube:       z.string().trim().max(200).optional(),
    tiktok:        z.string().trim().max(100).optional(),
    linkedin:      z.string().trim().max(200).optional(),
    website:       z.string().trim().max(200).optional(),
    profilePublic: z.boolean().optional(),
});

export async function updateProfile(data: {
    name: string;
    whatsapp: string;
    weight: number | null;
    height: number | null;
    avatarUrl: string | null;
    bio?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
    website?: string;
    profilePublic?: boolean;
}): Promise<ActionResult> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const parsed = profileSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const { name, whatsapp, weight, height, avatarUrl, bio, instagram, twitter, youtube, tiktok, linkedin, website, profilePublic } = parsed.data;

    await prisma.user.update({
        where: { id: session.userId },
        data: {
            name,
            whatsapp:      whatsapp  || null,
            weight:        weight    ?? null,
            height:        height    ?? null,
            avatarUrl:     avatarUrl ?? null,
            bio:           bio           !== undefined ? (bio || null)       : undefined,
            instagram:     instagram     !== undefined ? (instagram || null) : undefined,
            twitter:       twitter       !== undefined ? (twitter || null)   : undefined,
            youtube:       youtube       !== undefined ? (youtube || null)   : undefined,
            tiktok:        tiktok        !== undefined ? (tiktok || null)    : undefined,
            linkedin:      linkedin      !== undefined ? (linkedin || null)  : undefined,
            website:       website       !== undefined ? (website || null)   : undefined,
            profilePublic: profilePublic !== undefined ? profilePublic       : undefined,
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

// ─── changePassword ───────────────────────────────────────────────────────────

export async function changePassword(data: {
    currentPassword: string;
    newPassword: string;
}): Promise<ActionResult> {
    const session = await getSession();
    if (!session) return { success: false, error: 'Não autorizado.' };

    const schema = z.object({
        currentPassword: z.string().min(1, 'Informe a senha atual.'),
        newPassword: z.string().min(8, 'A nova senha deve ter pelo menos 8 caracteres.'),
    });
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { password: true },
    });
    if (!user) return { success: false, error: 'Usuário não encontrado.' };

    const valid = await verifyPassword(parsed.data.currentPassword, user.password);
    if (!valid) return { success: false, error: 'Senha atual incorreta.' };

    const newHash = await hashPassword(parsed.data.newPassword);
    await prisma.user.update({
        where: { id: session.userId },
        data: { password: newHash },
    });

    logActivity({
        userId: session.userId,
        action: 'PROFILE_UPDATE',
        resource: 'password',
        metadata: { updatedFields: ['password'] },
    }).catch(() => {});

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
