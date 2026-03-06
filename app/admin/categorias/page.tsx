'use client';

import { useEffect, useState } from 'react';
import {
    Plus,
    Pencil,
    Trash2,
    Check,
    X,
    FolderTree,
    FileText,
    ChefHat,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    type: 'BLOG' | 'RECIPE';
    _count: {
        blogPosts: number;
        recipes: number;
    };
}

function CategoryForm({
    type,
    onCreated,
}: {
    type: 'BLOG' | 'RECIPE';
    onCreated: (cat: Category) => void;
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch('/api/admin/categorias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type, description }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || 'Erro ao criar categoria');
        } else {
            onCreated(data);
            setName('');
            setDescription('');
        }

        setLoading(false);
    };

    return (
        <Card className="p-5 border-dashed">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4 text-orange-500" />
                Nova Categoria
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label htmlFor={`name-${type}`}>Nome *</Label>
                        <Input
                            id={`name-${type}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Nutrição Cetogênica"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`desc-${type}`}>Descrição (opcional)</Label>
                        <Input
                            id={`desc-${type}`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Breve descrição da categoria"
                        />
                    </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" size="sm" disabled={loading}>
                    <Plus className="h-4 w-4 mr-1" />
                    {loading ? 'Criando...' : 'Criar Categoria'}
                </Button>
            </form>
        </Card>
    );
}

function CategoryRow({
    category,
    onUpdated,
    onDeleted,
}: {
    category: Category;
    onUpdated: (cat: Category) => void;
    onDeleted: (id: string) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const itemCount =
        category.type === 'BLOG'
            ? category._count.blogPosts
            : category._count.recipes;

    const saveEdit = async () => {
        setLoading(true);
        setError('');

        const res = await fetch(`/api/admin/categorias/${category.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || 'Erro ao salvar');
        } else {
            onUpdated(data);
            setEditing(false);
        }

        setLoading(false);
    };

    const cancelEdit = () => {
        setName(category.name);
        setDescription(category.description || '');
        setError('');
        setEditing(false);
    };

    const handleDelete = async () => {
        const res = await fetch(`/api/admin/categorias/${category.id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            onDeleted(category.id);
        } else {
            const data = await res.json();
            alert(data.error || 'Erro ao deletar');
        }
    };

    return (
        <div className="flex items-start gap-3 py-3 border-b last:border-0">
            {editing ? (
                <div className="flex-1 space-y-2">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                    />
                    <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descrição (opcional)"
                        className="h-8 text-sm"
                    />
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="default"
                            onClick={saveEdit}
                            disabled={loading}
                            className="h-7 text-xs"
                        >
                            <Check className="h-3 w-3 mr-1" />
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEdit}
                            className="h-7 text-xs"
                        >
                            <X className="h-3 w-3 mr-1" />
                            Cancelar
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{category.name}</span>
                            <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {category.slug}
                            </code>
                            <Badge variant="secondary" className="text-xs">
                                {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                            </Badge>
                        </div>
                        {category.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {category.description}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => setEditing(true)}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Deletar categoria?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        A categoria <strong>{category.name}</strong> será
                                        permanentemente removida. Esta ação não pode ser desfeita.
                                        {itemCount > 0 && (
                                            <span className="block mt-2 text-destructive font-medium">
                                                ⚠ Esta categoria possui {itemCount} item(ns) vinculado(s)
                                                e não pode ser deletada.
                                            </span>
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        disabled={itemCount > 0}
                                        onClick={handleDelete}
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
                                        Deletar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </>
            )}
        </div>
    );
}

function CategoryList({ type }: { type: 'BLOG' | 'RECIPE' }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/admin/categorias?type=${type}`)
            .then((r) => r.json())
            .then((data) => {
                setCategories(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, [type]);

    const handleCreated = (cat: Category) =>
        setCategories((prev) => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)));

    const handleUpdated = (cat: Category) =>
        setCategories((prev) =>
            prev
                .map((c) => (c.id === cat.id ? cat : c))
                .sort((a, b) => a.name.localeCompare(b.name))
        );

    const handleDeleted = (id: string) =>
        setCategories((prev) => prev.filter((c) => c.id !== id));

    return (
        <div className="space-y-4">
            <CategoryForm type={type} onCreated={handleCreated} />

            <Card className="p-5">
                <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
                    {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'} cadastradas
                </h3>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                    </div>
                ) : categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                        Nenhuma categoria cadastrada. Crie a primeira acima.
                    </p>
                ) : (
                    <div>
                        {categories.map((cat) => (
                            <CategoryRow
                                key={cat.id}
                                category={cat}
                                onUpdated={handleUpdated}
                                onDeleted={handleDeleted}
                            />
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}

export default function CategoriasAdminPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <FolderTree className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Categorias</h1>
                    <p className="text-muted-foreground">
                        Gerencie as categorias de blog e receitas
                    </p>
                </div>
            </div>

            <Tabs defaultValue="blog">
                <TabsList>
                    <TabsTrigger value="blog" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Blog
                    </TabsTrigger>
                    <TabsTrigger value="receitas" className="gap-2">
                        <ChefHat className="h-4 w-4" />
                        Receitas
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="blog" className="mt-6">
                    <CategoryList type="BLOG" />
                </TabsContent>

                <TabsContent value="receitas" className="mt-6">
                    <CategoryList type="RECIPE" />
                </TabsContent>
            </Tabs>
        </div>
    );
}
