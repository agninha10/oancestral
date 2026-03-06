import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { notifyGoogleIndexing } from '@/lib/google-indexing';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getUserFromToken(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== 'ADMIN') return null;
        return payload.userId as string;
    } catch {
        return null;
    }
}


export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const userId = await getUserFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.recipe.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return NextResponse.json(
            { error: 'Failed to delete recipe' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const userId = await getUserFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const recipe = await prisma.recipe.findUnique({
            where: { id: params.id },
            include: {
                category: true,
                ingredients: {
                    orderBy: { order: 'asc' },
                },
                instructions: {
                    orderBy: { step: 'asc' },
                },
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!recipe) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        return NextResponse.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recipe' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const userId = await getUserFromToken(request);
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

        // Delete existing ingredients and instructions
        await prisma.recipeIngredient.deleteMany({
            where: { recipeId: params.id },
        });

        await prisma.recipeInstruction.deleteMany({
            where: { recipeId: params.id },
        });

        // Update recipe with new data
        const recipe = await prisma.recipe.update({
            where: { id: params.id },
            data: {
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
                content: content || '',
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null,
                coverImageAlt: coverImageAlt || null,
                tags: tags || [],
                published: published || false,
                featured: featured || false,
                isPremium: isPremium || false,
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

        // Notifica o Google Indexing API se a receita foi publicada
        if (recipe.published) {
            const recipeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/receitas/${recipe.slug}`;
            // Executa em background sem bloquear a resposta
            notifyGoogleIndexing(recipeUrl).catch(err => 
                console.error('[Recipe PUT] Erro ao notificar Google:', err)
            );
        }

        return NextResponse.json(recipe);
    } catch (error) {
        console.error('Error updating recipe:', error);
        return NextResponse.json(
            { error: 'Failed to update recipe' },
            { status: 500 }
        );
    }
}

