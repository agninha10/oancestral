import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { name, description, icon, order } = await req.json();

    if (!name?.trim()) {
        return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const category = await prisma.forumCategory.update({
        where: { id },
        data: {
            name: name.trim(),
            description: description?.trim() ?? '',
            icon: icon?.trim() || '💬',
            ...(order !== undefined && { order: Number(order) }),
        },
        include: { _count: { select: { posts: true } } },
    });

    return NextResponse.json(category);
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const count = await prisma.forumPost.count({ where: { categoryId: id } });
    if (count > 0) {
        return NextResponse.json(
            { error: `Esta categoria possui ${count} post(s) e não pode ser deletada.` },
            { status: 409 }
        );
    }

    await prisma.forumCategory.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
}
