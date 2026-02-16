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
import { Badge } from '@/components/ui/badge';

interface Lesson {
    id: string;
    title: string;
    slug: string;
    videoUrl: string | null;
    content: string | null;
    order: number;
    isFree: boolean;
}

interface Module {
    id: string;
    title: string;
    courseId: string;
    course: {
        title: string;
        slug: string;
    };
}

export default function ModuloPage({
    params,
}: {
    params: Promise<{ id: string; moduleId: string }>;
}) {
    const router = useRouter();
    const [courseId, setCourseId] = useState<string | null>(null);
    const [moduleId, setModuleId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [module, setModule] = useState<Module | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [lessonForm, setLessonForm] = useState({
        title: '',
        slug: '',
        videoUrl: '',
        content: '',
        isFree: false,
    });

    useEffect(() => {
        params.then((p) => {
            setCourseId(p.id);
            setModuleId(p.moduleId);
            fetchModule(p.moduleId);
        });
    }, []);

    const fetchModule = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/modulos/${id}`);
            if (response.ok) {
                const data = await response.json();
                setModule(data);
                setLessons(data.lessons || []);
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...lessonForm,
                    order: editingLesson ? editingLesson.order : lessons.length,
                }),
            });

            if (response.ok) {
                fetchModule(moduleId);
                setShowLessonForm(false);
                setEditingLesson(null);
                setLessonForm({
                    title: '',
                    slug: '',
                    videoUrl: '',
                    content: '',
                    isFree: false,
                });
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
            content: lesson.content || '',
            isFree: lesson.isFree,
        });
        setShowLessonForm(true);
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm('Tem certeza que deseja excluir esta aula?')) {
            return;
        }

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
        setLessonForm({
            title: '',
            slug: '',
            videoUrl: '',
            content: '',
            isFree: false,
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Carregando módulo...</p>
            </div>
        );
    }

    if (!module) {
        return <div>Módulo não encontrado</div>;
    }

    return (
        <div className="space-y-6">
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
                                            setLessonForm((prev) => ({
                                                ...prev,
                                                slug: e.target.value,
                                            }))
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
                                            setLessonForm((prev) => ({
                                                ...prev,
                                                videoUrl: e.target.value,
                                            }))
                                        }
                                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Use o link de embed do YouTube, Vimeo ou Panda Video
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Conteúdo (Rich Text/HTML)</Label>
                                    <Textarea
                                        id="content"
                                        value={lessonForm.content}
                                        onChange={(e) =>
                                            setLessonForm((prev) => ({
                                                ...prev,
                                                content: e.target.value,
                                            }))
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

                    {lessons.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Nenhuma aula criada ainda
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {lessons.map((lesson, index) => (
                                <Card key={lesson.id} className="p-4">
                                    <div className="flex items-center gap-4">
                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">
                                                    {index + 1}. {lesson.title}
                                                </h3>
                                                {lesson.isFree && (
                                                    <Badge variant="secondary">Gratuita</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {lesson.videoUrl ? 'Com vídeo' : 'Sem vídeo'} •{' '}
                                                {lesson.slug}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
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
