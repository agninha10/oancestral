'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/admin/image-upload';

export default function NovoCursoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        coverImage: '',
        isPremium: true,
        published: false,
        metaTitle: '',
        metaDescription: '',
        ogImage: '',
        priceDisplay: '',   // R$ formatado, ex: "49,00"
        kiwifyUrl: '',
        waitlistEnabled: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Extrai ID do produto Kiwify a partir da URL (último segmento)
            const kiwifyProductId = formData.kiwifyUrl
                ? formData.kiwifyUrl.trim().split('/').filter(Boolean).pop() ?? null
                : null;

            // Converte "49,00" → 4900 centavos
            const price = formData.priceDisplay
                ? Math.round(parseFloat(formData.priceDisplay.replace(',', '.')) * 100)
                : null;

            const response = await fetch('/api/admin/cursos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    price,
                    kiwifyUrl: formData.kiwifyUrl || null,
                    kiwifyProductId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                router.push(`/admin/cursos/${data.id}`);
            } else {
                alert('Erro ao criar curso');
            }
        } catch (error) {
            console.error('Erro ao criar curso:', error);
            alert('Erro ao criar curso');
        } finally {
            setLoading(false);
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

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/cursos">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Novo Curso</h1>
                    <p className="text-muted-foreground">
                        Crie um novo curso para sua plataforma
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="p-6">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título do Curso *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Ex: Fundamentos da Nutrição Ancestral"
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
                                placeholder="fundamentos-nutricao-ancestral"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                URL: /cursos/{formData.slug || 'slug-do-curso'}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Descreva o que os alunos aprenderão neste curso..."
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

                        <div className="space-y-4">
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
                                    Curso Premium (requer assinatura ativa)
                                </Label>
                            </div>

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
                                    Publicar curso imediatamente
                                </Label>
                            </div>
                        </div>

                        {/* SEO & Descoberta */}
                        <div className="border-t pt-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Search className="h-5 w-5 text-muted-foreground" />
                                <h2 className="text-lg font-semibold">SEO &amp; Descoberta</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Otimize como este curso aparece nos mecanismos de busca e nas redes sociais.
                            </p>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="metaTitle">Meta Título</Label>
                                    <span className={`text-xs ${formData.metaTitle.length > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                        {formData.metaTitle.length}/60
                                    </span>
                                </div>
                                <Input
                                    id="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
                                    }
                                    placeholder={formData.title || 'Título para o Google (máx. 60 chars)'}
                                    maxLength={80}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Se vazio, será usado o título do curso. Recomendado: até 60 caracteres.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="metaDescription">Meta Descrição</Label>
                                    <span className={`text-xs ${formData.metaDescription.length > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                        {formData.metaDescription.length}/160
                                    </span>
                                </div>
                                <Textarea
                                    id="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))
                                    }
                                    placeholder="Resumo atraente para o snippet do Google (máx. 160 chars)"
                                    rows={3}
                                    maxLength={200}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Recomendado: até 160 caracteres.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ogImage">Imagem OG (Open Graph)</Label>
                                <Input
                                    id="ogImage"
                                    value={formData.ogImage}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, ogImage: e.target.value }))
                                    }
                                    placeholder="https://... (URL da imagem para compartilhamento social)"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Imagem exibida ao compartilhar no WhatsApp, Facebook etc. Se vazio, usa a capa do curso. Tamanho ideal: 1200×630px.
                                </p>
                            </div>

                            {/* Preview do slug */}
                            <div className="rounded-md bg-muted p-3 text-sm">
                                <span className="font-medium text-muted-foreground">URL pública: </span>
                                <span className="text-foreground">
                                    oancestral.com.br/cursos/<strong>{formData.slug || 'slug-do-curso'}</strong>
                                </span>
                            </div>
                        </div>

                        {/* Vendas & Pagamento */}
                        <div className="border-t pt-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                                <h2 className="text-lg font-semibold">Vendas &amp; Pagamento</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Configure o preço e o link de checkout do Kiwify. Deixe em branco para cursos incluídos na assinatura.
                            </p>

                            <div className="space-y-2">
                                <Label htmlFor="price">Preço (R$)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                                    <Input
                                        id="price"
                                        className="pl-9"
                                        value={formData.priceDisplay}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9,]/g, '');
                                            setFormData((prev) => ({ ...prev, priceDisplay: val }));
                                        }}
                                        placeholder="49,00"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Deixe vazio se o acesso for por assinatura.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kiwifyUrl">URL de Checkout Kiwify</Label>
                                <Input
                                    id="kiwifyUrl"
                                    value={formData.kiwifyUrl}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, kiwifyUrl: e.target.value.trim() }))
                                    }
                                    placeholder="https://pay.kiwify.com.br/XXXXX"
                                />
                                {formData.kiwifyUrl && (
                                    <p className="text-xs text-muted-foreground">
                                        ID do produto (webhook):{' '}
                                        <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">
                                            {formData.kiwifyUrl.trim().split('/').filter(Boolean).pop() ?? '—'}
                                        </code>
                                    </p>
                                )}
                            </div>

                            <div className="flex items-start space-x-3 rounded-lg border p-4">
                                <Checkbox
                                    id="waitlistEnabled"
                                    checked={formData.waitlistEnabled}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({ ...prev, waitlistEnabled: checked as boolean }))
                                    }
                                />
                                <div className="space-y-1">
                                    <Label htmlFor="waitlistEnabled" className="font-medium cursor-pointer">
                                        Ativar Lista de Espera
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Exibe um formulário na página do curso para capturar leads interessados antes do lançamento. Você poderá exportar a lista depois.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Criando...' : 'Criar Curso'}
                            </Button>
                            <Link href="/admin/cursos">
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
}
