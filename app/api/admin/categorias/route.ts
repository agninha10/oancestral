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

export async function GET(request: NextRequest) {
    try {
        const userId = await getUserFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        if (!prisma.category) {
            console.error('Prisma Category model not found');
            return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
        }

        const categories = await prisma.category.findMany({
            where: type ? { type: type as any } : undefined,
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
