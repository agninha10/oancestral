import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function getAdminUser() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') return null;
    return { id: session.user.id };
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { id } = await params;
    const ebook = await prisma.ebook.findUnique({ where: { id } });

    if (!ebook) return NextResponse.json({ error: 'Ebook não encontrado' }, { status: 404 });

    return NextResponse.json(ebook);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const {
        title, slug, subtitle, description, coverImage,
        pages, filename, access, price, kiwifyUrl,
        kiwifyProductId, buyHref, published, featured,
    } = body;

    try {
        const ebook = await prisma.ebook.update({
            where: { id },
            data: {
                title,
                slug,
                subtitle: subtitle || null,
                description,
                coverImage: coverImage || null,
                pages: pages || null,
                filename: filename || null,
                access,
                price: price || null,
                kiwifyUrl: kiwifyUrl || null,
                kiwifyProductId: kiwifyProductId || null,
                buyHref: buyHref || null,
                published,
                featured,
            },
        });
        return NextResponse.json(ebook);
    } catch (error) {
        console.error('Erro ao atualizar ebook:', error);
        return NextResponse.json({ error: 'Erro ao atualizar ebook' }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { id } = await params;
    await prisma.ebook.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
