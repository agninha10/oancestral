'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/admin/image-upload';
import { Badge } from '@/components/ui/badge';

interface Module {
    id: string;
    title: string;
    order: number;
    _count: {
        lessons: number;
    };
}

export default function EditarCursoPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [courseId, setCourseId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        coverImage: '',
        isPremium: true,
        published: false,
    });
    const [modules, setModules] = useState<Module[]>([]);
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState('');

    useEffect(() => {
        params.then((p) => {
            setCourseId(p.id);
            fetchCourse(p.id);
        });
    }, []);

    const fetchCourse = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/cursos/${id}`);
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    title: data.title,
                    slug: data.slug,
                    description: data.description,
                    coverImage: data.coverImage || '',
                    isPremium: data.isPremium,
                    published: data.published,
                });
                setModules(data.modules || []);
            }
        } catch (error) {
            console.error('Erro ao buscar curso:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId) return;

        setSaving(true);

        try {
            const response = await fetch(`/api/admin/cursos/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Curso atualizado com sucesso!');
            } else {
                alert('Erro ao atualizar curso');
            }
        } catch (error) {
            console.error('Erro ao atualizar curso:', error);
            alert('Erro ao atualizar curso');
        } finally {
            setSaving(false);
        }
    };

    const handleAddModule = async () => {
        if (!courseId || !newModuleTitle.trim()) return;

        try {
            const response = await fetch(`/api/admin/cursos/${courseId}/modulos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newModuleTitle,
                    order: modules.length,
                }),
            });

            if (response.ok) {
                const newModule = await response.json();
                setModules([...modules, newModule]);
                setNewModuleTitle('');
                setShowModuleForm(false);
            }
        } catch (error) {
            console.error('Erro ao criar módulo:', error);
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm('Tem certeza que deseja excluir este módulo e todas as suas aulas?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/cursos/${courseId}/modulos/${moduleId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setModules(modules.filter((m) => m.id !== moduleId));
            }
        } catch (error) {
            console.error('Erro ao excluir módulo:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Carregando curso...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/cursos">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Editar Curso</h1>
                    <p className="text-muted-foreground">{formData.title}</p>
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
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                                }
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
                                required
                            />
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
                                    Publicar curso
                                </Label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={saving}>
                                {saving ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </form>

            {/* Módulos Section */}
            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Módulos e Aulas</h2>
                            <p className="text-muted-foreground">
                                Organize o conteúdo do curso em módulos
                            </p>
                        </div>
                        <Button onClick={() => setShowModuleForm(!showModuleForm)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Módulo
                        </Button>
                    </div>

                    {showModuleForm && (
                        <Card className="p-4 bg-muted/50">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Título do módulo"
                                    value={newModuleTitle}
                                    onChange={(e) => setNewModuleTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddModule();
                                        }
                                    }}
                                />
                                <Button onClick={handleAddModule}>Criar</Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowModuleForm(false);
                                        setNewModuleTitle('');
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </Card>
                    )}

                    {modules.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Nenhum módulo criado ainda
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {modules.map((module, index) => (
                                <Card key={module.id} className="p-4">
                                    <div className="flex items-center gap-4">
                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">
                                                    {index + 1}. {module.title}
                                                </h3>
                                                <Badge variant="secondary">
                                                    {module._count.lessons} aula(s)
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/admin/cursos/${courseId}/modulos/${module.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteModule(module.id)}
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
            </Card>
        </div>
    );
}
