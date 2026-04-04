import { prisma } from "@/lib/prisma";
import { DashboardAnalytics } from "@/components/admin/dashboard-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, UserCheck, UserX, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [userCount, subscriberCount, activeSubscriberCount, inactiveSubscriberCount, recentSubscriberCount] = await Promise.all([
        prisma.user.count(),
        prisma.newsletterSubscriber.count(),
        prisma.newsletterSubscriber.count({ where: { active: true } }),
        prisma.newsletterSubscriber.count({ where: { active: false } }),
        prisma.newsletterSubscriber.count({ where: { subscribedAt: { gte: thirtyDaysAgo } } }),
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
                <Link href="/admin/newsletter?status=all" className="block h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <Card className="h-full transition-colors hover:border-orange-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Assinantes
                        </CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subscriberCount}</div>
                        <p className="text-xs text-muted-foreground">Clique para ver a lista</p>
                    </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/newsletter?status=active" className="block h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <Card className="h-full transition-colors hover:border-orange-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Assinantes Ativos
                        </CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeSubscriberCount}</div>
                        <p className="text-xs text-muted-foreground">Clique para ver ativos</p>
                    </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/newsletter?status=inactive" className="block h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <Card className="h-full transition-colors hover:border-orange-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Assinantes Inativos
                        </CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inactiveSubscriberCount}</div>
                        <p className="text-xs text-muted-foreground">Clique para ver inativos</p>
                    </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/newsletter?status=recent" className="block h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                    <Card className="h-full transition-colors hover:border-orange-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Novos em 30 dias
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recentSubscriberCount}</div>
                        <p className="text-xs text-muted-foreground">Clique para ver recentes</p>
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
