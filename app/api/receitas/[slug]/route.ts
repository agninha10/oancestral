import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const recipe = await prisma.recipe.findUnique({
            where: {
                slug,
                published: true,
            },
            include: {
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
            return NextResponse.json(
                { error: 'Recipe not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ recipe });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recipe' },
            { status: 500 }
        );
    }
}
