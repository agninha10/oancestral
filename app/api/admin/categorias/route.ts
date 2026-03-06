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

export async function GET(request: NextRequest) {
    try {
        const userId = await getUserFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        if (!prisma.category) {
            console.error('Prisma Category model not found');
            return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
        }

        const categories = await prisma.category.findMany({
            where: type ? { type: type as any } : undefined,
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { blogPosts: true, recipes: true },
                },
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = await getUserFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, type, description } = body;

        if (!name || !type) {
            return NextResponse.json(
                { error: 'Nome e tipo são obrigatórios' },
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

        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json(
                { error: 'Já existe uma categoria com este nome' },
                { status: 409 }
            );
        }

        const category = await prisma.category.create({
            data: { name, slug, type, description: description || null },
            include: { _count: { select: { blogPosts: true, recipes: true } } },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: 'Erro ao criar categoria' },
            { status: 500 }
        );
    }
}
