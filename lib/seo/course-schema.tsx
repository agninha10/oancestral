import { Course } from '@prisma/client';

type CourseData = Pick<
  Course,
  'title' | 'slug' | 'description' | 'coverImage' | 'isPremium' | 'createdAt' | 'updatedAt'
>;

const resolveImageUrl = (imagePath: string | null | undefined, baseUrl: string): string => {
  if (!imagePath) return `${baseUrl}/images/og-default.jpg`;
  if (imagePath.startsWith('http')) return imagePath;
  return `${baseUrl}${imagePath}`;
};

export function generateCourseSchema(course: CourseData, baseUrl: string) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    image: resolveImageUrl(course.coverImage, baseUrl),
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
