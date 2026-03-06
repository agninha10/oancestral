import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getUserFromToken(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== 'ADMIN') return null;
        return payload.userId as string;
    } catch {
        return null;
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const userId = await getUserFromToken(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Nome é obrigatório' },
                { status: 400 }
            );
        }

        const slug = name
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');

        // Check if slug conflicts with another category
        const conflict = await prisma.category.findFirst({
            where: { slug, NOT: { id } },
        });
        if (conflict) {
            return NextResponse.json(
                { error: 'Já existe outra categoria com este nome' },
                { status: 409 }
            );
        }

        const category = await prisma.category.update({
            where: { id },
            data: { name, slug, description: description || null },
            include: { _count: { select: { blogPosts: true, recipes: true } } },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar categoria' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const userId = await getUserFromToken(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

        const category = await prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { blogPosts: true, recipes: true } } },
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Categoria não encontrada' },
                { status: 404 }
            );
        }

        const total = category._count.blogPosts + category._count.recipes;
        if (total > 0) {
            return NextResponse.json(
                {
                    error: `Esta categoria possui ${total} item(ns) vinculado(s). Remova-os antes de deletar.`,
                },
                { status: 422 }
            );
        }

        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { error: 'Erro ao deletar categoria' },
            { status: 500 }
        );
    }
}
