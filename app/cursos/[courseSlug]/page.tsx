import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import CourseDetailClient from '@/app/cursos/[courseSlug]/course-detail-client';

type Props = {
    params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { courseSlug } = await params;
    const course = await prisma.course.findFirst({
        where: { slug: courseSlug, published: true },
    });

    if (!course) {
        return {
            title: 'Curso não encontrado',
        };
    }

    return {
        title: `${course.title} | Cursos`,
        description: course.description,
        openGraph: {
            title: course.title,
            description: course.description,
            type: 'website',
            images: course.coverImage ? [{ url: course.coverImage }] : [],
        },
    };
}

export default async function CoursePage({ params }: Props) {
    const { courseSlug } = await params;
    
    return <CourseDetailClient courseSlug={courseSlug} />;
}
