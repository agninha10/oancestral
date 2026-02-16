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
        return null;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const { id } = await params;

        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                modules: {
                    orderBy: { order: 'asc' },
                    include: {
                        _count: {
                            select: { lessons: true },
                        },
                    },
                },
            },
        });

        if (!course) {
            return NextResponse.json(
                { error: 'Curso não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(course);
    } catch (error) {
        console.error('Erro ao buscar curso:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar curso' },
            { status: 500 }
        );
    }
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
        const { title, slug, description, coverImage, isPremium, published } = body;

        const course = await prisma.course.update({
            where: { id },
            data: {
                title,
                slug,
                description,
                coverImage: coverImage || null,
                isPremium,
                published,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error('Erro ao atualizar curso:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar curso' },
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

        await prisma.course.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir curso:', error);
        return NextResponse.json(
            { error: 'Erro ao excluir curso' },
            { status: 500 }
        );
    }
}
