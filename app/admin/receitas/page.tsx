'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Recipe {
    id: string;
    title: string;
    slug: string;
    category: {
        name: string;
        slug: string;
    } | null;
    difficulty: string;
    published: boolean;
    createdAt: string;
    author: {
        name: string;
    };
    _count: {
        ingredients: number;
        instructions: number;
    };
}

export default function ReceitasAdminPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const response = await fetch('/api/admin/receitas');
            if (response.ok) {
                const data = await response.json();
                setRecipes(data);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar esta receita?')) return;

        try {
            const response = await fetch(`/api/admin/receitas/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setRecipes(recipes.filter((r) => r.id !== id));
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Erro ao deletar receita');
        }
    };

    const categoryLabels: Record<string, string> = {
        CARNIVORE: 'Carnívora',
        LOW_CARB: 'Low Carb',
        KETO: 'Keto',
        PALEO: 'Paleo',
        ANCESTRAL: 'Ancestral',
        FASTING: 'Jejum',
        OTHER: 'Outros',
    };

    const difficultyLabels: Record<string, string> = {
        EASY: 'Fácil',
        MEDIUM: 'Médio',
        HARD: 'Difícil',
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
                    <h1 className="text-3xl font-bold text-white">Receitas</h1>
                    <p className="text-neutral-400 mt-2">
                        Gerencie todas as receitas do site
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/receitas/nova">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Receita
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <p className="text-sm text-neutral-400">Total de Receitas</p>
                    <p className="text-2xl font-bold text-white mt-1">{recipes.length}</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <p className="text-sm text-neutral-400">Publicadas</p>
                    <p className="text-2xl font-bold text-white mt-1">
                        {recipes.filter((r) => r.published).length}
                    </p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <p className="text-sm text-neutral-400">Rascunhos</p>
                    <p className="text-2xl font-bold text-white mt-1">
                        {recipes.filter((r) => !r.published).length}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-950 border-b border-neutral-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                    Título
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                    Categoria
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                    Dificuldade
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {recipes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <p className="text-neutral-400">
                                            Nenhuma receita encontrada.
                                        </p>
                                        <Button asChild className="mt-4">
                                            <Link href="/admin/receitas/nova">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Criar Primeira Receita
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                recipes.map((recipe) => (
                                    <tr key={recipe.id} className="hover:bg-neutral-800/50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    {recipe.title}
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    {recipe._count.ingredients} ingredientes •{' '}
                                                    {recipe._count.instructions} passos
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {recipe.category && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500">
                                                    {recipe.category.name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-neutral-300">
                                                {difficultyLabels[recipe.difficulty]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {recipe.published ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                                    Publicado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-700 text-neutral-400">
                                                    Rascunho
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-400">
                                            {format(new Date(recipe.createdAt), 'dd/MM/yyyy', {
                                                locale: ptBR,
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Link href={`/receitas/${recipe.slug}`} target="_blank">
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Link href={`/admin/receitas/${recipe.id}/editar`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(recipe.id)}
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
