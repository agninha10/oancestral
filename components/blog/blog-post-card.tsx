'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type BlogPostCardProps = {
    post: {
        id: string;
        title: string;
        slug: string;
        excerpt: string;
        coverImage: string | null;
        category: string;
        readTime: number;
        publishedAt: Date | null;
        createdAt: Date;
        tags: string[];
    };
};

const categoryLabels: Record<string, string> = {
    NUTRITION: 'Nutrição',
    FASTING: 'Jejum',
    TRAINING: 'Treino',
    MINDSET: 'Mindset',
    LIFESTYLE: 'Estilo de Vida',
    SCIENCE: 'Ciência',
    OTHER: 'Outros',
};

const categoryColors: Record<string, string> = {
    NUTRITION: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    FASTING: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    TRAINING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    MINDSET: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    LIFESTYLE: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    SCIENCE: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    OTHER: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
};

export function BlogPostCard({ post }: BlogPostCardProps) {
    const publishDate = post.publishedAt || post.createdAt;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group h-full"
        >
            <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="h-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-orange-500/50 transition-all duration-300 shadow-lg hover:shadow-orange-500/20 flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-neutral-800">
                        {post.coverImage ? (
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-900/20 to-neutral-900" />
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-60" />

                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${categoryColors[post.category]}`}>
                                {categoryLabels[post.category]}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-orange-400 transition-colors">
                            {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-neutral-400 line-clamp-3 flex-1">
                            {post.excerpt}
                        </p>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs px-2 py-1 rounded-md bg-neutral-800 text-neutral-400"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Meta info */}
                        <div className="flex items-center justify-between pt-2 text-xs text-neutral-500 border-t border-neutral-800">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{format(publishDate, "d 'de' MMM, yyyy", { locale: ptBR })}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{post.readTime} min</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
