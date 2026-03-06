import { Course } from '@prisma/client';

type CourseData = Pick<
  Course,
  'title' | 'slug' | 'description' | 'coverImage' | 'isPremium' | 'createdAt' | 'updatedAt'
>;

export function generateCourseSchema(course: CourseData, baseUrl: string) {
  const DEFAULT_IMAGE = `${baseUrl}/images/og-default.jpg`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    image: course.coverImage ? `${baseUrl}${course.coverImage}` : DEFAULT_IMAGE,
    url: `${baseUrl}/cursos/${course.slug}`,
    datePublished: course.createdAt.toISOString(),
    dateModified: course.updatedAt.toISOString(),
    provider: {
      '@type': 'Organization',
      name: 'O Ancestral',
      sameAs: baseUrl,
    },
    offers: {
      '@type': 'Offer',
      category: course.isPremium ? 'Paid' : 'Free',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/cursos/${course.slug}`,
    },
    inLanguage: 'pt-BR',
  };

  // Strip undefined values so the JSON-LD output stays clean
  return JSON.parse(JSON.stringify(schema));
}

export function CourseSchemaScript({
  course,
  baseUrl,
}: {
  course: CourseData;
  baseUrl: string;
}) {
  const schema = generateCourseSchema(course, baseUrl);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
