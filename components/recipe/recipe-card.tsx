'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ChefHat, Users } from 'lucide-react';

type RecipeCardProps = {
    recipe: {
        id: string;
        title: string;
        slug: string;
        description: string;
        coverImage: string | null;
        prepTime: number | null;
        cookTime: number | null;
        servings: number | null;
        difficulty: string;
        category: string;
    };
};

const difficultyColors: Record<string, string> = {
    EASY: 'bg-green-500/10 text-green-600 border-green-500/20',
    MEDIUM: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    HARD: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const difficultyLabels: Record<string, string> = {
    EASY: 'Fácil',
    MEDIUM: 'Médio',
    HARD: 'Difícil',
};

const categoryLabels: Record<string, string> = {
    CARNIVORE: 'Carnívora',
    LOW_CARB: 'Low Carb',
    KETO: 'Keto',
    PALEO: 'Paleo',
    ANCESTRAL: 'Ancestral',
    FASTING: 'Jejum',
    OTHER: 'Outros',
};

export function RecipeCard({ recipe }: RecipeCardProps) {
    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group"
        >
            <Link href={`/receitas/${recipe.slug}`} className="block">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-orange-500/50 transition-all duration-300 shadow-lg hover:shadow-orange-500/20">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
                        {recipe.coverImage ? (
                            <Image
                                src={recipe.coverImage}
                                alt={recipe.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ChefHat className="w-16 h-16 text-neutral-700" />
                            </div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-60" />

                        {/* Difficulty badge */}
                        <div className="absolute top-3 right-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${difficultyColors[recipe.difficulty]}`}>
                                {difficultyLabels[recipe.difficulty]}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                        {/* Category */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
                                {categoryLabels[recipe.category]}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-orange-400 transition-colors">
                            {recipe.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-neutral-400 line-clamp-2">
                            {recipe.description}
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 pt-2 text-xs text-neutral-500">
                            {totalTime > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span>{totalTime} min</span>
                                </div>
                            )}
                            {recipe.servings && (
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" />
                                    <span>{recipe.servings} porções</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
