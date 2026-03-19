import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import CourseDetailClient from '@/app/cursos/[courseSlug]/course-detail-client';
import { CourseSchemaScript } from '@/lib/seo/course-schema';
import MentoriaLandingPage from '@/components/landing-pages/mentoria-jejum-landing';

// Slugs que recebem landing page customizada (sem o header padrão do site)
const MENTORIA_JEJUM_SLUG = 'mentoria-de-jejum-ancestral-o-caminho-da-saude-integral';

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

    // Metadata premium para a landing page da mentoria
    if (courseSlug === MENTORIA_JEJUM_SLUG) {
        return {
            title: 'Mentoria de Jejum Ancestral — Protocolo Definitivo | O Ancestral',
            description:
                'Um protocolo guiado de 4 semanas para resetar seus hormônios, destruir a inflamação e resgatar a clareza mental predatória com jejum ancestral.',
            alternates: { canonical: `/cursos/${courseSlug}` },
            openGraph: {
                title: 'Mentoria de Jejum Ancestral — Protocolo Definitivo',
                description:
                    'Do jejum 16:8 até a autofagia profunda de 72h. Acompanhamento direto. Garantia de 7 dias.',
                type: 'website',
                images: ogImageUrl
                    ? [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Mentoria de Jejum Ancestral' }]
                    : [],
            },
            twitter: {
                card: 'summary_large_image' as const,
                title: 'Mentoria de Jejum Ancestral',
                description: 'Protocolo guiado de 4 semanas para dominar sua biologia.',
                images: ogImageUrl ? [ogImageUrl] : [],
            },
        };
    }

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

    // ── Landing page customizada: sem header/footer padrão do site ──────────
    if (courseSlug === MENTORIA_JEJUM_SLUG && course) {
        return (
            <>
                <CourseSchemaScript course={course} baseUrl={baseUrl} />
                <MentoriaLandingPage
                    course={{
                        title: course.title,
                        description: course.description,
                        price: course.price,
                        kiwifyUrl: course.kiwifyUrl,
                        coverImage: course.coverImage,
                        waitlistEnabled: course.waitlistEnabled,
                        slug: course.slug,
                    }}
                />
            </>
        );
    }

    // ── Layout padrão de curso ───────────────────────────────────────────────
    return (
        <>
            {course && <CourseSchemaScript course={course} baseUrl={baseUrl} />}
            <CourseDetailClient courseSlug={courseSlug} />
        </>
    );
}
