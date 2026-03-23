import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function getAdminUser() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') return null;
    return { id: session.user.id };
}

export async function GET(request: NextRequest) {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { modules: true },
                },
            },
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar cursos' },
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
        const { title, slug, description, coverImage, isPremium, published, metaTitle, metaDescription, ogImage, price, kiwifyUrl, kiwifyProductId, waitlistEnabled } = body;

        const course = await prisma.course.create({
            data: {
                title,
                slug,
                description,
                coverImage: coverImage || null,
                isPremium: isPremium ?? true,
                published: published ?? false,
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
        console.error('Erro ao criar curso:', error);
        return NextResponse.json(
            { error: 'Erro ao criar curso' },
            { status: 500 }
        );
    }
}
