import { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://oancestral.com.br").replace(/\/$/, "");

    const [posts, recipes] = await Promise.all([
        prisma.blogPost.findMany({
            select: {
                slug: true,
                updatedAt: true,
            },
        }),
        prisma.recipe.findMany({
            select: {
                slug: true,
                updatedAt: true,
            },
        }),
    ]);

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            priority: 1.0,
            changeFrequency: "weekly",
        },
        {
            url: `${baseUrl}/jejum`,
            lastModified: new Date(),
            priority: 0.95,
            changeFrequency: "monthly",
        },
        {
            url: `${baseUrl}/sobre`,
            priority: 0.8,
            changeFrequency: "yearly",
        },
        {
            url: `${baseUrl}/blog`,
            priority: 0.85,
            changeFrequency: "daily",
        },
        {
            url: `${baseUrl}/receitas`,
            priority: 0.8,
            changeFrequency: "weekly",
        },
        {
            url: `${baseUrl}/cursos`,
            priority: 0.75,
            changeFrequency: "monthly",
        },
    ];

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        priority: 0.7,
    }));

    const recipeRoutes: MetadataRoute.Sitemap = recipes.map((recipe) => ({
        url: `${baseUrl}/receitas/${recipe.slug}`,
        lastModified: recipe.updatedAt,
        priority: 0.7,
    }));

    return [...staticRoutes, ...blogRoutes, ...recipeRoutes];
}
