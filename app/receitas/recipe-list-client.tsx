'use client';

import { useState, useEffect } from 'react';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { FilterBar } from '@/components/content/filter-bar';
import { Button } from '@/components/ui/button';

type Recipe = {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    prepTime: number | null;
    cookTime: number | null;
    servings: number | null;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    category: string;
};

export function RecipeListClient() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const categoryOptions = [
        { value: 'all', label: 'Todas' },
        { value: 'CARNIVORE', label: 'Carnívora' },
        { value: 'LOW_CARB', label: 'Low Carb' },
        { value: 'KETO', label: 'Keto' },
        { value: 'PALEO', label: 'Paleo' },
        { value: 'FASTING', label: 'Jejum' },
    ];

    const difficultyOptions = [
        { value: 'all', label: 'Todas' },
        { value: 'EASY', label: 'Fácil' },
        { value: 'MEDIUM', label: 'Médio' },
        { value: 'HARD', label: 'Difícil' },
    ];

    useEffect(() => {
        fetchRecipes();
    }, [selectedCategory, selectedDifficulty]);

    async function fetchRecipes() {
        setLoading(true);
        const params = new URLSearchParams({
            page: '1',
            limit: '12',
            ...(selectedCategory !== 'all' && { category: selectedCategory }),
            ...(selectedDifficulty !== 'all' && { difficulty: selectedDifficulty }),
        });

        try {
            const res = await fetch(`/api/receitas?${params}`);
            const data = await res.json();
            setRecipes(data.recipes || []);
            setHasMore(data.hasMore || false);
            setPage(1);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    }

    async function loadMore() {
        const nextPage = page + 1;
        const params = new URLSearchParams({
            page: nextPage.toString(),
            limit: '12',
            ...(selectedCategory !== 'all' && { category: selectedCategory }),
            ...(selectedDifficulty !== 'all' && { difficulty: selectedDifficulty }),
        });

        try {
            const res = await fetch(`/api/receitas?${params}`);
            const data = await res.json();
            setRecipes([...recipes, ...(data.recipes || [])]);
            setHasMore(data.hasMore || false);
            setPage(nextPage);
        } catch (error) {
            console.error('Error loading more recipes:', error);
        }
    }

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <FilterBar
                    options={categoryOptions}
                    activeFilter={selectedCategory}
                    onFilterChange={setSelectedCategory}
                    label="Categoria"
                />
                <FilterBar
                    options={difficultyOptions}
                    activeFilter={selectedDifficulty}
                    onFilterChange={setSelectedDifficulty}
                    label="Dificuldade"
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-12 text-muted-foreground">Carregando receitas...</div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">Nenhuma receita encontrada.</div>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center pt-8">
                            <Button onClick={loadMore} variant="outline" size="lg">
                                Carregar Mais
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
