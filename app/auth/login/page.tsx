import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
    title: 'Login | O Ancestral',
    description: 'Faça login na sua conta',
}

export default function LoginPage() {
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
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Bem-vindo de volta
                    </h2>
                    <p className="text-muted-foreground">
                        Entre para continuar sua jornada
                    </p>
                </div>

                {/* Form */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
