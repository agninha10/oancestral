import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

function slugify(str: string) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const categories = await prisma.forumCategory.findMany({
        orderBy: { order: 'asc' },
        include: { _count: { select: { posts: true } } },
    });

    return NextResponse.json(categories);
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { name, description, icon, order } = await req.json();

    if (!name?.trim()) {
        return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const slug = slugify(name.trim());

    const existing = await prisma.forumCategory.findUnique({ where: { slug } });
    if (existing) {
        return NextResponse.json({ error: 'Já existe uma categoria com esse nome' }, { status: 409 });
    }

    const maxOrder = await prisma.forumCategory.aggregate({ _max: { order: true } });

    const category = await prisma.forumCategory.create({
        data: {
            name: name.trim(),
            slug,
            description: description?.trim() || '',
            icon: icon?.trim() || '💬',
            order: order ?? (maxOrder._max.order ?? -1) + 1,
        },
        include: { _count: { select: { posts: true } } },
    });

    return NextResponse.json(category, { status: 201 });
}
