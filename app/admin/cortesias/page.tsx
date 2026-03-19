/**
 * app/admin/cortesias/page.tsx
 *
 * Painel de Cortesias & Parcerias — libera e gerencia acessos manuais a cursos.
 * Server Component: busca cursos e matrículas no banco e passa para os
 * Client Components como props (nenhuma chamada de API do lado cliente).
 */

import { prisma } from '@/lib/prisma';
import { ManualEnrollmentForm } from '@/components/admin/manual-enrollment-form';
import { RevokeEnrollmentButton } from '@/components/admin/revoke-enrollment-button';
import { Gift, Users, Calendar, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function CortesiasPage() {
    const [courses, manualEnrollments] = await Promise.all([
        // All courses for the select (including drafts, so admin can grant early access)
        prisma.course.findMany({
            select: { id: true, title: true, published: true },
            orderBy: { title: 'asc' },
        }),

        // All MANUAL_FREE enrollments with user + course info
        prisma.courseEnrollment.findMany({
            where: { accessType: 'MANUAL_FREE' },
            select: {
                id: true,
                enrolledAt: true,
                user: { select: { id: true, name: true, email: true } },
                course: { select: { id: true, title: true, slug: true } },
            },
            orderBy: { enrolledAt: 'desc' },
        }),
    ]);

    return (
        <div className="space-y-8">

            {/* ── Page header ──────────────────────────────────────────── */}
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                        <Gift className="h-5 w-5 text-amber-500" />
                    </div>
                    <h1 className="text-3xl font-bold">Cortesias & Parcerias</h1>
                </div>
                <p className="ml-12 text-muted-foreground">
                    Conceda acesso gratuito a cursos para parceiros, influenciadores ou usuários
                    especiais. Todas as concessões ficam marcadas como{' '}
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                        MANUAL_FREE
                    </code>{' '}
                    no banco.
                </p>
            </div>

            {/* ── Stats strip ──────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    icon={<Users className="h-5 w-5 text-amber-500" />}
                    label="Total de cortesias"
                    value={manualEnrollments.length}
                />
                <StatCard
                    icon={<BookOpen className="h-5 w-5 text-amber-500" />}
                    label="Cursos com cortesia"
                    value={new Set(manualEnrollments.map((e) => e.course.id)).size}
                />
                <StatCard
                    icon={<Gift className="h-5 w-5 text-amber-500" />}
                    label="Cursos disponíveis"
                    value={courses.length}
                />
            </div>

            {/* ── Form + List side-by-side on large screens ────────────── */}
            <div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:items-start">

                {/* Form */}
                <ManualEnrollmentForm courses={courses} />

                {/* Enrollments list */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Acessos Concedidos Manualmente</CardTitle>
                        <CardDescription>
                            {manualEnrollments.length === 0
                                ? 'Nenhuma cortesia registrada ainda.'
                                : `${manualEnrollments.length} acesso${manualEnrollments.length !== 1 ? 's' : ''} concedido${manualEnrollments.length !== 1 ? 's' : ''}`}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        {manualEnrollments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
                                <Gift className="h-10 w-10 opacity-30" />
                                <p className="text-sm">
                                    Use o formulário ao lado para conceder o primeiro acesso.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Usuário</TableHead>
                                            <TableHead>Curso</TableHead>
                                            <TableHead className="hidden sm:table-cell">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    Data
                                                </span>
                                            </TableHead>
                                            <TableHead className="w-12 text-right">
                                                Ação
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {manualEnrollments.map((enrollment) => (
                                            <TableRow key={enrollment.id}>
                                                {/* User */}
                                                <TableCell>
                                                    <p className="font-medium leading-none">
                                                        {enrollment.user.name}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                        {enrollment.user.email}
                                                    </p>
                                                </TableCell>

                                                {/* Course */}
                                                <TableCell>
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">
                                                            {enrollment.course.title}
                                                        </span>
                                                        <Badge
                                                            variant="secondary"
                                                            className="hidden shrink-0 border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 sm:inline-flex"
                                                        >
                                                            MANUAL_FREE
                                                        </Badge>
                                                    </span>
                                                </TableCell>

                                                {/* Date */}
                                                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                                                    {format(
                                                        new Date(enrollment.enrolledAt),
                                                        "dd/MM/yyyy 'às' HH:mm",
                                                        { locale: ptBR },
                                                    )}
                                                </TableCell>

                                                {/* Revoke */}
                                                <TableCell className="text-right">
                                                    <RevokeEnrollmentButton
                                                        enrollmentId={enrollment.id}
                                                        userName={enrollment.user.name}
                                                        courseTitle={enrollment.course.title}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// ─── Tiny stat card ───────────────────────────────────────────────────────────

function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
}) {
    return (
        <Card className="p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                {icon}
            </div>
            <p className="mt-2 text-3xl font-bold">{value}</p>
        </Card>
    );
}
