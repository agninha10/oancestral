import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        const recipe = await prisma.recipe.findUnique({
            where: { slug, published: true },
            select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                content: true,
                coverImage: true,
                prepTime: true,
                cookTime: true,
                servings: true,
                difficulty: true,
                cuisine: true,
                calories: true,
                protein: true,
                fat: true,
                carbs: true,
                macronutrients: true,
                tags: true,
                ratingValue: true,
                ratingCount: true,
                createdAt: true,
                author: {
                    select: { name: true, avatarUrl: true },
                },
                category: {
                    select: { name: true },
                },
                ingredients: {
                    orderBy: { order: 'asc' },
                    select: {
                        name: true,
                        amount: true,
                        order: true,
                    },
                },
                instructions: {
                    orderBy: { step: 'asc' },
                    select: {
                        step: true,
                        name: true,
                        content: true,
                        image: true,
                    },
                },
            },
        })

        if (!recipe) {
            return NextResponse.json(
                { success: false, error: 'Receita não encontrada.' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: {
                id: recipe.id,
                slug: recipe.slug,
                title: recipe.title,
                description: recipe.description,
                content: recipe.content,
                coverImage: recipe.coverImage ?? null,
                prepTime: recipe.prepTime ?? null,
                cookTime: recipe.cookTime ?? null,
                servings: recipe.servings ?? null,
                difficulty: recipe.difficulty,
                cuisine: recipe.cuisine ?? null,
                tags: recipe.tags,
                nutrition: {
                    calories: recipe.calories ?? null,
                    protein: recipe.protein ?? null,
                    fat: recipe.fat ?? null,
                    carbs: recipe.carbs ?? null,
                    macronutrients: recipe.macronutrients ?? null,
                },
                rating: {
                    value: recipe.ratingValue ?? null,
                    count: recipe.ratingCount ?? null,
                },
                authorName: recipe.author.name ?? null,
                authorAvatar: recipe.author.avatarUrl ?? null,
                category: recipe.category?.name ?? null,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                createdAt: recipe.createdAt,
            },
        })
    } catch (error) {
        console.error('[mobile/recipes/:slug] Erro:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor.' },
            { status: 500 }
        )
    }
}
