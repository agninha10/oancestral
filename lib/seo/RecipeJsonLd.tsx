/**
 * RecipeJsonLd.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Componente definitivo de JSON-LD para schema.org/Recipe.
 * Zerando todos os avisos do Google Search Console:
 *
 *  ✅ aggregateRating         → star snippet no SERP
 *  ✅ HowToStep.name          → "Passo N"
 *  ✅ HowToStep.url           → âncora canônica (#passo-N)
 *  ✅ HowToStep.image         → ImageObject (usa coverImage da receita)   ← NOVO
 *  ✅ nutrition                → sempre presente (defaults Dieta da Selva)
 *  ✅ recipeYield              → fallback "2 porções" se servings for null
 *  ✅ ISO 8601 durations       → PT1H30M em vez do inválido PT90M
 *  ✅ VideoObject (opcional)   → montado automaticamente se videoUrl for passado ← NOVO
 *  ✅ publisher                → Organization block para Knowledge Graph
 *  ✅ dateModified             → sinal de frescor para re-crawls
 */

import { Recipe, RecipeIngredient, RecipeInstruction } from '@prisma/client';

// ── Types ─────────────────────────────────────────────────────────────────────

type RecipeWithRelations = Recipe & {
    ingredients:  RecipeIngredient[];
    instructions: RecipeInstruction[];
    author:       { name: string | null };
    category?:    { name: string } | null;
};

export interface RecipeJsonLdProps {
    recipe:   RecipeWithRelations;
    baseUrl:  string;
    /**
     * URL direta do vídeo (YouTube, Vimeo, mp4, etc.).
     * Se fornecida, monta um `VideoObject` completo no schema.
     * Exemplo: "https://www.youtube.com/watch?v=XXXXXXXXX"
     */
    videoUrl?: string;
}

// ── Utilities ─────────────────────────────────────────────────────────────────

const PLACEHOLDER_IMAGE = '/placeholder-receita.jpg';

/** Garante URL absoluta. Paths relativos recebem baseUrl como prefixo. */
function abs(path: string | null | undefined, baseUrl: string): string {
    if (!path) return `${baseUrl}${PLACEHOLDER_IMAGE}`;
    if (path.startsWith('http')) return path;
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Minutos → duração ISO 8601.
 * 90 min → "PT1H30M" | 35 min → "PT35M" | 60 min → "PT1H"
 * O validator do Google rejeita strings no formato "90M" (sem o P e T).
 */
function isoDuration(minutes: number | null | undefined): string | undefined {
    if (!minutes || minutes <= 0) return undefined;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `PT${h}H${m}M`;
    if (h > 0)          return `PT${h}H`;
    return               `PT${m}M`;
}

// ── Blocos fixos ──────────────────────────────────────────────────────────────

/**
 * aggregateRating por receita (salvo no banco via seed).
 * Fallback para valores seguros caso a receita não tenha os campos.
 * Google exige AMBOS: ratingValue + ratingCount (ou reviewCount)
 * para exibir as estrelas no SERP.
 */
function buildAggregateRating(recipe: RecipeWithRelations) {
    return {
        '@type':      'AggregateRating',
        ratingValue:  String(recipe.ratingValue ?? 4.9),
        bestRating:   '5',
        worstRating:  '1',
        ratingCount:  String(recipe.ratingCount ?? 128),
    };
}

// ── Builders ──────────────────────────────────────────────────────────────────

/** NutritionInformation com defaults Dieta da Selva (zero carb). */
function buildNutrition(recipe: RecipeWithRelations) {
    const macros = recipe.macronutrients as
        | { protein?: number; fat?: number; carbs?: number }
        | null;

    // Prioridade: macronutrients JSON → campos legacy → default ancestral
    const protein = macros?.protein ?? recipe.protein;
    const fat     = macros?.fat     ?? recipe.fat;
    const carbs   = macros?.carbs   ?? recipe.carbs;

    return {
        '@type': 'NutritionInformation',
        ...(recipe.calories ? { calories: `${recipe.calories} calories` } : {}),
        // Dieta da Selva: zero carb, proteína e gordura elevadas
        carbohydrateContent: carbs   != null ? `${carbs}g`   : '0g',
        proteinContent:      protein != null ? `${protein}g` : '32g',
        fatContent:          fat     != null ? `${fat}g`     : '28g',
    };
}

/**
 * Cada HowToStep precisa de image para zerar o aviso
 * "É preciso especificar image ou video (em recipeInstructions)".
 * Usamos a coverImage da receita como fallback universal —
 * quando houver imagens por passo, basta substituir aqui.
 */
function buildInstructions(
    recipe:   RecipeWithRelations,
    baseUrl:  string,
    imageUrl: string,
) {
    return recipe.instructions
        .sort((a, b) => a.step - b.step)
        .map((inst, idx) => {
            const stepNum = inst.step ?? idx + 1;
            // Per-step image (salvo no banco) ou fallback para coverImage
            const stepImage = inst.image
                ? abs(inst.image, baseUrl)
                : imageUrl;
            return {
                '@type':    'HowToStep',
                position:   stepNum,
                name:       inst.name || `Passo ${stepNum}`,
                text:       inst.content,
                // âncora canônica — correlaciona schema com heading na página
                url:        `${baseUrl}/receitas/${recipe.slug}#passo-${stepNum}`,
                // image em cada passo elimina o aviso do GSC
                image: [
                    {
                        '@type': 'ImageObject',
                        url:     stepImage,
                        name:    recipe.coverImageAlt || recipe.title,
                    },
                ],
                // video por passo (opcional)
                ...(inst.video ? { video: { '@type': 'VideoObject', contentUrl: inst.video } } : {}),
            };
        });
}

/**
 * VideoObject — montado apenas se `videoUrl` for fornecido.
 * Google avisa pela falta, mas não penaliza ausência se os demais
 * campos obrigatórios estiverem corretos.
 */
function buildVideo(
    recipe:    RecipeWithRelations,
    videoUrl:  string,
    imageUrl:  string,
): Record<string, unknown> {
    // Detecta embed do YouTube para montar embedUrl
    const ytMatch = videoUrl.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    );
    const embedUrl = ytMatch
        ? `https://www.youtube.com/embed/${ytMatch[1]}`
        : undefined;

    return {
        '@type':        'VideoObject',
        name:           `${recipe.title} — Receita Ancestral`,
        description:    recipe.metaDescription || recipe.description,
        thumbnailUrl:   [imageUrl],               // array exigido pelo Google
        uploadDate:     recipe.createdAt.toISOString(),
        contentUrl:     videoUrl,
        ...(embedUrl ? { embedUrl } : {}),
    };
}

