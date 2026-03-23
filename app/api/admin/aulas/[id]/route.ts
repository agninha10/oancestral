import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function getAdminUser() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') return null;
    return { id: session.user.id };
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { title, slug, videoUrl, thumbnailUrl, content, order, isFree } = body;

        const lesson = await prisma.lesson.update({
            where: { id },
            data: {
                title,
                slug,
                videoUrl: videoUrl || null,
                thumbnailUrl: thumbnailUrl || null,
                content: content || null,
                order,
                isFree,
            },
        });

        return NextResponse.json(lesson);
    } catch (error) {
        console.error('Erro ao atualizar aula:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar aula' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const { id } = await params;

        await prisma.lesson.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir aula:', error);
        return NextResponse.json(
            { error: 'Erro ao excluir aula' },
            { status: 500 }
        );
    }
}
