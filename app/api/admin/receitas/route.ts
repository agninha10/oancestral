import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

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

export async function POST(request: NextRequest) {
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
            published,
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
                published: published || false,
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
        const userId = await getUserFromToken(request);
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
