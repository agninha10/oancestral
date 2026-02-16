import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Award, Crown } from 'lucide-react';

export default async function ProfilePage() {
    const session = await getSession();

    if (!session) {
        redirect('/auth/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            name: true,
            email: true,
            whatsapp: true,
            birthdate: true,
            role: true,
            subscriptionStatus: true,
            subscriptionEndDate: true,
            emailVerified: true,
            createdAt: true,
            enrollments: {
                select: {
                    courseId: true,
                },
            },
        },
    });

    if (!user) {
        redirect('/api/auth/logout?redirect=/auth/login');
    }

    const completedLessons = await prisma.userProgress.count({
        where: {
            userId: session.userId,
            isCompleted: true,
        },
    });

    return (
        <div className="p-6 lg:p-8 space-y-8 max-w-5xl">
            <div>
                <h1 className="text-3xl lg:text-4xl font-bold font-serif">Meu Perfil</h1>
                <p className="text-muted-foreground mt-2">
                    Gerencie suas informações e acompanhe seu progresso
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Informações Pessoais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Nome</p>
                            <p className="font-medium">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">E-mail</p>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">{user.email}</p>
                                {user.emailVerified && (
                                    <Badge variant="secondary" className="text-xs bg-green-600/90 text-white">
                                        Verificado
                                    </Badge>
                                )}
                            </div>
                        </div>
                        {user.whatsapp && (
                            <div>
                                <p className="text-sm text-muted-foreground">WhatsApp</p>
                                <p className="font-medium">{user.whatsapp}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                            <p className="font-medium">
                                {new Date(user.birthdate).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Crown className="h-5 w-5 text-primary" />
                            Status da Assinatura
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Plano Atual</p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-2xl font-bold">
                                    {user.subscriptionStatus === 'ACTIVE' ? 'Premium' : 'Gratuito'}
                                </p>
                                {user.subscriptionStatus === 'ACTIVE' && (
                                    <Badge className="bg-primary">Ativo</Badge>
                                )}
                            </div>
                        </div>
                        {user.subscriptionStatus === 'ACTIVE' && user.subscriptionEndDate && (
                            <div>
                                <p className="text-sm text-muted-foreground">Válido até</p>
                                <p className="font-medium">
                                    {new Date(user.subscriptionEndDate).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-muted-foreground">Membro desde</p>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium">
                                    {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Learning Stats */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            Estatísticas de Aprendizado
                        </CardTitle>
                        <CardDescription>
                            Acompanhe seu progresso e conquistas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="text-center p-6 rounded-lg bg-primary/10">
                                <div className="text-4xl font-bold text-primary mb-2">
                                    {user.enrollments.length}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Cursos Matriculados
                                </p>
                            </div>
                            <div className="text-center p-6 rounded-lg bg-accent/10">
                                <div className="text-4xl font-bold text-accent mb-2">
                                    {completedLessons}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Aulas Concluídas
                                </p>
                            </div>
                            <div className="text-center p-6 rounded-lg bg-muted">
                                <div className="text-4xl font-bold mb-2">
                                    {Math.round((completedLessons / Math.max(user.enrollments.length * 10, 1)) * 100)}%
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Progresso Médio
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
