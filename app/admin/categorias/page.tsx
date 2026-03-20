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
    Swords,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

// ─── Blog / Recipe types & components ─────────────────────────────────────────

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    type: 'BLOG' | 'RECIPE';
    _count: { blogPosts: number; recipes: number };
}

function CategoryForm({ type, onCreated }: { type: 'BLOG' | 'RECIPE'; onCreated: (cat: Category) => void }) {
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
        if (!res.ok) { setError(data.error || 'Erro ao criar categoria'); }
        else { onCreated(data); setName(''); setDescription(''); }
        setLoading(false);
    };

    return (
        <Card className="p-5 border-dashed">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4 text-orange-500" /> Nova Categoria
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label htmlFor={`name-${type}`}>Nome *</Label>
                        <Input id={`name-${type}`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Nutrição Cetogênica" required />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`desc-${type}`}>Descrição (opcional)</Label>
                        <Input id={`desc-${type}`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descrição" />
                    </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" size="sm" disabled={loading}>
                    <Plus className="h-4 w-4 mr-1" />{loading ? 'Criando...' : 'Criar Categoria'}
                </Button>
            </form>
        </Card>
    );
}

function CategoryRow({ category, onUpdated, onDeleted }: { category: Category; onUpdated: (cat: Category) => void; onDeleted: (id: string) => void }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const itemCount = category.type === 'BLOG' ? category._count.blogPosts : category._count.recipes;

    const saveEdit = async () => {
        setLoading(true); setError('');
        const res = await fetch(`/api/admin/categorias/${category.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Erro ao salvar'); }
        else { onUpdated(data); setEditing(false); }
        setLoading(false);
    };

    const handleDelete = async () => {
        const res = await fetch(`/api/admin/categorias/${category.id}`, { method: 'DELETE' });
        if (res.ok) { onDeleted(category.id); }
        else { const data = await res.json(); alert(data.error || 'Erro ao deletar'); }
    };

    return (
        <div className="flex items-start gap-3 py-3 border-b last:border-0">
            {editing ? (
                <div className="flex-1 space-y-2">
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-sm" autoFocus />
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição (opcional)" className="h-8 text-sm" />
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit} disabled={loading} className="h-7 text-xs"><Check className="h-3 w-3 mr-1" />{loading ? 'Salvando...' : 'Salvar'}</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setName(category.name); setDescription(category.description || ''); setEditing(false); }} className="h-7 text-xs"><X className="h-3 w-3 mr-1" />Cancelar</Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{category.name}</span>
                            <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{category.slug}</code>
                            <Badge variant="secondary" className="text-xs">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</Badge>
                        </div>
                        {category.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{category.description}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(true)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Deletar categoria?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        A categoria <strong>{category.name}</strong> será permanentemente removida.
                                        {itemCount > 0 && <span className="block mt-2 text-destructive font-medium">⚠ Esta categoria possui {itemCount} item(ns) e não pode ser deletada.</span>}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction disabled={itemCount > 0} onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Deletar</AlertDialogAction>
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
        fetch(`/api/admin/categorias?type=${type}`).then((r) => r.json()).then((data) => { setCategories(Array.isArray(data) ? data : []); setLoading(false); });
    }, [type]);

    return (
        <div className="space-y-4">
            <CategoryForm type={type} onCreated={(cat) => setCategories((prev) => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)))} />
            <Card className="p-5">
                <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">{categories.length} {categories.length === 1 ? 'categoria' : 'categorias'} cadastradas</h3>
                {loading ? <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" /></div>
                    : categories.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">Nenhuma categoria cadastrada. Crie a primeira acima.</p>
                    : categories.map((cat) => <CategoryRow key={cat.id} category={cat} onUpdated={(c) => setCategories((prev) => prev.map((x) => x.id === c.id ? c : x).sort((a, b) => a.name.localeCompare(b.name)))} onDeleted={(id) => setCategories((prev) => prev.filter((c) => c.id !== id))} />)}
            </Card>
        </div>
    );
}

// ─── Forum category types & components ────────────────────────────────────────

interface ForumCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    order: number;
    _count: { posts: number };
}

const EMOJI_PRESETS = ['🔥', '⚡', '🏋️', '🧠', '💬', '🗡️', '🌿', '🥩', '📖', '🎯', '💪', '🧘'];

function ForumCategoryForm({ onCreated }: { onCreated: (cat: ForumCategory) => void }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('💬');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        const res = await fetch('/api/admin/forum-categorias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, icon }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Erro ao criar categoria'); }
        else { onCreated(data); setName(''); setDescription(''); setIcon('💬'); }
        setLoading(false);
    };

    return (
        <Card className="p-5 border-dashed">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4 text-orange-500" /> Nova Categoria do Fórum
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label htmlFor="forum-name">Nome *</Label>
                        <Input id="forum-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Treino & Soberania" required />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="forum-desc">Descrição</Label>
                        <Input id="forum-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descrição da categoria" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Ícone (emoji)</Label>
                    <div className="flex flex-wrap gap-2">
                        {EMOJI_PRESETS.map((e) => (
                            <button key={e} type="button" onClick={() => setIcon(e)}
                                className={`h-9 w-9 rounded-lg text-lg transition-colors border ${icon === e ? 'border-orange-500 bg-orange-500/10' : 'border-border bg-muted hover:border-orange-400'}`}>
                                {e}
                            </button>
                        ))}
                        <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🔥" className="w-20 text-center" maxLength={4} />
                    </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" size="sm" disabled={loading || !name.trim()}>
                    <Plus className="h-4 w-4 mr-1" />{loading ? 'Criando...' : 'Criar Categoria'}
                </Button>
            </form>
        </Card>
    );
}

function ForumCategoryRow({ category, onUpdated, onDeleted }: { category: ForumCategory; onUpdated: (cat: ForumCategory) => void; onDeleted: (id: string) => void }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);
    const [icon, setIcon] = useState(category.icon);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const postCount = category._count.posts;

    const saveEdit = async () => {
        setLoading(true); setError('');
        const res = await fetch(`/api/admin/forum-categorias/${category.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, icon }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Erro ao salvar'); }
        else { onUpdated(data); setEditing(false); }
        setLoading(false);
    };

    const handleDelete = async () => {
        const res = await fetch(`/api/admin/forum-categorias/${category.id}`, { method: 'DELETE' });
        if (res.ok || res.status === 204) { onDeleted(category.id); }
        else { const data = await res.json(); alert(data.error || 'Erro ao deletar'); }
    };

    return (
        <div className="flex items-start gap-3 py-3 border-b last:border-0">
            {editing ? (
                <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                        <Input value={icon} onChange={(e) => setIcon(e.target.value)} className="h-8 w-16 text-center text-lg" maxLength={4} />
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-sm flex-1" autoFocus />
                    </div>
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" className="h-8 text-sm" />
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit} disabled={loading} className="h-7 text-xs"><Check className="h-3 w-3 mr-1" />{loading ? 'Salvando...' : 'Salvar'}</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setName(category.name); setDescription(category.description); setIcon(category.icon); setEditing(false); }} className="h-7 text-xs"><X className="h-3 w-3 mr-1" />Cancelar</Button>
                    </div>
                </div>
            ) : (
                <>
                    <span className="text-2xl mt-0.5">{category.icon}</span>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{category.name}</span>
                            <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{category.slug}</code>
                            <Badge variant="secondary" className="text-xs">{postCount} {postCount === 1 ? 'post' : 'posts'}</Badge>
                        </div>
                        {category.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{category.description}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(true)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Deletar categoria?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <strong>{category.name}</strong> será permanentemente removida.
                                        {postCount > 0 && <span className="block mt-2 text-destructive font-medium">⚠ Esta categoria possui {postCount} post(s) e não pode ser deletada.</span>}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction disabled={postCount > 0} onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Deletar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </>
            )}
        </div>
    );
}

