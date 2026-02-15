import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
            {/* Image */}
            <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
                        {category}
                    </span>
                </div>
            </div>

            <CardContent className="p-6 space-y-3">
                {/* Title */}
                <h3 className="font-serif text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{readTime} de leitura</span>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Button asChild variant="ghost" className="group/btn w-full">
                    <Link href={`/blog/${slug}`}>
                        Ler artigo
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
