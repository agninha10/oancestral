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
    slug: string
    title: string
    thumbnailUrl: string | null
    difficulty: string
    authorName: string | null
}

type PostCard = {
    id: string
    slug: string
    title: string
    thumbnailUrl: string | null
    excerpt: string
    readTime: number
    authorName: string | null
}

// Fisher-Yates shuffle — returns a new shuffled array
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function GET() {
    try {
        // Fetch pools in parallel.
        // Courses and recipes: fetch up to 50 then shuffle → pick 5.
        // Posts: 5 most recently published (deterministic, no shuffle).
        const [coursePool, recipePool, posts] = await Promise.all([
            // 1. Courses — fetch pool, will be shuffled below
            prisma.course.findMany({
                where: { published: true },
                select: {
                    id: true,
                    title: true,
                    coverImage: true,
                    isPremium: true,
                },
                take: 50,
            }),

            // 2. Recipes — fetch pool, will be shuffled below
            prisma.recipe.findMany({
                where: { published: true },
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    coverImage: true,
                    difficulty: true,
                    author: {
                        select: { name: true },
                    },
                },
                take: 50,
            }),

            // 3. Posts — 5 most recently published (no randomness)
            prisma.blogPost.findMany({
                where: { published: true },
                orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
                take: 5,
                select: {
                    id: true,
                    slug: true,
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

        // ── Shuffle pools and pick up to 5 ─────────────────────────────────────

        const courses = shuffle(coursePool).slice(0, 5)
        const recipes = shuffle(recipePool).slice(0, 5)

        // ── Map to clean card payloads ──────────────────────────────────────────

        const coursesRow: CourseCard[] = courses.map((c) => ({
            id: c.id,
            title: c.title,
            thumbnailUrl: c.coverImage ?? null,
            isPremium: c.isPremium,
        }))

        const recipesRow: RecipeCard[] = recipes.map((r) => ({
            id: r.id,
            slug: r.slug,
            title: r.title,
            thumbnailUrl: r.coverImage ?? null,
            difficulty: r.difficulty,
            authorName: r.author.name ?? null,
        }))

        const postsRow: PostCard[] = posts.map((p) => ({
            id: p.id,
            slug: p.slug,
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
