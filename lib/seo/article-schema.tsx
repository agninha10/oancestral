import { BlogPost } from '@prisma/client';

type BlogPostWithAuthor = BlogPost & {
  author: {
    name: string | null;
  };
  category?: {
    name: string;
  } | null;
};

const resolveImageUrl = (imagePath: string | null | undefined, baseUrl: string): string => {
  if (!imagePath) return `${baseUrl}/images/og-default.jpg`;
  if (imagePath.startsWith('http')) return imagePath;
  return `${baseUrl}${imagePath}`;
};

export function generateArticleSchema(post: BlogPostWithAuthor, baseUrl: string) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metaTitle || post.title,
    description: post.excerpt,
    image: [resolveImageUrl(post.coverImage, baseUrl)],
    author: [
      {
        '@type': 'Person',
        name: post.author.name,
        url: `${baseUrl}/sobre`,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'O Ancestral',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category?.name || 'Blog',
    wordCount: Math.ceil(post.content.length / 5),
  };

  return JSON.parse(JSON.stringify(schema));
}

export function ArticleSchemaScript({ post, baseUrl }: { post: BlogPostWithAuthor; baseUrl: string }) {
  const schema = generateArticleSchema(post, baseUrl);
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
