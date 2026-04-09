import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function getAdminUser() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') return null;
    return { id: session.user.id };
}

export async function GET() {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    try {
        const ebooks = await prisma.ebook.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(ebooks);
    } catch (error) {
        console.error('Erro ao buscar ebooks:', error);
        return NextResponse.json({ error: 'Erro ao buscar ebooks' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    try {
        const body = await request.json();
        const {
            title, slug, subtitle, description, coverImage,
            pages, filename, access, price, kiwifyUrl,
            kiwifyProductId, buyHref, published, featured,
        } = body;

        const ebook = await prisma.ebook.create({
            data: {
                title,
                slug,
                subtitle: subtitle || null,
                description,
                coverImage: coverImage || null,
                pages: pages || null,
                filename: filename || null,
                access: access ?? 'PURCHASE',
                price: price || null,
                kiwifyUrl: kiwifyUrl || null,
                kiwifyProductId: kiwifyProductId || null,
                buyHref: buyHref || null,
                published: published ?? false,
                featured: featured ?? false,
            },
        });

        return NextResponse.json(ebook);
    } catch (error) {
        console.error('Erro ao criar ebook:', error);
        return NextResponse.json({ error: 'Erro ao criar ebook' }, { status: 500 });
    }
}
