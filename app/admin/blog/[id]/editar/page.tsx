'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { ImageUpload } from '@/components/admin/image-upload';

interface Category {
    id: string;
    name: string;
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    categoryId: string | null;
    tags: string[];
    readTime: number;
    published: boolean;
    featured: boolean;
    isPremium: boolean;
}

export default function EditarPostBlogPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params?.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        categoryId: '',
        tags: '',
        readTime: 5,
        published: false,
        featured: false,
        isPremium: false,
    });

    useEffect(() => {
        fetchPost();
        fetchCategories();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/admin/blog/${postId}`);
            if (response.ok) {
                const post: BlogPost = await response.json();
                setFormData({
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt,
                    content: post.content,
                    coverImage: post.coverImage || '',
                    categoryId: post.categoryId || '',
                    tags: post.tags.join(', '),
                    readTime: post.readTime,
                    published: post.published,
                    featured: post.featured,
                    isPremium: post.isPremium,
                });
            } else {
                alert('Erro ao carregar post');
                router.push('/admin/blog');
            }
        } catch (error) {
            console.error('Erro ao carregar post:', error);
            alert('Erro ao carregar post');
            router.push('/admin/blog');
        } finally {
            setFetching(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categorias?type=BLOG');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (title: string) => {
        setFormData((prev) => ({
            ...prev,
            title,
            slug: generateSlug(title),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const tags = formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);

        try {
            const response = await fetch(`/api/admin/blog/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    tags,
                    readTime: Number(formData.readTime),
                    categoryId: formData.categoryId || null,
                }),
            });

            if (response.ok) {
                router.push('/admin/blog');
            } else {
                alert('Erro ao atualizar post');
            }
        } catch (error) {
            console.error('Erro ao atualizar post:', error);
            alert('Erro ao atualizar post');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/blog">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editar Post</h1>
                    <p className="text-muted-foreground">
                        Edite o artigo do blog
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <Card className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Informações Básicas</h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Ex: Como o jejum muda seu metabolismo"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                                }
                                placeholder="como-o-jejum-muda-seu-metabolismo"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                URL: /blog/{formData.slug || 'slug-do-post'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Resumo *</Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                            }
                            placeholder="Resumo curto para SEO e listagem do blog"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Imagem de Capa</Label>
                        <ImageUpload
                            value={formData.coverImage}
                            onChange={(url) =>
                                setFormData((prev) => ({ ...prev, coverImage: url }))
                            }
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, categoryId: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="readTime">Tempo de Leitura (min)</Label>
                            <Input
                                id="readTime"
                                type="number"
                                min={1}
                                value={formData.readTime}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        readTime: Number(e.target.value),
                                    }))
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                        <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, tags: e.target.value }))
                            }
                            placeholder="jejum, metabolismo, saude"
                        />
                    </div>
                </Card>

                {/* Content */}
                <Card className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Conteúdo</h2>
                    <RichTextEditor
                        content={formData.content}
                        onChange={(html) =>
                            setFormData((prev) => ({ ...prev, content: html }))
                        }
                        placeholder="Escreva o conteúdo do post aqui..."
                    />
                </Card>

                {/* Settings */}
                <Card className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Configurações</h2>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    published: checked as boolean,
                                }))
                            }
                        />
                        <Label htmlFor="published" className="font-normal">
                            Publicar post
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="featured"
                            checked={formData.featured}
                            onCheckedChange={(checked) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    featured: checked as boolean,
                                }))
                            }
                        />
                        <Label htmlFor="featured" className="font-normal">
                            Destacar este post
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isPremium"
                            checked={formData.isPremium}
                            onCheckedChange={(checked) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    isPremium: checked as boolean,
                                }))
                            }
                        />
                        <Label htmlFor="isPremium" className="font-normal">
                            Post Premium (requer assinatura ativa)
                        </Label>
                    </div>
                </Card>

                <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                    <Link href="/admin/blog">
                        <Button type="button" variant="outline">
                            Cancelar
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
