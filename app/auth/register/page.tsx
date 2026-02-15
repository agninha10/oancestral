import { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
    title: 'Criar Conta | O Ancestral',
    description: 'Crie sua conta e comece sua jornada ancestral',
}

export default function RegisterPage() {
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
                        Criar Conta
                    </h2>
                    <p className="text-muted-foreground">
                        Comece sua jornada para uma vida mais saudável
                    </p>
                </div>

                {/* Form */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}
