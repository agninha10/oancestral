'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/admin/cursos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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
