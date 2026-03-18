'use client'

import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense, useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { UpdatePasswordForm } from '@/components/auth/update-password-form'

interface UpdatePasswordPageProps {
    searchParams: Promise<{ token?: string }>
}

function UpdatePasswordContent({ token }: { token?: string }) {
    if (!token) {
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

                    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                        <div className="flex gap-3 mb-4">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
                                    Link inválido
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    O link para redefinir sua senha é inválido ou expirou.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Link
                                href="/auth/reset-password"
                                className="block text-center text-primary hover:underline font-medium bg-primary/10 rounded-lg px-4 py-2"
                            >
                                Solicitar novo link
                            </Link>
                            <Link
                                href="/auth/login"
                                className="block text-center text-muted-foreground hover:underline"
                            >
                                Voltar para login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

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

                {/* Form */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                    <UpdatePasswordForm token={token} />
                </div>
            </div>
        </div>
    )
}

export default async function UpdatePasswordPage({
    searchParams,
}: UpdatePasswordPageProps) {
    const params = await searchParams
    const token = params?.token

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <UpdatePasswordContent token={token} />
        </Suspense>
    )
}
