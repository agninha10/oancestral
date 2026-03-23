import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notifyGoogleIndex } from '@/lib/google-indexing';
import { broadcastNotification } from '@/app/actions/notifications';

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
            offerBanner,
            metaTitle,
            metaDescription,
            coverImageAlt,
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
                offerBanner: offerBanner ?? 'AUTO',
                publishedAt: published ? new Date() : null,
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null,
                coverImageAlt: coverImageAlt || null,
                authorId: user.id,
            },
        });

        console.log(`[Blog API] Post salvo no banco. Slug: ${post.slug} | Published: ${post.published}`);

        if (post.published) {
            const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`;
            await notifyGoogleIndex(postUrl);

            // Notify all users (non-blocking)
            broadcastNotification(
                `Novo artigo: ${post.title}`,
                post.excerpt ?? 'Um novo artigo foi publicado no blog.',
                `/blog/${post.slug}`,
                'POST',
            ).catch(() => {});
        } else {
            console.log(`[Blog API] Post salvo como Rascunho. O Google não será notificado.`);
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Erro ao criar post:', error);
        return NextResponse.json(
            { error: 'Erro ao criar post' },
            { status: 500 }
        );
    }
}
