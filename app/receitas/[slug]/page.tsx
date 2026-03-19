import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { RecipeJsonLd } from '@/lib/seo/RecipeJsonLd';
import { ReadingProgressBar } from '@/components/content/reading-progress-bar';
import { CookingModeButton } from '@/components/recipe/cooking-mode-button';
import { NewsletterBox } from '@/components/newsletter/newsletter-box';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { RecipePaywallWrapper } from '@/components/recipe/recipe-paywall-wrapper';
import { Clock, Users, ChefHat } from 'lucide-react';
import { Suspense } from 'react';
import { RelatedContent, RelatedContentSkeleton } from '@/components/shared/related-content';
import { LivroPromoBanner } from '@/components/promo/livro-promo-banner';
import { ShareButtons } from '@/components/ui/share-buttons';

type Props = {
    params: Promise<{ slug: string }>;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Canonical production base URL.
 * Only uses NEXT_PUBLIC_APP_URL when it's an HTTPS URL (i.e. production).
 * Falls back to the hardcoded production domain so that local `.env`
 * values like "http://localhost:3000" never pollute the og:image tags
 * that WhatsApp / Facebook crawlers receive.
 */
const SITE_URL = (() => {
    const env = process.env.NEXT_PUBLIC_APP_URL ?? '';
    return env.startsWith('https://') ? env.replace(/\/$/, '') : 'https://oancestral.com.br';
})();

/**
 * Always returns an absolute HTTPS URL suitable for og:image.
 * - Already-absolute URLs (Cloudinary, etc.) → kept as-is
 * - Relative paths → prepended with SITE_URL
 * - null / undefined   → fallback OG image
 */
function resolveOgImage(coverImage: string | null | undefined): string {
    const fallback = `${SITE_URL}/images/og-receitas.png`;
    if (!coverImage) return fallback;
    if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) return coverImage;
    return `${SITE_URL}${coverImage.startsWith('/') ? '' : '/'}${coverImage}`;
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const recipe = await prisma.recipe.findFirst({
        where: { slug, published: true },
    });

    if (!recipe) {
        return { title: 'Receita não encontrada' };
    }

    const title       = recipe.metaTitle       || recipe.title;
    const description = recipe.metaDescription || recipe.description;
    const canonical   = `${SITE_URL}/receitas/${slug}`;

    // Dynamic OG image with food photo + star overlay from our route handler.
    // Always absolute — the #1 cause of broken previews on WhatsApp & Facebook.
    const ogImageUrl = `${SITE_URL}/api/og/receitas/${slug}`;

    const ogTitle = `${title} | Receitas Ancestrais — O Ancestral`;

    return {
        // Declared explicitly here so dynamic routes never inherit a stale or
        // localhost value from the root layout's process.env read.
        metadataBase: new URL(SITE_URL),

        title:       recipe.title, // template → "Nome da Receita | O Ancestral"
        description,
        authors:     [{ name: 'O Ancestral' }],
        alternates:  { canonical },

        openGraph: {
            title:    ogTitle,
            description,
            type:     'article',
            url:      canonical,
            locale:   'pt_BR',
            siteName: 'O Ancestral',
            images: [{
                url:    ogImageUrl,
                width:  1200,
                height: 630,
                alt:    recipe.coverImageAlt || recipe.title,
            }],
            publishedTime: recipe.createdAt.toISOString(),
            modifiedTime:  recipe.updatedAt.toISOString(),
        },

        twitter: {
            card:        'summary_large_image',
            site:        '@oancestral',
            creator:     '@oancestral',
            title:       `${title} | Receitas Ancestrais`,
            description,
            images:      [ogImageUrl],
        },
    };
}

const difficultyLabels = {
    EASY: 'Fácil',
    MEDIUM: 'Médio',
    HARD: 'Difícil',
};

