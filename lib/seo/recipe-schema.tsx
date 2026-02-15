import { Recipe, RecipeIngredient, RecipeInstruction } from '@prisma/client';

type RecipeWithRelations = Recipe & {
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  author: {
    name: string;
  };
};

export function generateRecipeSchema(recipe: RecipeWithRelations, baseUrl: string) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const macros = recipe.macronutrients as { protein?: number; fat?: number; carbs?: number } | null;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: recipe.coverImage ? `${baseUrl}${recipe.coverImage}` : undefined,
    author: {
      '@type': 'Person',
      name: recipe.author.name,
    },
    datePublished: recipe.createdAt.toISOString(),
    prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
    cookTime: recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
    totalTime: totalTime > 0 ? `PT${totalTime}M` : undefined,
    recipeYield: recipe.servings ? `${recipe.servings} porções` : undefined,
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cuisine || 'Ancestral',
    keywords: [recipe.category, recipe.cuisine, 'ancestral', 'low carb'].filter(Boolean).join(', '),
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
  };

  return JSON.parse(JSON.stringify(schema));
}

export function RecipeSchemaScript({ recipe, baseUrl }: { recipe: RecipeWithRelations; baseUrl: string }) {
  const schema = generateRecipeSchema(recipe, baseUrl);
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
