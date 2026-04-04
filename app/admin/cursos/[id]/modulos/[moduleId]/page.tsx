'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, GripVertical, FileDown, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/admin/image-upload';

interface LessonMaterial {
    label: string;
    filename: string;
}

interface EbookFile {
    filename: string;
    label: string;
    sizeKb: number;
}

interface Lesson {
    id: string;
    title: string;
    slug: string;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    content: string | null;
    order: number;
    isFree: boolean;
    materials: LessonMaterial[] | null;
}

interface Module {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    courseId: string;
    course: {
        title: string;
        slug: string;
    };
}

const emptyLessonForm = {
    title: '',
    slug: '',
    videoUrl: '',
    thumbnailUrl: '',
    content: '',
    isFree: false,
    materials: [] as LessonMaterial[],
};

export default function ModuloPage({
    params,
}: {
    params: Promise<{ id: string; moduleId: string }>;
}) {
    const [courseId, setCourseId] = useState<string | null>(null);
    const [moduleId, setModuleId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [module, setModule] = useState<Module | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [lessonForm, setLessonForm] = useState(emptyLessonForm);
    const [savingModuleThumbnail, setSavingModuleThumbnail] = useState(false);
    const [availableEbooks, setAvailableEbooks] = useState<EbookFile[]>([]);

    useEffect(() => {
        params.then((p) => {
            setCourseId(p.id);
            setModuleId(p.moduleId);
            fetchModule(p.moduleId);
        });
        fetch('/api/admin/ebooks')
            .then((r) => r.json())
            .then((data) => setAvailableEbooks(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

    const fetchModule = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/modulos/${id}`);
            if (response.ok) {
                const data = await response.json();
                setModule(data);
                setLessons(data.lessons || []);
            } else {
                const err = await response.json().catch(() => ({}));
                console.error(`[fetchModule] status=${response.status}`, err);
            }
        } catch (error) {
            console.error('Erro ao buscar módulo:', error);
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
        setLessonForm((prev) => ({
            ...prev,
            title,
            slug: editingLesson ? prev.slug : generateSlug(title),
        }));
    };

    // ── Module thumbnail ────────────────────────────────────────────────────────

    const handleModuleThumbnail = async (url: string) => {
        if (!moduleId || !module) return;
        setSavingModuleThumbnail(true);
        try {
            const res = await fetch(`/api/admin/modulos/${moduleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ thumbnailUrl: url }),
            });
            if (res.ok) {
                setModule((prev) => prev ? { ...prev, thumbnailUrl: url } : prev);
            }
        } catch (error) {
            console.error('Erro ao salvar thumbnail do módulo:', error);
        } finally {
            setSavingModuleThumbnail(false);
        }
    };

    const handleRemoveModuleThumbnail = async () => {
        if (!moduleId || !module) return;
        setSavingModuleThumbnail(true);
        try {
            const res = await fetch(`/api/admin/modulos/${moduleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ thumbnailUrl: null }),
            });
            if (res.ok) {
                setModule((prev) => prev ? { ...prev, thumbnailUrl: null } : prev);
            }
        } catch (error) {
            console.error('Erro ao remover thumbnail do módulo:', error);
        } finally {
            setSavingModuleThumbnail(false);
        }
    };

    // ── Lesson form ─────────────────────────────────────────────────────────────

    const handleSubmitLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!moduleId) return;

        try {
            const url = editingLesson
                ? `/api/admin/aulas/${editingLesson.id}`
                : `/api/admin/modulos/${moduleId}/aulas`;

            const method = editingLesson ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...lessonForm,
                    order: editingLesson ? editingLesson.order : lessons.length,
                }),
            });

            if (response.ok) {
                fetchModule(moduleId);
                setShowLessonForm(false);
                setEditingLesson(null);
                setLessonForm(emptyLessonForm);
            }
        } catch (error) {
            console.error('Erro ao salvar aula:', error);
        }
    };

    const handleEditLesson = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setLessonForm({
            title: lesson.title,
            slug: lesson.slug,
            videoUrl: lesson.videoUrl || '',
            thumbnailUrl: lesson.thumbnailUrl || '',
            content: lesson.content || '',
            isFree: lesson.isFree,
            materials: lesson.materials || [],
        });
        setShowLessonForm(true);
    };

    const addMaterial = (filename: string, label: string) => {
        if (lessonForm.materials.some((m) => m.filename === filename)) return;
        setLessonForm((prev) => ({
            ...prev,
            materials: [...prev.materials, { filename, label }],
        }));
    };

    const removeMaterial = (filename: string) => {
        setLessonForm((prev) => ({
            ...prev,
            materials: prev.materials.filter((m) => m.filename !== filename),
        }));
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm('Tem certeza que deseja excluir esta aula?')) return;

        try {
            const response = await fetch(`/api/admin/aulas/${lessonId}`, {
                method: 'DELETE',
            });

            if (response.ok && moduleId) {
                fetchModule(moduleId);
            }
        } catch (error) {
            console.error('Erro ao excluir aula:', error);
        }
    };

    const handleCancelForm = () => {
        setShowLessonForm(false);
        setEditingLesson(null);
        setLessonForm(emptyLessonForm);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <p className="text-muted-foreground">Carregando módulo...</p>
            </div>
        );
    }

    if (!module) {
        return <div>Módulo não encontrado</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/admin/cursos/${courseId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <p className="text-sm text-muted-foreground">{module.course.title}</p>
                    <h1 className="text-3xl font-bold">{module.title}</h1>
                </div>
            </div>

            {/* Module thumbnail */}
            <Card className="p-6">
                <div className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold">Thumbnail do Módulo</h2>
                        <p className="text-sm text-muted-foreground">
                            Imagem de capa exibida na listagem de módulos do app mobile.
                        </p>
                    </div>

                    {savingModuleThumbnail && (
                        <p className="text-sm text-muted-foreground">Salvando...</p>
                    )}

                    <ImageUpload
                        value={module.thumbnailUrl ?? undefined}
                        onChange={handleModuleThumbnail}
                        onRemove={handleRemoveModuleThumbnail}
                        className="max-w-sm"
                        aspectClassName="aspect-9/16"
                    />
                </div>
            </Card>

            {/* Lessons */}
            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Aulas</h2>
                            <p className="text-muted-foreground">
                                Gerencie as aulas deste módulo
                            </p>
                        </div>
                        {!showLessonForm && (
                            <Button onClick={() => setShowLessonForm(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Aula
                            </Button>
                        )}
                    </div>

                    {/* Lesson form */}
                    {showLessonForm && (
                        <Card className="p-6 bg-muted/30">
                            <form onSubmit={handleSubmitLesson} className="space-y-4">
                                <h3 className="font-semibold text-lg">
                                    {editingLesson ? 'Editar Aula' : 'Nova Aula'}
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Título da Aula *</Label>
                                    <Input
                                        id="title"
                                        value={lessonForm.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL) *</Label>
                                    <Input
                                        id="slug"
                                        value={lessonForm.slug}
                                        onChange={(e) =>
                                            setLessonForm((prev) => ({ ...prev, slug: e.target.value }))
                                        }
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        URL: /cursos/{module.course.slug}/{lessonForm.slug || 'slug'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="videoUrl">URL do Vídeo (Embed)</Label>
                                    <Input
                                        id="videoUrl"
                                        value={lessonForm.videoUrl}
                                        onChange={(e) =>
                                            setLessonForm((prev) => ({ ...prev, videoUrl: e.target.value }))
                                        }
                                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Use o link de embed do YouTube, Vimeo ou Panda Video
                                    </p>
                                </div>

                                {/* Lesson thumbnail */}
                                <div className="space-y-2">
                                    <Label>Thumbnail da Aula</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Imagem de capa exibida no card da aula no app mobile.
                                    </p>
                                    <ImageUpload
                                        value={lessonForm.thumbnailUrl || undefined}
                                        onChange={(url) =>
                                            setLessonForm((prev) => ({ ...prev, thumbnailUrl: url }))
                                        }
                                        onRemove={() =>
                                            setLessonForm((prev) => ({ ...prev, thumbnailUrl: '' }))
                                        }
                                        className="max-w-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Conteúdo (Rich Text/HTML)</Label>
                                    <Textarea
                                        id="content"
                                        value={lessonForm.content}
                                        onChange={(e) =>
                                            setLessonForm((prev) => ({ ...prev, content: e.target.value }))
                                        }
                                        rows={6}
                                        placeholder="Resumo ou material complementar da aula..."
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isFree"
                                        checked={lessonForm.isFree}
                                        onCheckedChange={(checked) =>
                                            setLessonForm((prev) => ({
                                                ...prev,
                                                isFree: checked as boolean,
                                            }))
                                        }
                                    />
                                    <Label htmlFor="isFree" className="font-normal">
                                        Aula gratuita (disponível como degustação)
                                    </Label>
                                </div>

                                {/* ── Materiais para download ── */}
                                <div className="space-y-3 rounded-lg border border-dashed border-border p-4">
                                    <div>
                                        <Label className="text-base font-semibold">
                                            Materiais para Download
                                        </Label>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            PDFs e arquivos que o aluno poderá baixar nesta aula (somente assinantes).
                                        </p>
                                    </div>

                                    {/* Arquivos já anexados */}
                                    {lessonForm.materials.length > 0 && (
                                        <div className="space-y-2">
                                            {lessonForm.materials.map((m) => (
                                                <div
                                                    key={m.filename}
                                                    className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/40 px-3 py-2"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <FileDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium">{m.label}</p>
                                                            <p className="truncate text-xs text-muted-foreground">{m.filename}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 shrink-0"
                                                        onClick={() => removeMaterial(m.filename)}
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Picker de arquivos disponíveis */}
                                    {availableEbooks.length > 0 ? (
                                        <div className="space-y-1.5">
                                            <p className="text-xs font-medium text-muted-foreground">
                                                Adicionar arquivo de /private/ebooks:
                                            </p>
                                            <div className="grid gap-1.5 sm:grid-cols-2">
                                                {availableEbooks.map((eb) => {
                                                    const attached = lessonForm.materials.some(
                                                        (m) => m.filename === eb.filename
                                                    );
                                                    return (
                                                        <button
                                                            key={eb.filename}
                                                            type="button"
                                                            disabled={attached}
                                                            onClick={() => addMaterial(eb.filename, eb.label)}
                                                            className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                            <div className="min-w-0">
                                                                <p className="truncate font-medium">{eb.label}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {eb.sizeKb > 1024
                                                                        ? `${(eb.sizeKb / 1024).toFixed(1)} MB`
                                                                        : `${eb.sizeKb} KB`}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">
                                            Nenhum arquivo encontrado em /private/ebooks. Coloque PDFs lá para aparecerem aqui.
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit">
                                        {editingLesson ? 'Salvar Alterações' : 'Criar Aula'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={handleCancelForm}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {/* Lesson list */}
                    {lessons.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Nenhuma aula criada ainda
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {lessons.map((lesson, index) => (
                                <Card key={lesson.id} className="p-4">
                                    <div className="flex items-center gap-4">
                                        <GripVertical className="h-5 w-5 text-muted-foreground shrink-0" />

                                        {/* Thumbnail preview */}
                                        {lesson.thumbnailUrl ? (
                                            <div className="relative h-16 w-9 shrink-0 overflow-hidden rounded border border-border">
                                                <Image
                                                    src={lesson.thumbnailUrl}
                                                    alt={lesson.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-12 w-20 shrink-0 rounded border border-dashed border-border bg-muted" />
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold truncate">
                                                    {index + 1}. {lesson.title}
                                                </h3>
                                                {lesson.isFree && (
                                                    <Badge variant="secondary">Gratuita</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {lesson.videoUrl ? 'Com vídeo' : 'Sem vídeo'} •{' '}
                                                {lesson.slug}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditLesson(lesson)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteLesson(lesson.id)}
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
