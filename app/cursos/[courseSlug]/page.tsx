import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import CourseDetailClient from '@/app/cursos/[courseSlug]/course-detail-client';
import { CourseSchemaScript } from '@/lib/seo/course-schema';

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

    const seoTitle = course.metaTitle || course.title;
    const seoDescription = course.metaDescription || course.description;
    const ogImageUrl = course.ogImage || course.coverImage;

    return {
        title: `${seoTitle} | O Ancestral`,
        description: seoDescription,
        alternates: {
            canonical: `/cursos/${courseSlug}`,
        },
        openGraph: {
            title: seoTitle,
            description: seoDescription,
            type: 'website',
            images: ogImageUrl
                ? [{ url: ogImageUrl, width: 1200, height: 630, alt: course.coverImageAlt || seoTitle }]
                : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: seoTitle,
            description: seoDescription,
            images: ogImageUrl ? [ogImageUrl] : [],
        },
    };
}

export default async function CoursePage({ params }: Props) {
    const { courseSlug } = await params;

    const course = await prisma.course.findFirst({
        where: { slug: courseSlug, published: true },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://oancestral.com.br';

    return (
        <>
            {course && <CourseSchemaScript course={course} baseUrl={baseUrl} />}
            <CourseDetailClient courseSlug={courseSlug} />
        </>
    );
}
