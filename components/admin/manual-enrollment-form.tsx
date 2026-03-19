'use client';

/**
 * components/admin/manual-enrollment-form.tsx
 *
 * Formulário para liberar acesso manual/gratuito a um curso.
 * Recebe a lista de cursos via props (carregada pelo Server Component pai).
 */

import { useTransition, useState } from 'react';
import { toast } from 'sonner';
import { UserPlus, Loader2, Info } from 'lucide-react';
import { grantCourseAccess } from '@/app/admin/cursos/actions';
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CourseOption = {
    id: string;
    title: string;
    published: boolean;
};

interface ManualEnrollmentFormProps {
    courses: CourseOption[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ManualEnrollmentForm({ courses }: ManualEnrollmentFormProps) {
    const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState('');
    const [courseId, setCourseId] = useState('');
    // Changing `selectKey` forces the Select to unmount/remount after reset
    const [selectKey, setSelectKey] = useState(0);

    const isValid = email.trim().length > 0 && courseId.length > 0;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid) return;

        startTransition(async () => {
            const result = await grantCourseAccess(email.trim(), courseId);

            if (result.success) {
                const { courseTitle, userEmail, alreadyHadAccess } = result.data;

                if (alreadyHadAccess) {
                    toast.success(
                        `Matrícula de "${userEmail}" em "${courseTitle}" atualizada para MANUAL_FREE.`,
                        { duration: 6000 },
                    );
                } else {
                    toast.success(
                        `✅ Acesso ao curso "${courseTitle}" liberado para ${userEmail}.`,
                        {
                            description: 'O usuário já pode acessar o conteúdo no painel dele.',
                            duration: 6000,
                        },
                    );
                }

                // Reset form
                setEmail('');
                setCourseId('');
                setSelectKey((k) => k + 1);
            } else {
                toast.error(result.error, { duration: 7000 });
            }
        });
    };

    return (
        <Card className="border-amber-500/20 bg-card">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                        <UserPlus className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Conceder Acesso Gratuito</CardTitle>
                        <CardDescription className="text-sm">
                            Libere um curso para um usuário cadastrado (cortesia / parceria).
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label htmlFor="grant-email" className="text-sm font-medium">
                            E-mail do Usuário
                        </Label>
                        <Input
                            id="grant-email"
                            type="email"
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="parceiro@email.com"
                            disabled={isPending}
                            required
                            className="focus-visible:ring-amber-500/40"
                        />
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Info className="h-3 w-3 flex-shrink-0" />
                            O usuário precisa ter uma conta cadastrada na plataforma.
                        </p>
                    </div>

                    {/* Course Select */}
                    <div className="space-y-1.5">
                        <Label htmlFor="grant-course" className="text-sm font-medium">
                            Curso
                        </Label>
                        <Select
                            key={selectKey}
                            value={courseId}
                            onValueChange={setCourseId}
                            disabled={isPending}
                        >
                            <SelectTrigger
                                id="grant-course"
                                className="focus:ring-amber-500/40"
                            >
                                <SelectValue placeholder="Selecione um curso…" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.length === 0 ? (
                                    <div className="px-4 py-3 text-sm text-muted-foreground">
                                        Nenhum curso cadastrado.
                                    </div>
                                ) : (
                                    courses.map((course) => (
                                        <SelectItem key={course.id} value={course.id}>
                                            <span className="flex items-center gap-2">
                                                {course.title}
                                                {!course.published && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="py-0 text-[10px]"
                                                    >
                                                        Rascunho
                                                    </Badge>
                                                )}
                                            </span>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isPending || !isValid}
                        className="w-full bg-amber-500 font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Liberando acesso…
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Liberar Acesso Gratuito
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
