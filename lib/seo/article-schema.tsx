import { BlogPost } from '@prisma/client';

type BlogPostWithAuthor = BlogPost & {
  author: {
    name: string;
  };
  category?: {
    name: string;
  } | null;
};

export function generateArticleSchema(post: BlogPostWithAuthor, baseUrl: string) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? `${baseUrl}${post.coverImage}` : undefined,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
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
