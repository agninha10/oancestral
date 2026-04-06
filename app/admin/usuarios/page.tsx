import { prisma } from "@/lib/prisma";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { ResendVerificationButton } from "@/components/admin/resend-verification-button";
import { SubscriptionStatus } from "@prisma/client";

export const dynamic = 'force-dynamic';

type SubscriptionFilter = 'all' | 'active' | 'expired';

function getSubscriptionFilter(value?: string): SubscriptionFilter {
    if (value === 'active' || value === 'expired') return value;
    return 'all';
}

function getSubscriptionWhere(filter: SubscriptionFilter) {
    const now = new Date();

    if (filter === 'active') {
        return {
            subscriptionStatus: SubscriptionStatus.ACTIVE,
            OR: [
                { subscriptionEndDate: null },
                { subscriptionEndDate: { gt: now } },
            ],
        };
    }

    if (filter === 'expired') {
        return {
            OR: [
                { subscriptionStatus: SubscriptionStatus.FREE, subscriptionEndDate: { not: null } },
                { subscriptionStatus: SubscriptionStatus.ACTIVE, subscriptionEndDate: { lte: now } },
            ],
        };
    }

    return undefined;
}

async function getUsers(filter: SubscriptionFilter) {
    return await prisma.user.findMany({
        where: getSubscriptionWhere(filter),
        orderBy: { createdAt: 'desc' },
    });
}

export default async function UsersPage({ searchParams }: { searchParams?: { subscription?: string } }) {
    const filter = getSubscriptionFilter(searchParams?.subscription);
    const users = await getUsers(filter);

    const filterLabel =
        filter === 'active' ? 'assinantes ativos do Clã'
        : filter === 'expired' ? 'assinantes vencidos'
        : 'todos os usuários';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
                <p className="text-muted-foreground mt-2">
                    Gerencie os usuários, permissões e status de assinatura.
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                <Link href="/admin/usuarios">
                    <Badge variant={filter === 'all' ? 'default' : 'outline'}>Todos</Badge>
                </Link>
                <Link href="/admin/usuarios?subscription=active">
                    <Badge variant={filter === 'active' ? 'default' : 'outline'}>Assinantes ativos</Badge>
                </Link>
                <Link href="/admin/usuarios?subscription=expired">
                    <Badge variant={filter === 'expired' ? 'default' : 'outline'}>Vencidos</Badge>
                </Link>
            </div>

            <div className="text-sm text-muted-foreground">
                Mostrando {filterLabel}: {users.length}
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome / Email</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>E-mail</TableHead>
                            <TableHead>Status Assinatura</TableHead>
                            <TableHead>Data Cadastro</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.name}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.emailVerified ? 'default' : 'outline'}>
                                        {user.emailVerified ? 'Verificado' : 'Não verificado'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.subscriptionStatus === 'ACTIVE' ? 'default' : 'outline'}>
                                        {user.subscriptionStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Link href={`/admin/usuarios/${user.id}`}>
                                            <Button size="sm" variant="ghost">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Editar
                                            </Button>
                                        </Link>
                                        <ResendVerificationButton
                                            userId={user.id}
                                            userEmail={user.email}
                                        />
                                        <DeleteUserButton
                                            userId={user.id}
                                            userName={user.name ?? user.email}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Nenhum usuário encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
