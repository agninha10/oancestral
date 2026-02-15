interface JsonLdOrganization {
    "@context": "https://schema.org";
    "@type": "Organization";
    name: string;
    url: string;
    logo?: string;
    description?: string;
    sameAs?: string[];
}

interface JsonLdWebSite {
    "@context": "https://schema.org";
    "@type": "WebSite";
    name: string;
    url: string;
    description?: string;
    potentialAction?: {
        "@type": "SearchAction";
        target: string;
        "query-input": string;
    };
}

interface JsonLdArticle {
    "@context": "https://schema.org";
    "@type": "Article";
    headline: string;
    description: string;
    image?: string;
    author: {
        "@type": "Person" | "Organization";
        name: string;
    };
    publisher: {
        "@type": "Organization";
        name: string;
        logo?: {
            "@type": "ImageObject";
            url: string;
        };
    };
    datePublished: string;
    dateModified?: string;
}

interface JsonLdRecipe {
    "@context": "https://schema.org";
    "@type": "Recipe";
    name: string;
    description: string;
    image?: string;
    author: {
        "@type": "Person" | "Organization";
        name: string;
    };
    datePublished: string;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    recipeYield?: string;
    recipeCategory?: string;
    recipeCuisine?: string;
    nutrition?: {
        "@type": "NutritionInformation";
        calories?: string;
        proteinContent?: string;
        fatContent?: string;
        carbohydrateContent?: string;
    };
    recipeIngredient?: string[];
    recipeInstructions?: Array<{
        "@type": "HowToStep";
        text: string;
    }>;
}

export function generateOrganizationSchema(): JsonLdOrganization {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "O Ancestral",
        url: "https://oancestral.com.br",
        description:
            "Plataforma completa de estilo de vida ancestral: alimentação, dieta, treinos e jejum.",
        sameAs: [
            "https://facebook.com/oancestral",
            "https://instagram.com/oancestral",
            "https://youtube.com/@oancestral",
        ],
    };
}

export function generateWebSiteSchema(): JsonLdWebSite {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "O Ancestral",
        url: "https://oancestral.com.br",
        description:
            "Plataforma completa de estilo de vida ancestral: alimentação, dieta, treinos e jejum.",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://oancestral.com.br/busca?q={search_term_string}",
            "query-input": "required name=search_term_string",
        },
    };
}

export function generateArticleSchema(article: {
    title: string;
    description: string;
    image?: string;
    author: string;
    publishedAt: string;
    updatedAt?: string;
}): JsonLdArticle {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        image: article.image,
        author: {
            "@type": "Person",
            name: article.author,
        },
        publisher: {
            "@type": "Organization",
            name: "O Ancestral",
        },
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
    };
}

export function generateRecipeSchema(recipe: {
    name: string;
    description: string;
    image?: string;
    author: string;
    publishedAt: string;
    prepTime?: string;
    cookTime?: string;
    servings?: string;
    category?: string;
    cuisine?: string;
    calories?: string;
    protein?: string;
    fat?: string;
    carbs?: string;
    ingredients?: string[];
    instructions?: string[];
}): JsonLdRecipe {
    return {
        "@context": "https://schema.org",
        "@type": "Recipe",
        name: recipe.name,
        description: recipe.description,
        image: recipe.image,
        author: {
            "@type": "Person",
            name: recipe.author,
        },
        datePublished: recipe.publishedAt,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        totalTime:
            recipe.prepTime && recipe.cookTime
                ? `PT${parseInt(recipe.prepTime) + parseInt(recipe.cookTime)}M`
                : undefined,
        recipeYield: recipe.servings,
        recipeCategory: recipe.category,
        recipeCuisine: recipe.cuisine,
        nutrition: recipe.calories
            ? {
                "@type": "NutritionInformation",
                calories: recipe.calories,
                proteinContent: recipe.protein,
                fatContent: recipe.fat,
                carbohydrateContent: recipe.carbs,
            }
            : undefined,
        recipeIngredient: recipe.ingredients,
        recipeInstructions: recipe.instructions?.map((text) => ({
            "@type": "HowToStep",
            text,
        })),
    };
}
