import { Metadata } from 'next'
import Link from 'next/link'
import { PasswordResetForm } from '@/components/auth/password-reset-form'

export const metadata: Metadata = {
    title: 'Redefinir Senha | O Ancestral',
    description: 'Redefina sua senha',
}

export default function ResetPasswordPage() {
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
                        Esqueceu sua senha?
                    </h2>
                    <p className="text-muted-foreground">
                        Sem problemas, vamos te ajudar
                    </p>
                </div>

                {/* Form */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                    <PasswordResetForm />
                </div>
            </div>
        </div>
    )
}
