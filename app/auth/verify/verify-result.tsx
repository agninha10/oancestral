'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle } from 'lucide-react'

type VerifyStatus = 'success' | 'invalid' | 'expired' | 'already'

interface VerifyResultProps {
    status: VerifyStatus
}

export default function VerifyResult({ status }: VerifyResultProps) {
    const router = useRouter()

    useEffect(() => {
        if (status === 'success' || status === 'already') {
            const timeout = setTimeout(() => {
                router.push('/auth/login')
            }, 3000)

            return () => clearTimeout(timeout)
        }
    }, [router, status])

    const isSuccess = status === 'success'
    const isAlready = status === 'already'

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <h1 className="font-serif text-4xl font-bold text-primary">
                            O Ancestral
                        </h1>
                    </Link>
                </div>

                <div className="bg-card border border-border rounded-2xl p-8 shadow-lg text-center space-y-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        {isSuccess || isAlready ? (
                            <CheckCircle2 className="w-10 h-10 text-primary" />
                        ) : (
                            <AlertTriangle className="w-10 h-10 text-primary" />
                        )}
                    </div>

                    {isSuccess && (
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">
                                Conta ativada!
                            </h2>
                            <p className="text-muted-foreground">
                                A ancestralidade te espera. Redirecionando para o login...
                            </p>
                        </div>
                    )}

                    {isAlready && (
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">
                                Conta já ativada
                            </h2>
                            <p className="text-muted-foreground">
                                Você já pode acessar sua conta. Redirecionando...
                            </p>
                        </div>
                    )}

                    {status === 'invalid' && (
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">
                                Link inválido
                            </h2>
                            <p className="text-muted-foreground">
                                O link de verificação não é válido.
                            </p>
                        </div>
                    )}

                    {status === 'expired' && (
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">
                                Link expirado
                            </h2>
                            <p className="text-muted-foreground">
                                O link de verificação expirou. Solicite um novo cadastro.
                            </p>
                        </div>
                    )}

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
