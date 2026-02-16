'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Eye, Trash2, FileText, Star, Lock, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    published: boolean;
    featured: boolean;
    isPremium: boolean;
    createdAt: string;
    publishedAt: string | null;
    author: {
        name: string;
    };
    category: {
        name: string;
    } | null;
}

export default function BlogAdminPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/admin/blog');
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Erro ao buscar posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este post?')) return;

        try {
            const response = await fetch(`/api/admin/blog/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post.id !== id));
            } else {
                alert('Erro ao deletar post');
            }
        } catch (error) {
            console.error('Erro ao deletar post:', error);
            alert('Erro ao deletar post');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Blog</h1>
                    <p className="text-muted-foreground mt-2">
                        Gerencie os posts do blog
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/blog/novo">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Post
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total de Posts</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{posts.length}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Publicados</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                        {posts.filter((post) => post.published).length}
                    </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Rascunhos</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                        {posts.filter((post) => !post.published).length}
                    </p>
                </div>
            </div>

            {posts.length === 0 ? (
                <Card className="p-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum post criado</h3>
                    <p className="text-muted-foreground mb-6">
                        Comece criando seu primeiro post para o blog
                    </p>
                    <Button asChild>
                        <Link href="/admin/blog/novo">
                            <Plus className="h-4 w-4 mr-2" />
                            Criar Primeiro Post
                        </Link>
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post.id} className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-xl font-semibold">
                                            {post.title}
                                        </h3>
                                        <Badge variant={post.published ? 'default' : 'secondary'}>
                                            {post.published ? 'Publicado' : 'Rascunho'}
                                        </Badge>
                                        {post.featured && (
                                            <Badge variant="outline">
                                                <Star className="h-3 w-3 mr-1" />
                                                Destaque
                                            </Badge>
                                        )}
                                        {post.isPremium && (
                                            <Badge variant="outline">
                                                <Lock className="h-3 w-3 mr-1" />
                                                Premium
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {post.category?.name || 'Sem categoria'} • Por {post.author.name} •{' '}
                                        {format(new Date(post.createdAt), "dd 'de' MMMM 'de' yyyy", {
                                            locale: ptBR,
                                        })}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/blog/${post.id}/editar`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/blog/${post.slug}`} target="_blank">
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
