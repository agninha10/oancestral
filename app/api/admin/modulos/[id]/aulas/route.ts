import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyEnrolledUsers } from '@/app/actions/notifications';
import { auth } from '@/auth';

async function getAdminUser() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') return null;
    return { id: session.user.id };
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        const { id: moduleId } = await params;
        const body = await request.json();
        const { title, slug, videoUrl, thumbnailUrl, content, order, isFree } = body;

        const lesson = await prisma.lesson.create({
            data: {
                title,
                slug,
                videoUrl: videoUrl || null,
                thumbnailUrl: thumbnailUrl || null,
                content: content || null,
                order,
                isFree: isFree ?? false,
                moduleId,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                videoUrl: true,
                content: true,
                order: true,
                isFree: true,
                moduleId: true,
                module: { select: { courseId: true, course: { select: { slug: true, title: true } } } },
            },
        });

        // Notify enrolled students (non-blocking)
        notifyEnrolledUsers(
            lesson.module.courseId,
            `Nova aula: ${lesson.title}`,
            `Uma nova aula foi adicionada em ${lesson.module.course.title}.`,
            `/play/${lesson.module.course.slug}/aula/${lesson.id}`,
        ).catch(() => {});

        // Return only lesson fields (strip module relation)
        const { module: _m, ...lessonData } = lesson;
        return NextResponse.json(lessonData);
    } catch (error) {
        console.error('Erro ao criar aula:', error);
        return NextResponse.json(
            { error: 'Erro ao criar aula' },
            { status: 500 }
        );
    }
}
