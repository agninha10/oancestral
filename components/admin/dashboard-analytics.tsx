"use client";

import { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, Users, Eye, Zap, FileText } from "lucide-react";

// Types matching our API response
interface AnalyticsData {
    activeUsers: number;
    pageViews: number;
    realtimeUsers: number;
    topPages: {
        path: string;
        title: string;
        views: string;
    }[];
    trend: {
        date: string;
        activeUsers: number;
        pageViews: number;
    }[];
}

export function DashboardAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/admin/analytics");
                if (!res.ok) throw new Error("Failed to fetch");
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error || !data) {
        return (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                Erro ao carregar dados do Analytics. Verifique as credenciais.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Usuários Ativos (30d)"
                    value={data.activeUsers.toLocaleString()}
                    icon={<Users className="w-4 h-4 text-muted-foreground" />}
                    trend="Total de visitantes únicos"
                />
                <StatCard
                    title="Visualizações (30d)"
                    value={data.pageViews.toLocaleString()}
                    icon={<Eye className="w-4 h-4 text-muted-foreground" />}
                    trend="Total de page views"
                />
                <StatCard
                    title="Tempo Real (Agora)"
                    value={data.realtimeUsers.toLocaleString()}
                    icon={<Zap className="w-4 h-4 text-orange-500" />}
                    trend="Usuários no site neste momento"
                />
                {/* Placeholder for another metric or keeping it 3 cols if wanted, but grid is 4 */}
                <StatCard
                    title="Avg. Engagement"
                    value="--"
                    icon={<ArrowUpRight className="w-4 h-4 text-muted-foreground" />}
                    trend="Dados em breve"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
                {/* Main Chart - Takes 4/7 columns */}
                <Card className="md:col-span-4 lg:col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Evolução de Acessos</CardTitle>
                        <CardDescription>
                            Visitantes e Visualizações nos últimos 30 dias
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.trend}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        minTickGap={30}
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                                        }}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                        labelStyle={{ color: '#64748b' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pageViews"
                                        stroke="#f97316" // Orange-500 from ancestral theme
                                        fillOpacity={1}
                                        fill="url(#colorViews)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Content - Takes 3/7 columns */}
                <Card className="md:col-span-3 lg:col-span-3 shadow-sm h-full">
                    <CardHeader>
                        <CardTitle>Conteúdo em Destaque</CardTitle>
                        <CardDescription>Páginas mais acessadas no período</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.topPages.map((page, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center mr-3 text-orange-600 font-bold text-xs">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none line-clamp-1" title={page.title}>
                                            {page.title || 'Sem título'}
                                        </p>
                                        <p className="text-xs text-muted-foreground line-clamp-1" title={page.path}>
                                            {page.path}
                                        </p>
                                    </div>
                                    <div className="font-medium text-sm text-right">
                                        {parseInt(page.views).toLocaleString()}
                                        <span className="block text-xs text-muted-foreground font-normal">views</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: any; trend: string }) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {trend}
                </p>
            </CardContent>
        </Card>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted/50 rounded-lg"></div>
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-7">
                <div className="md:col-span-4 h-[400px] bg-muted/50 rounded-lg"></div>
                <div className="md:col-span-3 h-[400px] bg-muted/50 rounded-lg"></div>
            </div>
        </div>
    );
}
