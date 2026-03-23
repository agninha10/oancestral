import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { notifyGoogleIndexing } from '@/lib/google-indexing';
import { broadcastNotification } from '@/app/actions/notifications';

async function getAdminUserId(): Promise<string | null> {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') return null;
    return session.user.id;
}

export async function POST(request: NextRequest) {
    try {
        const userId = await getAdminUserId();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            slug,
            description,
            coverImage,
            prepTime,
            cookTime,
            servings,
            difficulty,
            categoryId,
            cuisine,
            calories,
            protein,
            fat,
            carbs,
            ingredients,
            instructions,
            content,
            metaTitle,
            metaDescription,
            coverImageAlt,
            tags,
            published,
            featured,
            isPremium,
        } = body;

        console.log('Creating recipe with body:', JSON.stringify(body, null, 2));

        // Create recipe with ingredients and instructions
        const recipe = await prisma.recipe.create({
            data: {
                title,
                slug,
                description,
                coverImage,
                prepTime,
                cookTime,
                servings,
                difficulty,
                categoryId, // Using foreign key directly
                cuisine,
                calories,
                protein,
                fat,
                carbs,
                content: content || '',
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null,
                coverImageAlt: coverImageAlt || null,
                tags: tags || [],
                published: published || false,
                featured: featured || false,
                isPremium: isPremium || false,
                authorId: userId,
                ingredients: {
                    create: ingredients.map((ing: any, index: number) => ({
                        name: ing.name,
                        amount: ing.amount,
                        order: index + 1,
                    })),
                },
                instructions: {
                    create: instructions.map((inst: any, index: number) => ({
                        content: inst.content,
                        step: index + 1,
                    })),
                },
            },
            include: {
                ingredients: true,
                instructions: true,
            },
        });

        if (recipe.published) {
            const recipeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/receitas/${recipe.slug}`;
            notifyGoogleIndexing(recipeUrl).catch((err) =>
                console.error('[Recipe POST] Erro ao notificar Google:', err),
            );

            // Notify all users (non-blocking)
            broadcastNotification(
                `Nova receita: ${recipe.title}`,
                recipe.description ?? 'Uma nova receita ancestral foi publicada.',
                `/receitas/${recipe.slug}`,
                'RECIPE',
            ).catch(() => {});
        }

        return NextResponse.json(recipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        return NextResponse.json(
            { error: 'Failed to create recipe' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const userId = await getAdminUserId();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const recipes = await prisma.recipe.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                author: {
                    select: {
                        name: true,
                    },
                },
                _count: {
                    select: {
                        ingredients: true,
                        instructions: true,
                    },
                },
            },
        });

        return NextResponse.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recipes' },
            { status: 500 }
        );
    }
}
