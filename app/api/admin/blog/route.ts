import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

async function getAdminUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');

        if (!token) {
            return null;
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { id: true, role: true },
        });

        if (user?.role !== 'ADMIN') {
            return null;
        }

        return user;
    } catch (error) {
        console.log('Error in getAdminUser:', error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { name: true },
                },
                category: {
                    select: { name: true },
                },
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar posts' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            title,
            slug,
            excerpt,
            content,
            coverImage,
            categoryId,
            tags,
            readTime,
            published,
            featured,
            isPremium,
        } = body;

        if (!title || !slug || !excerpt || !content || !readTime) {
            return NextResponse.json(
                { error: 'Campos obrigatórios ausentes' },
                { status: 400 }
            );
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                coverImage: coverImage || null,
                categoryId: categoryId || null,
                tags: Array.isArray(tags) ? tags : [],
                readTime: Number(readTime),
                published: published ?? false,
                featured: featured ?? false,
                isPremium: isPremium ?? false,
                publishedAt: published ? new Date() : null,
                authorId: user.id,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Erro ao criar post:', error);
        return NextResponse.json(
            { error: 'Erro ao criar post' },
            { status: 500 }
        );
    }
}
