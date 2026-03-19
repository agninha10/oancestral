import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const { name, email } = await request.json();

        if (!name?.trim() || !email?.trim()) {
            return NextResponse.json({ error: 'Nome e e-mail são obrigatórios' }, { status: 400 });
        }

        const emailNormalized = email.trim().toLowerCase();

        const course = await prisma.course.findUnique({
            where: { slug },
            select: { id: true, waitlistEnabled: true },
        });

        if (!course) {
            return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 });
        }

        if (!course.waitlistEnabled) {
            return NextResponse.json({ error: 'Lista de espera não disponível' }, { status: 403 });
        }

        await prisma.courseWaitlist.upsert({
            where: { courseId_email: { courseId: course.id, email: emailNormalized } },
            update: { name: name.trim() },
            create: { courseId: course.id, name: name.trim(), email: emailNormalized },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao entrar na lista de espera:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
