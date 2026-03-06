import { Recipe, RecipeIngredient, RecipeInstruction } from '@prisma/client';

// Recipe includes metaTitle from the Prisma schema (SEO field)
type RecipeWithRelations = Recipe & {
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  author: {
    name: string;
  };
  category?: {
    name: string;
  } | null;
};

const RECIPE_PLACEHOLDER_IMAGE = '/placeholder-receita.jpg';

const resolveImageUrl = (imagePath: string | null | undefined, baseUrl: string): string => {
  if (!imagePath) return `${baseUrl}${RECIPE_PLACEHOLDER_IMAGE}`;
  if (imagePath.startsWith('http')) return imagePath;
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export function generateRecipeSchema(recipe: RecipeWithRelations, baseUrl: string) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const macros = recipe.macronutrients as { protein?: number; fat?: number; carbs?: number } | null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.metaTitle || recipe.title,
    description: recipe.metaDescription || recipe.description,
    image: recipe.coverImage
      ? [resolveImageUrl(recipe.coverImage, baseUrl)]
      : [`${baseUrl}${RECIPE_PLACEHOLDER_IMAGE}`],
    author: {
      '@type': 'Person',
      name: recipe.author.name,
      url: `${baseUrl}/sobre`,
    },
    datePublished: recipe.createdAt.toISOString(),
    prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
    cookTime: recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
    totalTime: totalTime > 0 ? `PT${totalTime}M` : undefined,
    recipeYield: recipe.servings ? `${recipe.servings} porções` : undefined,
    recipeCategory: recipe.category?.name || 'Ancestral',
    recipeCuisine: recipe.cuisine || 'Ancestral',
    keywords: [recipe.category?.name, recipe.cuisine, 'ancestral', 'low carb'].filter(Boolean).join(', '),
    recipeIngredient: recipe.ingredients.sort((a, b) => a.order - b.order).map(ing => `${ing.amount} ${ing.name}`),
    recipeInstructions: recipe.instructions.sort((a, b) => a.step - b.step).map(inst => ({
      '@type': 'HowToStep',
      text: inst.content,
      position: inst.step,
    })),
    nutrition: recipe.calories || macros ? {
      '@type': 'NutritionInformation',
      calories: recipe.calories ? `${recipe.calories} calories` : undefined,
      proteinContent: macros?.protein ? `${macros.protein}g` : (recipe.protein ? `${recipe.protein}g` : undefined),
      fatContent: macros?.fat ? `${macros.fat}g` : (recipe.fat ? `${recipe.fat}g` : undefined),
      carbohydrateContent: macros?.carbs ? `${macros.carbs}g` : (recipe.carbs ? `${recipe.carbs}g` : undefined),
    } : undefined,
    // Anti-cloaking markup for premium content
    ...(recipe.isPremium ? {
      hasPart: {
        '@type': 'WebPageElement',
        isAccessibleForFree: 'False',
        cssSelector: '.paywall-blur',
      },
    } : {}),
  };

  return JSON.parse(JSON.stringify(schema));
}

export function RecipeSchemaScript({ recipe, baseUrl }: { recipe: RecipeWithRelations; baseUrl: string }) {
  const schema = generateRecipeSchema(recipe, baseUrl);
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
