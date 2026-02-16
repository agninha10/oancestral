'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { ImageUpload } from '@/components/admin/image-upload';

const recipeSchema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    slug: z.string().min(3, 'Slug deve ter no mínimo 3 caracteres'),
    description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
    coverImage: z.string().url('URL da imagem inválida').optional(),
    prepTime: z.number().min(0, 'Tempo de preparo deve ser positivo'),
    cookTime: z.number().min(0, 'Tempo de cozimento deve ser positivo'),
    servings: z.number().min(1, 'Deve servir pelo menos 1 pessoa'),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
    categoryId: z.string().min(1, 'Selecione uma categoria'),
    cuisine: z.string().optional(),
    calories: z.any().transform((val) => {
        if (val === '' || val === null || val === undefined) return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
    }),
    protein: z.any().transform((val) => {
        if (val === '' || val === null || val === undefined) return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
    }),
    fat: z.any().transform((val) => {
        if (val === '' || val === null || val === undefined) return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
    }),
    carbs: z.any().transform((val) => {
        if (val === '' || val === null || val === undefined) return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
    }),
    ingredients: z.array(
        z.object({
            amount: z.string().min(1, 'Quantidade obrigatória'),
            name: z.string().min(1, 'Nome do ingrediente obrigatório'),
        })
    ).min(1, 'Adicione pelo menos 1 ingrediente'),
    instructions: z.array(
        z.object({
            content: z.string().min(1, 'Instrução obrigatória'),
        })
    ).min(1, 'Adicione pelo menos 1 passo'),
    content: z.string().optional(),
    published: z.boolean(),
    featured: z.boolean(),
    isPremium: z.boolean(),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface Category {
    id: string;
    name: string;
}

