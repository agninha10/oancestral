import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, PlayCircle, TrendingUp, Award } from 'lucide-react'

export default async function DashboardPage() {
    const session = await getSession()

    if (!session) {
        redirect('/auth/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            name: true,
            email: true,
            subscriptionStatus: true,
            createdAt: true,
            enrollments: {
                select: {
                    courseId: true,
                },
            },
        },
    })

    if (!user) {
        redirect('/api/auth/logout?redirect=/auth/login')
    }

    // Estatísticas do usuário
    const enrolledCoursesCount = user.enrollments.length;
    
    const completedLessonsCount = await prisma.userProgress.count({
        where: {
            userId: session.userId,
            isCompleted: true,
        },
    });

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl lg:text-4xl font-bold font-serif">
                    Olá, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground mt-2">
                    Bem-vindo de volta ao seu painel de aprendizado
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Cursos Matriculados
                        </CardTitle>
                        <PlayCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{enrolledCoursesCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total de cursos ativos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Aulas Concluídas
                        </CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedLessonsCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Continue aprendendo!
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Status
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {user.subscriptionStatus === 'ACTIVE' ? 'Premium' : 'Gratuito'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Seu plano atual
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Membro desde
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Obrigado por estar conosco!
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PlayCircle className="h-5 w-5 text-primary" />
                            Meus Cursos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Continue aprendendo de onde parou
                        </p>
                        <Button asChild className="w-full">
                            <Link href="/dashboard/cursos">
                                Acessar Cursos
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-accent" />
                            Receitas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Explore receitas ancestrais deliciosas
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/receitas">
                                Ver Receitas
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-2 border-muted hover:border-muted-foreground/40 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-muted-foreground" />
                            Blog
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Artigos sobre saúde e bem-estar
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/blog">
                                Ler Blog
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
