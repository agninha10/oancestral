import { Metadata } from 'next'
import Link from 'next/link'
import { Mail, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
    title: 'Verifique seu E-mail | O Ancestral',
    description: 'Verifique seu e-mail para ativar sua conta',
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <h1 className="font-serif text-4xl font-bold text-primary">
                            O Ancestral
                        </h1>
                    </Link>
                </div>

                {/* Content */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-lg text-center space-y-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Mail className="w-10 h-10 text-primary" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">
                            Verifique seu e-mail
                        </h2>
                        <p className="text-muted-foreground">
                            Enviamos um link de confirmação para o seu e-mail.
                        </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-3 text-left">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                                Clique no link que enviamos para ativar sua conta
                            </p>
                        </div>
                        <div className="flex items-start gap-3 text-left">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                                Verifique sua caixa de spam se não encontrar o e-mail
                            </p>
                        </div>
                        <div className="flex items-start gap-3 text-left">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                                O link é válido por 24 horas
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <Button asChild className="w-full">
                            <Link href="/auth/login">Ir para o login</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">Voltar para o início</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
