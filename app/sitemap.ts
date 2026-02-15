import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://oancestral.com.br";
    const currentDate = new Date();

    return [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/receitas`,
            lastModified: currentDate,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/cursos`,
            lastModified: currentDate,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: currentDate,
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/sobre`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contato`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];
}
