'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { FilterBar } from '@/components/content/filter-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LivroPromoBanner } from '@/components/promo/livro-promo-banner';
import { JejumPromoBanner } from '@/components/promo/jejum-promo-banner';
import { Search, X } from 'lucide-react';

type BlogPost = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string | null;
    category: { name: string; slug: string } | null;
    readTime: number;
    publishedAt: string | null;
    createdAt: string;
    tags: string[];
    author: { name: string };
};

const categoryOptions = [
    { value: 'all',       label: 'Todos' },
    { value: 'NUTRITION', label: 'Nutrição' },
    { value: 'FASTING',   label: 'Jejum' },
    { value: 'TRAINING',  label: 'Treino' },
    { value: 'MINDSET',   label: 'Mindset' },
    { value: 'LIFESTYLE', label: 'Estilo de Vida' },
    { value: 'SCIENCE',   label: 'Ciência' },
];

// Promo banner appears after the 6th post card
const BANNER_AFTER = 6;

export function BlogListClient() {
    const [posts,            setPosts]            = useState<BlogPost[]>([]);
    const [loading,          setLoading]          = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [search,           setSearch]           = useState('');
    const [debouncedSearch,  setDebouncedSearch]  = useState('');
    const [page,             setPage]             = useState(1);
    const [hasMore,          setHasMore]          = useState(false);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounce search — 400 ms after user stops typing
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
                page:  pageNum.toString(),
                limit: '12',
                ...(selectedCategory !== 'all' && { category: selectedCategory }),
                ...(debouncedSearch && { search: debouncedSearch }),
            }),
        [selectedCategory, debouncedSearch]
    );

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res  = await fetch(`/api/blog?${buildParams(1)}`);
                const data = await res.json();
                setPosts(data.posts || []);
                setHasMore(data.pagination?.hasMore ?? false);
                setPage(1);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [buildParams]);

    const loadMore = async () => {
        const nextPage = page + 1;
        try {
            const res  = await fetch(`/api/blog?${buildParams(nextPage)}`);
            const data = await res.json();
            setPosts((prev) => [...prev, ...(data.posts || [])]);
            setHasMore(data.pagination?.hasMore ?? false);
            setPage(nextPage);
        } catch (err) {
            console.error('Error loading more posts:', err);
        }
    };

    const firstBatch  = posts.slice(0, BANNER_AFTER);
    const secondBatch = posts.slice(BANNER_AFTER);

    // Decide which promo to show — fasting filter or fasting-tagged results
    const showFastingPromo = selectedCategory === 'FASTING';

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
                        placeholder="Buscar artigos… ex: jejum, proteína, longevidade"
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

                {/* Category filter */}
                <FilterBar
                    options={categoryOptions}
                    activeFilter={selectedCategory}
                    onFilterChange={(val) => {
                        setSelectedCategory(val);
                        clearSearch();
                    }}
                    label="Categoria"
                />
            </div>

            {/* ── Results ─────────────────────────────────────────────── */}
            {loading ? (
                <div className="text-center py-16 text-muted-foreground">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
                    <p>Buscando artigos...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                    <p className="text-lg font-medium text-foreground">Nenhum artigo encontrado.</p>
                    {debouncedSearch && (
                        <p className="text-sm text-muted-foreground">
                            Tente outro termo ou{' '}
                            <button
                                onClick={clearSearch}
                                className="text-primary underline hover:no-underline"
                            >
                                limpar a busca
                            </button>
                            .
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    {/* First batch (up to 6 posts) */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {firstBatch.map((post) => (
                            <BlogPostCard key={post.id} post={post} />
                        ))}
                    </div>

                    {/* Inline promo — after first batch, always shown when there are results */}
                    {posts.length >= 3 && (
                        showFastingPromo ? (
                            <JejumPromoBanner variant="inline" />
                        ) : (
                            <LivroPromoBanner variant="inline" />
                        )
                    )}

                    {/* Second batch (posts 7+) */}
                    {secondBatch.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {secondBatch.map((post) => (
                                <BlogPostCard key={post.id} post={post} />
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
