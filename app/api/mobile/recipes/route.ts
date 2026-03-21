import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Cursor-based pagination with optional search by title.
//
// Usage:
//   GET /api/mobile/recipes                      → first page
//   GET /api/mobile/recipes?cursor=xxx           → next page
//   GET /api/mobile/recipes?search=frango        → search, first page
//   GET /api/mobile/recipes?search=frango&cursor=xxx → search, next page

const PAGE_SIZE = 10

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const cursor = searchParams.get('cursor') ?? undefined
        const search = searchParams.get('search')?.trim() ?? undefined

        const where = {
            published: true,
            ...(search && {
                title: { contains: search, mode: 'insensitive' as const },
            }),
        }

        const recipes = await prisma.recipe.findMany({
            where,
            orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
            take: PAGE_SIZE + 1,
            ...(cursor && {
                cursor: { id: cursor },
                skip: 1,
            }),
            select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                coverImage: true,
                prepTime: true,
                cookTime: true,
                servings: true,
                difficulty: true,
                tags: true,
                author: {
                    select: { name: true, avatarUrl: true },
                },
                category: {
                    select: { name: true },
                },
            },
        })

        const hasMore = recipes.length > PAGE_SIZE
        const page = hasMore ? recipes.slice(0, PAGE_SIZE) : recipes
        const nextCursor = hasMore ? page[page.length - 1].id : null

        return NextResponse.json({
            success: true,
            data: page.map((r) => ({
                id: r.id,
                slug: r.slug,
                title: r.title,
                description: r.description,
                coverImage: r.coverImage ?? null,
                prepTime: r.prepTime ?? null,
                cookTime: r.cookTime ?? null,
                servings: r.servings ?? null,
                difficulty: r.difficulty,
                tags: r.tags,
                authorName: r.author.name ?? null,
                authorAvatar: r.author.avatarUrl ?? null,
                category: r.category?.name ?? null,
            })),
            pagination: {
                nextCursor,
                hasMore,
            },
        })
    } catch (error) {
        console.error('[mobile/recipes] Erro:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor.' },
            { status: 500 }
        )
    }
}
