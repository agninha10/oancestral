import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const newsletterSchema = z.object({
    email: z.string().email('Email inválido'),
    source: z.enum(['BLOG_FOOTER', 'RECIPE_POPUP', 'INLINE_CTA', 'HOMEPAGE', 'OTHER']).default('OTHER'),
    tags: z.array(z.string()).optional().default([]),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = newsletterSchema.parse(body);

        // Check if email already exists
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email: validatedData.email },
        });

        if (existing) {
            // If exists but inactive, reactivate
            if (!existing.active) {
                await prisma.newsletterSubscriber.update({
                    where: { email: validatedData.email },
                    data: {
                        active: true,
                        source: validatedData.source,
                        tags: validatedData.tags,
                    },
                });

                return NextResponse.json({
                    success: true,
                    message: 'Inscrição reativada com sucesso!',
                });
            }

            return NextResponse.json({
                success: true,
                message: 'Email já cadastrado!',
            });
        }

        // Create new subscriber
        await prisma.newsletterSubscriber.create({
            data: {
                email: validatedData.email,
                source: validatedData.source,
                tags: validatedData.tags,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Inscrição realizada com sucesso!',
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }

        console.error('Error subscribing to newsletter:', error);
        return NextResponse.json(
            { error: 'Erro ao processar inscrição' },
            { status: 500 }
        );
    }
}
