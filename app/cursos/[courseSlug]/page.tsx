import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import CourseDetailClient from '@/app/cursos/[courseSlug]/course-detail-client';
import { CourseSchemaScript } from '@/lib/seo/course-schema';
import MentoriaLandingPage from '@/components/landing-pages/mentoria-jejum-landing';

// Slugs que recebem landing page customizada (sem o header padrão do site)
const MENTORIA_JEJUM_SLUG = 'mentoria-de-jejum-ancestral-o-caminho-da-saude-integral';

// Canonical base URL — never exposes localhost to crawlers
const SITE_URL = (() => {
    const env = process.env.NEXT_PUBLIC_BASE_URL ?? '';
    return env.startsWith('https://') ? env.replace(/\/$/, '') : 'https://oancestral.com.br';
})();

type Props = {
    params: Promise<{ courseSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { courseSlug } = await params;
    const course = await prisma.course.findFirst({
        where: { slug: courseSlug, published: true },
    });

    if (!course) {
        return { title: 'Curso não encontrado' };
    }

    const seoTitle       = course.metaTitle       || course.title;
    const seoDescription = course.metaDescription || course.description;

    // Dynamic OG image via our /api/og/cursos/[slug] route handler
    const ogImage = `${SITE_URL}/api/og/cursos/${courseSlug}`;

    // ── Premium metadata for the jejum course landing page ───────────────────
    if (courseSlug === MENTORIA_JEJUM_SLUG) {
        const title       = 'Curso de Jejum Ancestral — O Método Definitivo | O Ancestral';
        const description = 'O passo a passo estruturado para resetar seus hormônios, destruir a inflamação e derreter gordura pura. Do jejum 16:8 até a autofagia profunda. Acesso imediato. Garantia de 7 dias.';
        return {
            metadataBase: new URL(SITE_URL),
            title,
            description,
            alternates: { canonical: `${SITE_URL}/cursos/${courseSlug}` },
            openGraph: {
                title:       'Curso de Jejum Ancestral — O Método Definitivo',
                description: 'Do 16:8 ao jejum profundo de 72h. Protocolo estruturado, acesso imediato.',
                type:        'website',
                url:         `${SITE_URL}/cursos/${courseSlug}`,
                siteName:    'O Ancestral',
                locale:      'pt_BR',
                images: [{
                    url:    ogImage,
                    width:  1200,
                    height: 630,
                    alt:    'Curso de Jejum Ancestral — O Ancestral',
                }],
            },
            twitter: {
                card:        'summary_large_image',
                site:        '@oancestral',
                title:       'Curso de Jejum Ancestral',
                description: 'Protocolo definitivo para dominar sua biologia. Acesso imediato.',
                images:      [ogImage],
            },
        };
    }

    // ── Standard course metadata ─────────────────────────────────────────────
    return {
        metadataBase: new URL(SITE_URL),
        title:       `${seoTitle} | O Ancestral`,
        description: seoDescription,
        alternates:  { canonical: `${SITE_URL}/cursos/${courseSlug}` },
        openGraph: {
            title:       seoTitle,
            description: seoDescription,
            type:        'website',
            url:         `${SITE_URL}/cursos/${courseSlug}`,
            siteName:    'O Ancestral',
            locale:      'pt_BR',
            images: [{
                url:    ogImage,
                width:  1200,
                height: 630,
                alt:    course.coverImageAlt || seoTitle,
            }],
        },
        twitter: {
            card:        'summary_large_image',
            site:        '@oancestral',
            title:       seoTitle,
            description: seoDescription,
            images:      [ogImage],
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
