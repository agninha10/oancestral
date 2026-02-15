import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const skip = (page - 1) * limit;

        // Filters
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');

        // Build where clause
        const where: any = {
            published: true,
        };

        if (category) {
            where.category = category;
        }

        if (difficulty) {
            where.difficulty = difficulty;
        }

        // Fetch recipes with pagination
        const [recipes, total] = await Promise.all([
            prisma.recipe.findMany({
                where,
                include: {
                    author: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.recipe.count({ where }),
        ]);

        return NextResponse.json({
            recipes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: skip + recipes.length < total,
            },
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recipes' },
            { status: 500 }
        );
    }
}
