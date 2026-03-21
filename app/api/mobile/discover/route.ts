import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ─── Response shape types ──────────────────────────────────────────────────────

type CourseCard = {
    id: string
    title: string
    thumbnailUrl: string | null
    isPremium: boolean
}

type RecipeCard = {
    id: string
    title: string
    thumbnailUrl: string | null
    difficulty: string
    authorName: string | null
}

type PostCard = {
    id: string
    title: string
    thumbnailUrl: string | null
    excerpt: string
    readTime: number
    authorName: string | null
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function GET() {
    try {
        // All four queries run in parallel — total latency = slowest single query
        const [courses, recipes, posts] = await Promise.all([
            // 1. Courses — featured first, then newest
            prisma.course.findMany({
                where: { published: true },
                orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
                take: 8,
                select: {
                    id: true,
                    title: true,
                    coverImage: true,
                    isPremium: true,
                },
            }),

            // 2. Recipes — featured first, then newest
            prisma.recipe.findMany({
                where: { published: true },
                orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
                take: 10,
                select: {
                    id: true,
                    title: true,
                    coverImage: true,
                    difficulty: true,
                    author: {
                        select: { name: true },
                    },
                },
            }),

            // 3. Blog posts — featured first, then most recently published
            prisma.blogPost.findMany({
                where: { published: true },
                orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
                take: 10,
                select: {
                    id: true,
                    title: true,
                    coverImage: true,
                    excerpt: true,
                    readTime: true,
                    author: {
                        select: { name: true },
                    },
                },
            }),
        ])

        // ── Map to clean card payloads ──────────────────────────────────────────

        const coursesRow: CourseCard[] = courses.map((c) => ({
            id: c.id,
            title: c.title,
            thumbnailUrl: c.coverImage ?? null,
            isPremium: c.isPremium,
        }))

        const recipesRow: RecipeCard[] = recipes.map((r) => ({
            id: r.id,
            title: r.title,
            thumbnailUrl: r.coverImage ?? null,
            difficulty: r.difficulty,
            authorName: r.author.name ?? null,
        }))

        const postsRow: PostCard[] = posts.map((p) => ({
            id: p.id,
            title: p.title,
            thumbnailUrl: p.coverImage ?? null,
            excerpt: p.excerpt,
            readTime: p.readTime,
            authorName: p.author.name ?? null,
        }))

        return NextResponse.json({
            success: true,
            data: {
                coursesRow,
                // NOTE: No Ebook model exists in the schema yet.
                // This row is intentionally empty, ready for future expansion.
                ebooksRow: [],
                recipesRow,
                postsRow,
            },
        })
    } catch (error) {
        console.error('[mobile/discover] Erro:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor.' },
            { status: 500 }
        )
    }
}
