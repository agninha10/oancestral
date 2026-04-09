'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/admin/image-upload';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function EditarEbookPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [ebookId, setEbookId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        subtitle: '',
        description: '',
        coverImage: '',
        pages: '',
        filename: '',
        access: 'PURCHASE' as 'PURCHASE' | 'CLAN' | 'FREE',
        priceDisplay: '',
        kiwifyUrl: '',
        buyHref: '',
        published: false,
        featured: false,
    });

    useEffect(() => {
        params.then((p) => {
            setEbookId(p.id);
            fetchEbook(p.id);
        });
    }, []);

    const fetchEbook = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/ebooks/${id}`);
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    title: data.title,
                    slug: data.slug,
                    subtitle: data.subtitle || '',
                    description: data.description,
                    coverImage: data.coverImage || '',
                    pages: data.pages || '',
                    filename: data.filename || '',
                    access: data.access,
                    priceDisplay: data.price
                        ? (data.price / 100).toFixed(2).replace('.', ',')
                        : '',
                    kiwifyUrl: data.kiwifyUrl || '',
                    buyHref: data.buyHref || '',
                    published: data.published,
                    featured: data.featured,
                });
            }
        } catch (error) {
            console.error('Erro ao buscar ebook:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ebookId) return;

        setSaving(true);
        try {
            const kiwifyProductId = formData.kiwifyUrl
                ? formData.kiwifyUrl.trim().split('/').filter(Boolean).pop() ?? null
                : null;

            const price = formData.priceDisplay
                ? Math.round(parseFloat(formData.priceDisplay.replace(',', '.')) * 100)
                : null;

            const response = await fetch(`/api/admin/ebooks/${ebookId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price,
                    kiwifyUrl: formData.kiwifyUrl || null,
                    kiwifyProductId,
                    buyHref: formData.buyHref || null,
                }),
            });

            if (response.ok) {
                alert('Ebook atualizado com sucesso!');
            } else {
                alert('Erro ao atualizar ebook');
            }
        } catch (error) {
            console.error('Erro ao atualizar ebook:', error);
            alert('Erro ao atualizar ebook');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!ebookId) return;
        if (!confirm('Tem certeza que deseja excluir este ebook? Esta ação não pode ser desfeita.')) return;

        try {
            const response = await fetch(`/api/admin/ebooks/${ebookId}`, { method: 'DELETE' });
            if (response.ok) {
                router.push('/admin/ebooks');
            } else {
                alert('Erro ao excluir ebook');
            }
        } catch (error) {
            console.error('Erro ao excluir ebook:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Carregando ebook...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/ebooks">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">Editar Ebook</h1>
                    <p className="text-muted-foreground">{formData.title}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-6">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subtitle">Subtítulo</Label>
                            <Input
                                id="subtitle"
                                value={formData.subtitle}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                                }
                                placeholder="Ex: +100 Receitas Ancestrais"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (chave do produto)</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                                }
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Usado como ID do produto nas transações. Não altere depois de ter vendas.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                                }
                                rows={4}
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
                                onRemove={() =>
                                    setFormData((prev) => ({ ...prev, coverImage: '' }))
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pages">Páginas</Label>
                                <Input
                                    id="pages"
                                    value={formData.pages}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, pages: e.target.value }))
                                    }
                                    placeholder="Ex: +180 páginas"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="filename">Nome do arquivo PDF</Label>
                                <Input
                                    id="filename"
                                    value={formData.filename}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, filename: e.target.value }))
                                    }
                                    placeholder="Ex: livro-ancestral.pdf"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Arquivo em <code className="font-mono">/privates/</code>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="access">Tipo de Acesso</Label>
                            <Select
                                value={formData.access}
                                onValueChange={(v) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        access: v as 'PURCHASE' | 'CLAN' | 'FREE',
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PURCHASE">Compra (transação PAID)</SelectItem>
                                    <SelectItem value="CLAN">Clã (assinatura ativa)</SelectItem>
                                    <SelectItem value="FREE">Gratuito (todos os logados)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
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
                                    Publicado
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
                                    Destaque
                                </Label>
                            </div>
                        </div>

                        {/* Vendas & Pagamento */}
                        {formData.access === 'PURCHASE' && (
                            <div className="border-t pt-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                                    <h2 className="text-lg font-semibold">Vendas &amp; Pagamento</h2>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Preço (R$)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                            R$
                                        </span>
                                        <Input
                                            id="price"
                                            className="pl-9"
                                            value={formData.priceDisplay}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9,]/g, '');
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    priceDisplay: val,
                                                }));
                                            }}
                                            placeholder="49,00"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kiwifyUrl">URL de Checkout Kiwify</Label>
                                    <Input
                                        id="kiwifyUrl"
                                        value={formData.kiwifyUrl}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                kiwifyUrl: e.target.value.trim(),
                                            }))
                                        }
                                        placeholder="https://pay.kiwify.com.br/XXXXX"
                                    />
                                    {formData.kiwifyUrl && (
                                        <p className="text-xs text-muted-foreground">
                                            ID do produto (webhook):{' '}
                                            <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">
                                                {formData.kiwifyUrl
                                                    .trim()
                                                    .split('/')
                                                    .filter(Boolean)
                                                    .pop() ?? '—'}
                                            </code>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="buyHref">URL de Compra Customizada</Label>
                                    <Input
                                        id="buyHref"
                                        value={formData.buyHref}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                buyHref: e.target.value.trim(),
                                            }))
                                        }
                                        placeholder="Ex: /livro-de-receitas-ancestrais"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={saving}>
                                {saving ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
}
