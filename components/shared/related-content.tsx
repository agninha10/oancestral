import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { RecipeCard } from '@/components/recipe/recipe-card';

// ─── Types ──────────────────────────────────────────────────────────────────

type Props = {
    currentId: string;
    /** categoryId from the DB (nullable — pass '' when absent) */
    category: string;
    type: 'post' | 'recipe';
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Maps a Category.slug like "low-carb" → "LOW_CARB" expected by the card components */
function toCategoryKey(slug?: string | null): string {
    if (!slug) return 'OTHER';
    return slug.toUpperCase().replace(/-/g, '_');
}

// ─── Data fetchers ───────────────────────────────────────────────────────────

async function fetchRelatedPosts(currentId: string, categoryId: string) {
    return prisma.blogPost.findMany({
        where: {
            published: true,
            NOT: { id: currentId },
            ...(categoryId ? { categoryId } : {}),
        },
        include: { category: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
    });
}

async function fetchRelatedRecipes(currentId: string, categoryId: string) {
    return prisma.recipe.findMany({
        where: {
            published: true,
            NOT: { id: currentId },
            ...(categoryId ? { categoryId } : {}),
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
    });
}

// ─── Main Component ──────────────────────────────────────────────────────────

export async function RelatedContent({ currentId, category, type }: Props) {
    if (type === 'post') {
        const posts = await fetchRelatedPosts(currentId, category);
        if (posts.length === 0) return null;

        return (
            <section className="container mx-auto max-w-6xl px-4 mt-16 border-t border-border/40 pt-12 pb-16">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-center">
                    Continue a sua jornada
                </h2>
                <p className="text-muted-foreground text-center mb-10">
                    Mais conteúdos para aprofundar o seu conhecimento ancestral
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <BlogPostCard
                            key={post.id}
                            post={{
                                id: post.id,
                                title: post.title,
                                slug: post.slug,
                                excerpt: post.excerpt,
                                coverImage: post.coverImage,
                                category: toCategoryKey(post.category?.slug),
                                readTime: post.readTime,
                                publishedAt: post.publishedAt,
                                createdAt: post.createdAt,
                                tags: post.tags,
                            }}
                        />
                    ))}
                </div>
            </section>
        );
    }

    // type === 'recipe'
    const recipes = await fetchRelatedRecipes(currentId, category);
    if (recipes.length === 0) return null;

    return (
        <section className="container mx-auto max-w-6xl px-4 mt-16 border-t border-border/40 pt-12 pb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-center">
                Pode também gostar de...
            </h2>
            <p className="text-muted-foreground text-center mb-10">
                Mais receitas ancestrais para a sua cozinha
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={{
                            id: recipe.id,
                            title: recipe.title,
                            slug: recipe.slug,
                            description: recipe.description,
                            coverImage: recipe.coverImage,
                            prepTime: recipe.prepTime,
                            cookTime: recipe.cookTime,
                            servings: recipe.servings,
                            difficulty: recipe.difficulty,
                            category: toCategoryKey(recipe.category?.slug),
                        }}
                    />
                ))}
            </div>
        </section>
    );
}

// ─── Skeleton (Suspense fallback) ────────────────────────────────────────────

export function RelatedContentSkeleton() {
    return (
        <section className="container mx-auto max-w-6xl px-4 mt-16 border-t border-border/40 pt-12 pb-16">
            <div className="h-9 w-72 rounded-lg bg-muted animate-pulse mx-auto mb-3" />
            <div className="h-5 w-80 rounded bg-muted animate-pulse mx-auto mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl border border-border overflow-hidden bg-card">
                        <div className="aspect-[16/9] bg-muted animate-pulse" />
                        <div className="p-5 space-y-3">
                            <div className="h-4 w-20 rounded-full bg-muted animate-pulse" />
                            <div className="h-6 w-full rounded bg-muted animate-pulse" />
                            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                            <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
