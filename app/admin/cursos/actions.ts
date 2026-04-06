'use server';

/**
 * app/admin/cursos/actions.ts
 * Server Actions para gestão de matrículas manuais (cortesias / parcerias).
 *
 * Segurança: toda action verifica role === ADMIN via JWT antes de agir.
 */

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// ─── Auth helper (mesmo padrão de app/admin/usuarios/actions.ts) ──────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActionResult<T = undefined> =
    | { success: true; data: T }
    | { success: false; error: string };

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const grantSchema = z.object({
    userEmail: z
        .string()
        .email('E-mail inválido')
        .transform((v) => v.trim().toLowerCase()),
    courseId: z.string().min(1, 'Selecione um curso'),
});

// ─── grantCourseAccess ────────────────────────────────────────────────────────

export type GrantData = {
    enrollmentId: string;
    userName: string | null;
    userEmail: string;
    courseTitle: string;
    alreadyHadAccess: boolean;
};

export async function grantCourseAccess(
    userEmail: string,
    courseId: string,
): Promise<ActionResult<GrantData>> {
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: 'Não autorizado' };

    // Validate inputs
    const parsed = grantSchema.safeParse({ userEmail, courseId });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }
    const { userEmail: email, courseId: cid } = parsed.data;

    // Look up target user
    const targetUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true },
    });
    if (!targetUser) {
        return {
            success: false,
            error: `Nenhum usuário encontrado com o e-mail "${email}". Verifique se ele já criou uma conta.`,
        };
    }

    // Look up course
    const course = await prisma.course.findUnique({
        where: { id: cid },
        select: { id: true, title: true, slug: true },
    });
    if (!course) {
        return { success: false, error: 'Curso não encontrado' };
    }

    // Upsert: if enrollment already exists, upgrade to MANUAL_FREE;
    // if it's already MANUAL_FREE, report it cleanly.
    const existing = await prisma.courseEnrollment.findUnique({
        where: { userId_courseId: { userId: targetUser.id, courseId: course.id } },
        select: { id: true, accessType: true },
    });

    if (existing?.accessType === 'MANUAL_FREE') {
        return {
            success: false,
            error: `"${targetUser.name}" já possui cortesia para "${course.title}".`,
        };
    }

    let enrollmentId: string;
    let alreadyHadAccess = false;

    if (existing) {
        // Upgrade existing enrollment (e.g. was SUBSCRIPTION, now marking as MANUAL_FREE)
        const updated = await prisma.courseEnrollment.update({
            where: { id: existing.id },
            data: { accessType: 'MANUAL_FREE', grantedById: admin.id },
        });
        enrollmentId = updated.id;
        alreadyHadAccess = true;
    } else {
        // Create new enrollment
        const created = await prisma.courseEnrollment.create({
            data: {
                userId: targetUser.id,
                courseId: course.id,
                accessType: 'MANUAL_FREE',
                grantedById: admin.id,
            },
        });
        enrollmentId = created.id;
    }

    revalidatePath('/admin/cortesias');
    revalidatePath('/dashboard');
    revalidatePath(`/cursos/${course.slug}`);

    return {
        success: true,
        data: {
            enrollmentId,
            userName: targetUser.name,
            userEmail: targetUser.email,
            courseTitle: course.title,
            alreadyHadAccess,
        },
    };
}

// ─── revokeCourseAccess ───────────────────────────────────────────────────────

export async function revokeCourseAccess(
    enrollmentId: string,
): Promise<ActionResult> {
    const admin = await getAdminUser();
    if (!admin) return { success: false, error: 'Não autorizado' };

    const enrollment = await prisma.courseEnrollment.findUnique({
        where: { id: enrollmentId },
        select: {
            id: true,
            accessType: true,
            course: { select: { slug: true } },
        },
    });

    if (!enrollment) {
        return { success: false, error: 'Matrícula não encontrada' };
    }

    if (enrollment.accessType !== 'MANUAL_FREE') {
        return {
            success: false,
            error: 'Só é possível revogar acessos concedidos manualmente (MANUAL_FREE).',
        };
    }

    await prisma.courseEnrollment.delete({ where: { id: enrollmentId } });

    revalidatePath('/admin/cortesias');
    revalidatePath('/dashboard');
    revalidatePath(`/cursos/${enrollment.course.slug}`);

    return { success: true, data: undefined };
}