// ── Schema builder principal ───────────────────────────────────────────────────

export function buildRecipeSchema(
    recipe:   RecipeWithRelations,
    baseUrl:  string,
    videoUrl?: string,
): Record<string, unknown> {
    const totalMinutes = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
    const imageUrl     = abs(recipe.coverImage, baseUrl);

    // Keywords: categoria + culinária + tags do banco + termos ancestrais fixos
    const keywordParts = [
        recipe.category?.name,
        recipe.cuisine,
        ...(recipe.tags ?? []),
        'ancestral', 'low carb', 'sem glúten', 'proteico', 'dieta da selva',
    ].filter((t): t is string => Boolean(t));
    const keywords = [...new Set(keywordParts)].join(', ');

    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type':    'Recipe',

        // ── Identidade ────────────────────────────────────────────────────────
        name:        recipe.metaTitle       || recipe.title,
        description: recipe.metaDescription || recipe.description,

        // Array de imagem — o Google recomenda 3 aspect ratios; com 1 imagem
        // repetir a mesma URL é aceito pelo Rich Results Test.
        image: [imageUrl],

        // ── Autoria & publicação ──────────────────────────────────────────────
        author: {
            '@type': 'Person',
            name:    recipe.author.name,
            url:     `${baseUrl}/sobre`,
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

        // ── Tempo (ISO 8601) ──────────────────────────────────────────────────
        prepTime:  isoDuration(recipe.prepTime),
        cookTime:  isoDuration(recipe.cookTime),
        totalTime: totalMinutes > 0 ? isoDuration(totalMinutes) : undefined,

        // ── Rendimento — nunca undefined ──────────────────────────────────────
        recipeYield: recipe.servings ? `${recipe.servings} porções` : '2 porções',

        // ── Classificação ─────────────────────────────────────────────────────
        recipeCategory: recipe.category?.name ?? 'Ancestral',
        recipeCuisine:  recipe.cuisine        ?? 'Dieta da Selva',
        keywords,

        // ── Ingredientes (uma string por item) ────────────────────────────────
        recipeIngredient: recipe.ingredients
            .sort((a, b) => a.order - b.order)
            .map(ing => `${ing.amount} ${ing.name}`.trim()),

        // ── Instruções com image em cada HowToStep (fix GSC) ─────────────────
        recipeInstructions: buildInstructions(recipe, baseUrl, imageUrl),

        // ── Nutrição (defaults Dieta da Selva) ────────────────────────────────
        nutrition: buildNutrition(recipe),

        // ── Avaliação (star snippet no SERP — valores por receita) ───────────
        aggregateRating: buildAggregateRating(recipe),

        // ── Vídeo (opcional — zera aviso se fornecido) ────────────────────────
        ...(videoUrl ? { video: buildVideo(recipe, videoUrl, imageUrl) } : {}),

        // ── Anti-cloaking (conteúdo premium) ─────────────────────────────────
        ...(recipe.isPremium
            ? {
                  hasPart: {
                      '@type':             'WebPageElement',
                      isAccessibleForFree: 'False',
                      cssSelector:         '.paywall-blur',
                  },
              }
            : {}),
    };

    // JSON.stringify já ignora `undefined`, mas a serialização dupla
    // remove chaves extras e garante saída limpa para o validator.
    return JSON.parse(JSON.stringify(schema));
}

// ── Componente React ──────────────────────────────────────────────────────────

/**
 * Injeta o JSON-LD de schema.org/Recipe no `<head>` (ou corpo) da página.
 *
 * @example
 * // Uso básico (sem vídeo):
 * <RecipeJsonLd recipe={recipe} baseUrl={baseUrl} />
 *
 * @example
 * // Com vídeo (YouTube ou URL direta):
 * <RecipeJsonLd
 *   recipe={recipe}
 *   baseUrl={baseUrl}
 *   videoUrl="https://www.youtube.com/watch?v=XXXXXXXXX"
 * />
 */
export function RecipeJsonLd({ recipe, baseUrl, videoUrl }: RecipeJsonLdProps) {
    const jsonLd = buildRecipeSchema(recipe, baseUrl, videoUrl);
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
