import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function getAdminUser() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') return null;
    return { id: session.user.id };
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
        const { title, slug, description, coverImage, isPremium, membersOnly, published, metaTitle, metaDescription, ogImage, price, kiwifyUrl, kiwifyProductId, waitlistEnabled } = body;

        const course = await prisma.course.update({
            where: { id },
            data: {
                title,
                slug,
                description,
                coverImage: coverImage || null,
                isPremium,
                membersOnly: membersOnly ?? false,
                published,
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null,
                ogImage: ogImage || null,
                price: price || null,
                kiwifyUrl: kiwifyUrl || null,
                kiwifyProductId: kiwifyProductId || null,
                waitlistEnabled: waitlistEnabled ?? false,
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