function ForumCategoryList() {
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/forum-categorias').then((r) => r.json()).then((data) => { setCategories(Array.isArray(data) ? data : []); setLoading(false); });
    }, []);

    return (
        <div className="space-y-4">
            <ForumCategoryForm onCreated={(cat) => setCategories((prev) => [...prev, cat])} />
            <Card className="p-5">
                <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">{categories.length} {categories.length === 1 ? 'categoria' : 'categorias'} cadastradas</h3>
                {loading ? <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" /></div>
                    : categories.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">Nenhuma categoria cadastrada. Crie a primeira acima.</p>
                    : categories.map((cat) => (
                        <ForumCategoryRow key={cat.id} category={cat}
                            onUpdated={(c) => setCategories((prev) => prev.map((x) => x.id === c.id ? c : x))}
                            onDeleted={(id) => setCategories((prev) => prev.filter((c) => c.id !== id))}
                        />
                    ))}
            </Card>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CategoriasAdminPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <FolderTree className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Categorias</h1>
                    <p className="text-muted-foreground">Gerencie as categorias de blog, receitas e fórum</p>
                </div>
            </div>

            <Tabs defaultValue="blog">
                <TabsList>
                    <TabsTrigger value="blog" className="gap-2">
                        <FileText className="h-4 w-4" /> Blog
                    </TabsTrigger>
                    <TabsTrigger value="receitas" className="gap-2">
                        <ChefHat className="h-4 w-4" /> Receitas
                    </TabsTrigger>
                    <TabsTrigger value="forum" className="gap-2">
                        <Swords className="h-4 w-4" /> Fórum
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="blog" className="mt-6"><CategoryList type="BLOG" /></TabsContent>
                <TabsContent value="receitas" className="mt-6"><CategoryList type="RECIPE" /></TabsContent>
                <TabsContent value="forum" className="mt-6"><ForumCategoryList /></TabsContent>
            </Tabs>
        </div>
    );
}