export default async function RecipePage({ params }: Props) {
    const { slug } = await params;
    const recipe = await prisma.recipe.findFirst({
        where: {
            slug,
            published: true,
        },
        include: {
            category: true,
            author: {
                select: {
                    name: true,
                },
            },
            ingredients: {
                orderBy: {
                    order: 'asc',
                },
            },
            instructions: {
                orderBy: {
                    step: 'asc',
                },
            },
        },
    });

    if (!recipe) {
        notFound();
    }

    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
    const macros = recipe.macronutrients as { protein?: number; fat?: number; carbs?: number } | null;

    // Reuse the same SITE_URL constant defined above — keeps JSON-LD consistent
    // with the og:image URLs generated in generateMetadata.
    const baseUrl = SITE_URL;

    // Get user subscription status for paywall
    let userSubscriptionStatus: 'FREE' | 'ACTIVE' = 'FREE';
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
            const { payload } = await jwtVerify(token, secret);
            const userId = payload.userId as string;

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { subscriptionStatus: true },
            });

            if (user?.subscriptionStatus === 'ACTIVE') {
                userSubscriptionStatus = 'ACTIVE';
            }
        } catch {
            // Invalid token, user remains FREE
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <RecipeJsonLd recipe={recipe} baseUrl={baseUrl} />
            <ReadingProgressBar />
            <CookingModeButton />

            <main className="flex-1">
                <article className="bg-background">
                    {/* Hero Section */}
                    <section className="relative h-[60vh] min-h-[400px] max-h-[600px]">
                        {recipe.coverImage ? (
                            <Image
                                src={recipe.coverImage}
                                alt={recipe.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-900/20 to-neutral-900" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center gap-3 mb-4">
                                    {recipe.category && (
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                            {recipe.category.name}
                                        </span>
                                    )}
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300">
                                        {difficultyLabels[recipe.difficulty]}
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-white mb-4">
                                    {recipe.title}
                                </h1>

                                <p className="text-lg text-neutral-300 mb-6">
                                    {recipe.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400">
                                    {totalTime > 0 && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5" />
                                            <span>{totalTime} minutos</span>
                                        </div>
                                    )}
                                    {recipe.servings && (
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5" />
                                            <span>{recipe.servings} porções</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <ChefHat className="w-5 h-5" />
                                        <span>{recipe.author.name}</span>
                                    </div>
                                </div>

                                {/* Share buttons — abaixo dos metadados da receita */}
                                <div className="mt-6 pt-6 border-t border-neutral-700/50">
                                    <ShareButtons
                                        title={recipe.title}
                                        description={recipe.description}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Content */}
                    <section className="max-w-4xl mx-auto px-4 py-12">
                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-12">
                                <RecipePaywallWrapper
                                    isPremium={recipe.isPremium}
                                    userSubscriptionStatus={userSubscriptionStatus}
                                >
                                    {/* Ingredients */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-6">Ingredientes</h2>
                                        <ul className="space-y-3">
                                            {recipe.ingredients.map((ingredient) => (
                                                <li
                                                    key={ingredient.id}
                                                    className="flex items-start gap-3 text-muted-foreground"
                                                >
                                                    <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                                                    <span>
                                                        <strong className="text-foreground">{ingredient.amount}</strong> {ingredient.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Instructions */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-6">Modo de Preparo</h2>
                                        <ol className="space-y-6">
                                            {recipe.instructions.map((instruction) => (
                                                <li key={instruction.id} className="flex gap-4">
                                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 font-bold flex items-center justify-center text-sm">
                                                        {instruction.step}
                                                    </span>
                                                    <p className="text-muted-foreground pt-1">{instruction.content}</p>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </RecipePaywallWrapper>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 space-y-6">
                                    {/* Nutrition Info */}
                                    {(recipe.calories || macros) && (
                                        <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                                            <h3 className="text-lg font-bold text-foreground mb-4">Informação Nutricional</h3>
                                            <div className="space-y-3 text-sm">
                                                {recipe.calories && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Calorias</span>
                                                        <span className="text-foreground font-semibold">{recipe.calories} kcal</span>
                                                    </div>
                                                )}
                                                {macros?.protein && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Proteína</span>
                                                        <span className="text-foreground font-semibold">{macros.protein}g</span>
                                                    </div>
                                                )}
                                                {macros?.fat && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Gordura</span>
                                                        <span className="text-foreground font-semibold">{macros.fat}g</span>
                                                    </div>
                                                )}
                                                {macros?.carbs && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Carboidratos</span>
                                                        <span className="text-foreground font-semibold">{macros.carbs}g</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Livro promo — sidebar */}
                                    <LivroPromoBanner variant="sidebar" />
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="mt-16">
                            <NewsletterBox
                                source="RECIPE_POPUP"
                                title="Gostou da receita?"
                                description="Receba mais receitas ancestrais direto no seu email. Sem spam, só nutrição."
                            />
                        </div>
                    </section>
                </article>
            </main>

            <Suspense fallback={<RelatedContentSkeleton />}>
                <RelatedContent
                    currentId={recipe.id}
                    category={recipe.categoryId ?? ''}
                    type="recipe"
                />
            </Suspense>

            <Footer />
        </div>
    );
}
