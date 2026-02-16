import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

async function getAdminUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');

        if (!token) {
            console.log('❌ No token found');
            return null;
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token.value, secret);
        console.log('✅ JWT payload:', payload);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { id: true, role: true },
        });
        console.log('✅ User from DB:', user);

        if (user?.role !== 'ADMIN') {
            console.log('❌ User is not ADMIN. Role:', user?.role);
            return null;
        }

        return user;
    } catch (error) {
        console.log('❌ Error in getAdminUser:', error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { modules: true },
                },
            },
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar cursos' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, slug, description, coverImage, isPremium, published } = body;

        const course = await prisma.course.create({
            data: {
                title,
                slug,
                description,
                coverImage: coverImage || null,
                isPremium: isPremium ?? true,
                published: published ?? false,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error('Erro ao criar curso:', error);
        return NextResponse.json(
            { error: 'Erro ao criar curso' },
            { status: 500 }
        );
    }
}
