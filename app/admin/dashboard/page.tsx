import { prisma } from "@/lib/prisma";
import { DashboardAnalytics } from "@/components/admin/dashboard-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Crown, UserX, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const now = new Date();

    const activeSubscriberWhere = {
        subscriptionStatus: 'ACTIVE' as const,
        OR: [
            { subscriptionEndDate: null },
            { subscriptionEndDate: { gt: now } },
        ],
    };

    const expiredSubscriberWhere = {
        OR: [
            { subscriptionStatus: 'FREE' as const, subscriptionEndDate: { not: null } },
            { subscriptionStatus: 'ACTIVE' as const, subscriptionEndDate: { lte: now } },
        ],
    };

    const [userCount, activeSubscriberCount, expiredSubscriberCount, recentSubscriberCount] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: activeSubscriberWhere }),
        prisma.user.count({ where: expiredSubscriberWhere }),
        prisma.user.count({
            where: {
                ...activeSubscriberWhere,
                createdAt: { gte: thirtyDaysAgo },
            },
        }),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Bem-vindo ao painel administrativo do O Ancestral
                </p>
            </div>

            {/* Internal Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                <Link href="/admin/usuarios" className="block h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <Card className="h-full transition-colors hover:border-orange-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de Usuários
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Usuários cadastrados
                        </p>
                    </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/usuarios" className="block h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <Card className="h-full transition-colors hover:border-orange-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Assinantes do Clã
                        </CardTitle>
                        <Crown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeSubscriberCount}</div>
                        <p className="text-xs text-muted-foreground">Clique para ver os membros ativos</p>
                    </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/usuarios?subscription=expired" className="block h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <Card className="h-full transition-colors hover:border-orange-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Assinantes Vencidos
                        </CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expiredSubscriberCount}</div>
                        <p className="text-xs text-muted-foreground">Clique para ver os membros expirados</p>
                    </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/usuarios?subscription=recent" className="block h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <Card className="h-full transition-colors hover:border-orange-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Novas Assinaturas 30 dias
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recentSubscriberCount}</div>
                        <p className="text-xs text-muted-foreground">Assinantes novos no período</p>
                    </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Analytics Dashboard */}
            <DashboardAnalytics />

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Ações Rápidas</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <a
                        href="/admin/blog/novo"
                        className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-orange-500/50 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                            <span className="text-xl">➕</span>
                        </div>
                        <div>
                            <p className="font-medium text-foreground">Novo Post</p>
                            <p className="text-sm text-muted-foreground">Criar post no blog</p>
                        </div>
                    </a>

                    <a
                        href="/admin/receitas/nova"
                        className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-orange-500/50 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                            <span className="text-xl">➕</span>
                        </div>
                        <div>
                            <p className="font-medium text-foreground">Nova Receita</p>
                            <p className="text-sm text-muted-foreground">Criar receita ancestral</p>
                        </div>
                    </a>

                    <a
                        href="/admin/categorias"
                        className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-orange-500/50 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                            <span className="text-xl">📁</span>
                        </div>
                        <div>
                            <p className="font-medium text-foreground">Gerenciar Categorias</p>
                            <p className="text-sm text-muted-foreground">Organizar conteúdo</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
