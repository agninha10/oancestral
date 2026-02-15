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
        const tag = searchParams.get('tag');

        // Build where clause
        const where: any = {
            published: true,
        };

        if (category) {
            where.category = category;
        }

        if (tag) {
            where.tags = {
                has: tag,
            };
        }

        // Fetch posts with pagination
        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                include: {
                    author: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    publishedAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.blogPost.count({ where }),
        ]);

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: skip + posts.length < total,
            },
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blog posts' },
            { status: 500 }
        );
    }
}