export default function NovaReceitaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categorias?type=RECIPE');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(recipeSchema),
        defaultValues: {
            ingredients: [{ amount: '', name: '' }],
            instructions: [{ content: '' }],
            published: false,
            featured: false,
            isPremium: false,
            prepTime: 0,
            cookTime: 0,
            servings: 1,
            calories: null,
            protein: null,
            fat: null,
            carbs: null,
            cuisine: '',
        },
    });

    const {
        fields: ingredientFields,
        append: appendIngredient,
        remove: removeIngredient,
    } = useFieldArray({
        control,
        name: 'ingredients',
    });

    const {
        fields: instructionFields,
        append: appendInstruction,
        remove: removeInstruction,
    } = useFieldArray({
        control,
        name: 'instructions',
    });

    // Auto-generate slug from title
    const title = watch('title');
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const onSubmit = async (data: RecipeFormData) => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/receitas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar receita');
            }

            router.push('/admin/receitas');
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao criar receita. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Nova Receita</h1>
                <p className="text-muted-foreground mt-2">
                    Crie uma nova receita ancestral para o site
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Informações Básicas</h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                {...register('title')}
                                onBlur={(e) => {
                                    const slug = generateSlug(e.target.value);
                                    setValue('slug', slug);
                                }}
                                placeholder="Ex: Bife com Manteiga de Ervas"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                {...register('slug')}
                                placeholder="bife-com-manteiga-de-ervas"
                            />
                            {errors.slug && (
                                <p className="text-sm text-red-500">{errors.slug.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição *</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            rows={3}
                            placeholder="Breve descrição da receita..."
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Imagem de Capa</Label>
                        <ImageUpload
                            value={watch('coverImage')}
                            onChange={(url) => setValue('coverImage', url)}
                            onRemove={() => setValue('coverImage', '')}
                        />
                    </div>
                </div>

                {/* Recipe Details */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Detalhes da Receita</h2>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="prepTime">Tempo de Preparo (min) *</Label>
                            <Input
                                id="prepTime"
                                type="number"
                                {...register('prepTime', { valueAsNumber: true })}
                                placeholder="30"
                            />
                            {errors.prepTime && (
                                <p className="text-sm text-red-500">{errors.prepTime.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cookTime">Tempo de Cozimento (min) *</Label>
                            <Input
                                id="cookTime"
                                type="number"
                                {...register('cookTime', { valueAsNumber: true })}
                                placeholder="20"
                            />
                            {errors.cookTime && (
                                <p className="text-sm text-red-500">{errors.cookTime.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="servings">Porções *</Label>
                            <Input
                                id="servings"
                                type="number"
                                {...register('servings', { valueAsNumber: true })}
                                placeholder="4"
                            />
                            {errors.servings && (
                                <p className="text-sm text-red-500">{errors.servings.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Dificuldade *</Label>
                            <Select
                                onValueChange={(value) =>
                                    setValue('difficulty', value as RecipeFormData['difficulty'])
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a dificuldade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EASY">Fácil</SelectItem>
                                    <SelectItem value="MEDIUM">Médio</SelectItem>
                                    <SelectItem value="HARD">Difícil</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.difficulty && (
                                <p className="text-sm text-red-500">{errors.difficulty.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categoria *</Label>
                            <Select
                                onValueChange={(value) =>
                                    setValue('categoryId', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.categoryId && (
                                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nutrition */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Informações Nutricionais</h2>

                    <div className="grid gap-6 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="calories">Calorias</Label>
                            <Input
                                id="calories"
                                type="number"
                                {...register('calories')}
                                placeholder="450"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="protein">Proteína (g)</Label>
                            <Input
                                id="protein"
                                type="number"
                                {...register('protein')}
                                placeholder="35"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fat">Gordura (g)</Label>
                            <Input
                                id="fat"
                                type="number"
                                {...register('fat')}
                                placeholder="30"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="carbs">Carboidratos (g)</Label>
                            <Input
                                id="carbs"
                                type="number"
                                {...register('carbs')}
                                placeholder="5"
                            />
                        </div>
                    </div>
                </div>

                {/* Ingredients */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">Ingredientes *</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendIngredient({ amount: '', name: '' })}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {ingredientFields.map((field, index) => (
                            <div key={field.id} className="flex gap-4">
                                <div className="flex-1 grid gap-4 md:grid-cols-2">
                                    <Input
                                        {...register(`ingredients.${index}.amount`)}
                                        placeholder="200g"
                                    />
                                    <Input
                                        {...register(`ingredients.${index}.name`)}
                                        placeholder="Carne moída"
                                    />
                                </div>
                                {ingredientFields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeIngredient(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.ingredients && (
                        <p className="text-sm text-red-500">{errors.ingredients.message}</p>
                    )}
                </div>

                {/* Instructions */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">Modo de Preparo *</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendInstruction({ content: '' })}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Passo
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {instructionFields.map((field, index) => (
                            <div key={field.id} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-semibold">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <Textarea
                                        {...register(`instructions.${index}.content`)}
                                        rows={2}
                                        placeholder="Descreva este passo..."
                                    />
                                </div>
                                {instructionFields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeInstruction(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.instructions && (
                        <p className="text-sm text-red-500">{errors.instructions.message}</p>
                    )}
                </div>

                {/* Additional Content */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">Dicas Extras</h2>
                    <RichTextEditor
                        content={watch('content') || ''}
                        onChange={(html) => setValue('content', html)}
                        placeholder="Adicione dicas, variações ou informações extras..."
                    />
                </div>

                {/* Premium Section */}
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-dashed border-orange-500/30 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPremium"
                                {...register('isPremium')}
                                className="w-5 h-5 rounded border-orange-500 accent-orange-500 cursor-pointer"
                            />
                            <Label htmlFor="isPremium" className="cursor-pointer">
                                <span className="text-lg font-semibold text-orange-600">🔒 Conteúdo Exclusivo para Membros</span>
                            </Label>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7">
                        Se ativado, usuários gratuitos verão apenas o título e foto, mas ingredientes e modo de preparo estarão borrados até que façam uma assinatura premium.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="published"
                                {...register('published')}
                                className="rounded border-border"
                            />
                            <Label htmlFor="published" className="cursor-pointer">
                                Publicar imediatamente
                            </Label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="featured"
                                {...register('featured')}
                                className="rounded border-border"
                            />
                            <Label htmlFor="featured" className="cursor-pointer">
                                Destaque
                            </Label>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                'Salvando...'
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Salvar Receita
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
