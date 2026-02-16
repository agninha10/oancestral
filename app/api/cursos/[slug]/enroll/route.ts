import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getSession();
        const { slug } = await params;

        if (!session?.userId) {
            return NextResponse.json(
                { error: 'Usuário não autenticado' },
                { status: 401 }
            );
        }

        const course = await prisma.course.findUnique({
            where: {
                slug,
                published: true,
            },
            select: {
                id: true,
                isPremium: true,
            },
        });

        if (!course) {
            return NextResponse.json(
                { error: 'Curso não encontrado' },
                { status: 404 }
            );
        }

        // Verificar se o curso é premium e o usuário tem assinatura ativa
        if (course.isPremium) {
            const user = await prisma.user.findUnique({
                where: { id: session.userId },
                select: {
                    subscriptionStatus: true,
                    subscriptionEndDate: true,
                },
            });

            if (!user) {
                return NextResponse.json(
                    { error: 'Usuário não encontrado' },
                    { status: 404 }
                );
            }

            const hasActiveSubscription =
                user.subscriptionStatus === 'ACTIVE' &&
                user.subscriptionEndDate &&
                new Date(user.subscriptionEndDate) > new Date();

            if (!hasActiveSubscription) {
                return NextResponse.json(
                    { error: 'Assinatura premium necessária' },
                    { status: 403 }
                );
            }
        }

        // Verificar se já está matriculado
        const existingEnrollment = await prisma.courseEnrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.userId,
                    courseId: course.id,
                },
            },
        });

        if (existingEnrollment) {
            return NextResponse.json({
                message: 'Você já está matriculado neste curso',
                enrollment: existingEnrollment,
            });
        }

        // Criar matrícula
        const enrollment = await prisma.courseEnrollment.create({
            data: {
                userId: session.userId,
                courseId: course.id,
            },
        });

        return NextResponse.json({
            message: 'Matrícula realizada com sucesso',
            enrollment,
        });
    } catch (error) {
        console.error('Erro ao matricular no curso:', error);
        return NextResponse.json(
            { error: 'Erro ao matricular no curso' },
            { status: 500 }
        );
    }
}
