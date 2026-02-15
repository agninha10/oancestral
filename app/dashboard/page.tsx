import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

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
            whatsapp: true,
            birthdate: true,
            emailVerified: true,
            createdAt: true,
        },
    })

    if (!user) {
        redirect('/auth/login')
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold">
                        Olá, {user.name}!
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Bem-vindo ao seu painel do O Ancestral
                    </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h2 className="text-2xl font-semibold">Suas Informações</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Nome</p>
                            <p className="font-medium">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">E-mail</p>
                            <p className="font-medium">{user.email}</p>
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
                        <div>
                            <p className="text-sm text-muted-foreground">Status da Conta</p>
                            <p className="font-medium">
                                {user.emailVerified ? (
                                    <span className="text-green-600 dark:text-green-400">Verificado</span>
                                ) : (
                                    <span className="text-yellow-600 dark:text-yellow-400">Pendente</span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Membro desde</p>
                            <p className="font-medium">
                                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-2">Receitas</h3>
                        <p className="text-muted-foreground text-sm">
                            Suas receitas ancestrais favoritas
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-2">Cursos</h3>
                        <p className="text-muted-foreground text-sm">
                            Continue seu aprendizado
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-2">Progresso</h3>
                        <p className="text-muted-foreground text-sm">
                            Acompanhe sua jornada
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
