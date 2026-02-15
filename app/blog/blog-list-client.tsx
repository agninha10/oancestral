'use client';

import { useState, useEffect } from 'react';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { FilterBar } from '@/components/content/filter-bar';
import { Button } from '@/components/ui/button';

type BlogPost = {
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

export function BlogListClient() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const categoryOptions = [
        { value: 'all', label: 'Todas' },
        { value: 'NUTRITION', label: 'Nutrição' },
        { value: 'TRAINING', label: 'Treino' },
        { value: 'FASTING', label: 'Jejum' },
        { value: 'LIFESTYLE', label: 'Estilo de Vida' },
        { value: 'SCIENCE', label: 'Ciência' },
    ];

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory]);

    async function fetchPosts() {
        setLoading(true);
        const params = new URLSearchParams({
            page: '1',
            limit: '12',
            ...(selectedCategory !== 'all' && { category: selectedCategory }),
        });

        try {
            const res = await fetch(`/api/blog?${params}`);
            const data = await res.json();
            setPosts(data.posts || []);
            setHasMore(data.hasMore || false);
            setPage(1);
        } catch (error) {
            console.error('Error fetching posts:', error);
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
        });

        try {
            const res = await fetch(`/api/blog?${params}`);
            const data = await res.json();
            setPosts([...posts, ...(data.posts || [])]);
            setHasMore(data.hasMore || false);
            setPage(nextPage);
        } catch (error) {
            console.error('Error loading more posts:', error);
        }
    }

    return (
        <div className="space-y-8">
            {/* Filters */}
            <FilterBar
                options={categoryOptions}
                activeFilter={selectedCategory}
                onFilterChange={setSelectedCategory}
                label="Categoria"
            />

            {/* Grid */}
            {loading ? (
                <div className="text-center py-12 text-muted-foreground">Carregando posts...</div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">Nenhum post encontrado.</div>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <BlogPostCard key={post.id} post={post} />
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
