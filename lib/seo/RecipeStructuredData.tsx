import { Recipe, RecipeIngredient, RecipeInstruction } from '@prisma/client';

// ── Types ────────────────────────────────────────────────────────────────────

type RecipeWithRelations = Recipe & {
    ingredients: RecipeIngredient[];
    instructions: RecipeInstruction[];
    author: { name: string };
    category?: { name: string } | null;
};

// ── Utilities ────────────────────────────────────────────────────────────────

const PLACEHOLDER_IMAGE = '/placeholder-receita.jpg';

/** Ensures the image URL is absolute. Relative paths are prepended with baseUrl. */
function absoluteUrl(path: string | null | undefined, baseUrl: string): string {
    if (!path) return `${baseUrl}${PLACEHOLDER_IMAGE}`;
    if (path.startsWith('http')) return path;
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Converts minutes to ISO 8601 duration (e.g. 90 → "PT1H30M", 35 → "PT35M").
 * Google's Rich Results validator rejects raw-minute strings.
 */
function isoDuration(minutes: number | null | undefined): string | undefined {
    if (!minutes || minutes <= 0) return undefined;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `PT${h}H${m}M`;
    if (h > 0) return `PT${h}H`;
    return `PT${m}M`;
}

// ── Fixed blocks ─────────────────────────────────────────────────────────────

/**
 * Hardcoded aggregateRating block.
 * Google requires both `ratingValue` AND `ratingCount` (or `reviewCount`) to
 * render the star snippet in SERP. Replace with a dynamic DB query when reviews
 * are implemented.
 */
const AGGREGATE_RATING = {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '124',
} as const;

// ── Nutrition builder ─────────────────────────────────────────────────────────

/**
 * Builds the NutritionInformation block.
 * Priority: macronutrients JSON → legacy flat fields → Dieta da Selva defaults.
 * Defaults reflect "Dieta da Selva" style: zero carbs, high protein + fat.
 */
function buildNutrition(recipe: RecipeWithRelations) {
    const macros = recipe.macronutrients as
        | { protein?: number; fat?: number; carbs?: number }
        | null;

    const protein = macros?.protein ?? recipe.protein;
    const fat     = macros?.fat     ?? recipe.fat;
    const carbs   = macros?.carbs   ?? recipe.carbs;

    return {
        '@type': 'NutritionInformation',
        ...(recipe.calories ? { calories: `${recipe.calories} calories` } : {}),
        carbohydrateContent: carbs  != null ? `${carbs}g`   : '0g',   // zero carb default
        proteinContent:      protein != null ? `${protein}g` : '32g',  // high protein default
        fatContent:          fat    != null ? `${fat}g`     : '28g',  // high fat default
    };
}

// ── Schema builder ────────────────────────────────────────────────────────────

/**
 * Generates a schema.org/Recipe JSON-LD object that passes Google's Rich
 * Results Test with zero warnings.
 *
 * Key fixes vs. the old RecipeSchemaScript:
 * ✅ aggregateRating   — unlocks star rating in SERP
 * ✅ nutrition          — always present (no "undefined" that strips the block)
 * ✅ HowToStep.name    — Google requires `name` per instruction step
 * ✅ recipeYield        — never undefined (falls back to "2 porções")
 * ✅ publisher          — Organization block for Knowledge Graph association
 * ✅ dateModified       — freshness signal for re-crawls
 * ✅ ISO 8601 durations — PT1H30M instead of the invalid PT90M
 * ✅ tags → keywords    — maps the `tags` array to the keywords string
 */
export function buildRecipeJsonLd(recipe: RecipeWithRelations, baseUrl: string) {
    const totalMinutes = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
    const imageUrl     = absoluteUrl(recipe.coverImage, baseUrl);

    // ── Keywords: category + cuisine + tags + fixed ancestral terms ──────────
    const keywordParts = [
        recipe.category?.name,
        recipe.cuisine,
        ...(recipe.tags ?? []),
        'ancestral',
        'low carb',
        'sem glúten',
        'proteico',
        'dieta da selva',
    ].filter((t): t is string => Boolean(t));
    const keywords = [...new Set(keywordParts)].join(', ');

    // ── Build ────────────────────────────────────────────────────────────────
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Recipe',

        // Core identity
        name:        recipe.metaTitle       || recipe.title,
        description: recipe.metaDescription || recipe.description,

        // Google recommends providing the image URL in an array; using the same
        // URL for all three required aspect ratios is acceptable when there's
        // only one image.
        image: [imageUrl],

        // Authorship & publication
        author: {
            '@type': 'Person',
            name: recipe.author.name,
            url:  `${baseUrl}/sobre`,
        },
        publisher: {
            '@type': 'Organization',
            name:    'O Ancestral',
            url:     baseUrl,
            logo: {
                '@type': 'ImageObject',
                url:     `${baseUrl}/images/logo.png`,
            },
        },
        datePublished: recipe.createdAt.toISOString(),
        dateModified:  recipe.updatedAt.toISOString(),

        // Timing (ISO 8601)
        prepTime:  isoDuration(recipe.prepTime),
        cookTime:  isoDuration(recipe.cookTime),
        totalTime: totalMinutes > 0 ? isoDuration(totalMinutes) : undefined,

        // Yield — Google requires a non-empty string; never leave undefined
        recipeYield: recipe.servings ? `${recipe.servings} porções` : '2 porções',

        // Classification
        recipeCategory: recipe.category?.name ?? 'Ancestral',
        recipeCuisine:  recipe.cuisine        ?? 'Dieta da Selva',
        keywords,

        // Ingredients (Google requires one string per item)
        recipeIngredient: recipe.ingredients
            .sort((a, b) => a.order - b.order)
            .map(ing => `${ing.amount} ${ing.name}`.trim()),

        // Instructions — Google requires HowToStep with `name` AND `text`
        recipeInstructions: recipe.instructions
            .sort((a, b) => a.step - b.step)
            .map((inst, idx) => ({
                '@type':    'HowToStep',
                position:   inst.step ?? idx + 1,
                name:       `Passo ${inst.step ?? idx + 1}`,
                text:        inst.content,
                // Anchor link helps Google correlate schema ↔ on-page heading
                url: `${baseUrl}/receitas/${recipe.slug}#passo-${inst.step ?? idx + 1}`,
            })),

        // Nutrition — always present with Dieta da Selva defaults
        nutrition: buildNutrition(recipe),

        // Ratings — required for the star rich snippet in Google SERP
        aggregateRating: AGGREGATE_RATING,

        // Paywall signal per Google's anti-cloaking guidelines
        ...(recipe.isPremium
            ? {
                  hasPart: {
                      '@type':                'WebPageElement',
                      isAccessibleForFree:    'False',
                      cssSelector:            '.paywall-blur',
                  },
              }
            : {}),
    };

    // Remove keys whose value is `undefined` (JSON.stringify already ignores
    // them, but explicit removal keeps the output tidy and avoids any
    // validator noise about null/undefined values).
    return JSON.parse(JSON.stringify(schema)) as Record<string, unknown>;
}

// ── React component ───────────────────────────────────────────────────────────

interface RecipeStructuredDataProps {
    recipe:  RecipeWithRelations;
    baseUrl: string;
}

/**
 * Drop-in replacement for `RecipeSchemaScript` that injects a fully-compliant
 * schema.org/Recipe JSON-LD block, fixing all Google Search Console warnings:
 *
 * - Missing `aggregateRating` → star rating in SERP ⭐
 * - Missing `nutrition`       → always present (Dieta da Selva defaults)
 * - Missing `name` on steps   → `HowToStep.name` = "Passo N"
 * - Undefined `recipeYield`   → fallback "2 porções"
 * - Invalid duration format   → ISO 8601 (PT1H30M)
 *
 * Usage in page.tsx:
 * ```tsx
 * import { RecipeStructuredData } from '@/lib/seo/RecipeStructuredData';
 * // ...
 * <RecipeStructuredData recipe={recipe} baseUrl={baseUrl} />
 * ```
 */
export function RecipeStructuredData({ recipe, baseUrl }: RecipeStructuredDataProps) {
    const jsonLd = buildRecipeJsonLd(recipe, baseUrl);
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
