import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";

interface BlogCardProps {
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    imageUrl: string;
    slug: string;
}

export function BlogCard({
    title,
    excerpt,
    category,
    readTime,
    imageUrl,
    slug,
}: BlogCardProps) {
    return (
        // Link envolve o card inteiro — mesmo padrão do RecipeCard
        <Link href={`/blog/${slug}`} className="block group h-full">
            <div className="h-full flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">

                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-muted flex-shrink-0">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                        <span className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
                            {category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 space-y-3">
                    <h3 className="font-serif text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                        {excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{readTime} de leitura</span>
                    </div>

                    {/* CTA visual — não é <a> para evitar link aninhado */}
                    <div className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground border border-border/50 group-hover:border-primary/40 group-hover:text-primary transition-all duration-200">
                        Ler artigo
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
