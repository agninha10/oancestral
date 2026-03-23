import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const PAGE_SIZE = 10

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    // cursor = id do último item recebido (scroll infinito cursor-based)
    const cursor = searchParams.get('cursor') ?? undefined

    try {
        const courses = await prisma.course.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            take: PAGE_SIZE + 1, // busca 1 a mais para saber se há próxima página
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                coverImage: true,
                isPremium: true,
                price: true,
                featured: true,
                createdAt: true,
                _count: {
                    select: { modules: true },
                },
            },
        })

        const hasNextPage = courses.length > PAGE_SIZE
        const items = hasNextPage ? courses.slice(0, PAGE_SIZE) : courses
        const nextCursor = hasNextPage ? items[items.length - 1].id : null

        return NextResponse.json({
            success: true,
            data: {
                courses: items.map((c) => ({
                    id: c.id,
                    slug: c.slug,
                    title: c.title,
                    description: c.description,
                    thumbnailUrl: c.coverImage ?? null,
                    isPremium: c.isPremium,
                    price: c.price ?? null,
                    featured: c.featured,
                    moduleCount: c._count.modules,
                    createdAt: c.createdAt,
                })),
                pagination: {
                    nextCursor,
                    hasNextPage,
                },
            },
        })
    } catch (error) {
        console.error('[mobile/courses]', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor.' },
            { status: 500 },
        )
    }
}
