import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        const post = await prisma.blogPost.findUnique({
            where: { slug, published: true },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                content: true,
                coverImage: true,
                readTime: true,
                publishedAt: true,
                createdAt: true,
                tags: true,
                author: {
                    select: { name: true, avatarUrl: true },
                },
                category: {
                    select: { name: true },
                },
            },
        })

        if (!post) {
            return NextResponse.json(
                { success: false, error: 'Post não encontrado.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: {
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: post.content,
                coverImage: post.coverImage ?? null,
                readTime: post.readTime,
                publishedAt: post.publishedAt ?? post.createdAt,
                tags: post.tags,
                authorName: post.author.name ?? null,
                authorAvatar: post.author.avatarUrl ?? null,
                category: post.category?.name ?? null,
            },
        })
    } catch (error) {
        console.error('[mobile/posts/:slug] Erro:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor.' },
            { status: 500 }
        )
    }
}
