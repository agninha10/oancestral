import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Cursor-based pagination — ideal for infinite scroll.
// Each response includes a `nextCursor` that the client sends on the next request.
//
// Usage:
//   GET /api/mobile/posts             → first page
//   GET /api/mobile/posts?cursor=xxx  → next page

const PAGE_SIZE = 10

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const cursor = searchParams.get('cursor') ?? undefined

        const posts = await prisma.blogPost.findMany({
            where: { published: true },
            orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
            // Fetch one extra to know if there are more pages
            take: PAGE_SIZE + 1,
            // When a cursor is provided, start after that record
            ...(cursor && {
                cursor: { id: cursor },
                skip: 1,
            }),
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
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

        const hasMore = posts.length > PAGE_SIZE
        const page = hasMore ? posts.slice(0, PAGE_SIZE) : posts
        const nextCursor = hasMore ? page[page.length - 1].id : null

        return NextResponse.json({
            success: true,
            data: page.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt,
                coverImage: p.coverImage ?? null,
                readTime: p.readTime,
                publishedAt: p.publishedAt ?? p.createdAt,
                tags: p.tags,
                authorName: p.author.name ?? null,
                authorAvatar: p.author.avatarUrl ?? null,
                category: p.category?.name ?? null,
            })),
            pagination: {
                nextCursor,
                hasMore,
            },
        })
    } catch (error) {
        console.error('[mobile/posts] Erro:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor.' },
            { status: 500 }
        )
    }
}
