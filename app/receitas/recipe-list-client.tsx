'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { FilterBar } from '@/components/content/filter-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LivroPromoBanner } from '@/components/promo/livro-promo-banner';
import { Search, X } from 'lucide-react';

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

// Promo banner appears after the 6th recipe card
const BANNER_AFTER = 6;

export function RecipeListClient() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounce search — 400ms after user stops typing
    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 400);
    };

    const clearSearch = () => {
        setSearch('');
        setDebouncedSearch('');
    };

    const buildParams = useCallback(
        (pageNum: number) =>
            new URLSearchParams({
                page: pageNum.toString(),
                limit: '12',
                ...(selectedCategory !== 'all' && { category: selectedCategory }),
                ...(selectedDifficulty !== 'all' && { difficulty: selectedDifficulty }),
                ...(debouncedSearch && { search: debouncedSearch }),
            }),
        [selectedCategory, selectedDifficulty, debouncedSearch]
    );

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/receitas?${buildParams(1)}`);
                const data = await res.json();
                setRecipes(data.recipes || []);
                setHasMore(data.pagination?.hasMore ?? data.hasMore ?? false);
                setPage(1);
            } catch (err) {
                console.error('Error fetching recipes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, [buildParams]);

    const loadMore = async () => {
        const nextPage = page + 1;
        try {
            const res = await fetch(`/api/receitas?${buildParams(nextPage)}`);
            const data = await res.json();
            setRecipes((prev) => [...prev, ...(data.recipes || [])]);
            setHasMore(data.pagination?.hasMore ?? data.hasMore ?? false);
            setPage(nextPage);
        } catch (err) {
            console.error('Error loading more recipes:', err);
        }
    };

    const firstBatch  = recipes.slice(0, BANNER_AFTER);
    const secondBatch = recipes.slice(BANNER_AFTER);

    return (
        <div className="space-y-8">
            {/* ── Search + Filters ────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
                {/* Search bar */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Buscar receitas... ex: frango, low carb, cetogênica"
                        className="pl-10 pr-10 h-12 text-base rounded-xl border-border bg-muted/50 focus-visible:ring-primary"
                    />
                    {search && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Limpar busca"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
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
            </div>

            {/* ── Results ─────────────────────────────────────────────── */}
            {loading ? (
                <div className="text-center py-16 text-muted-foreground">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
                    <p>Buscando receitas...</p>
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                    <p className="text-lg font-medium text-foreground">Nenhuma receita encontrada.</p>
                    {debouncedSearch && (
                        <p className="text-sm text-muted-foreground">
                            Tente outro termo ou{' '}
                            <button onClick={clearSearch} className="text-primary underline hover:no-underline">
                                limpar a busca
                            </button>
                            .
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    {/* First batch */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {firstBatch.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>

                    {/* Promo banner — aparece entre os blocos de receitas */}
                    {recipes.length >= BANNER_AFTER && (
                        <LivroPromoBanner variant="inline" />
                    )}

                    {/* Second batch */}
                    {secondBatch.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {secondBatch.map((recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>
                    )}

                    {hasMore && (
                        <div className="flex justify-center pt-2">
                            <Button onClick={loadMore} variant="outline" size="lg">
                                Carregar Mais
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
