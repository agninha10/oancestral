'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Mail, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

import { passwordResetSchema, type PasswordResetFormData } from '@/lib/validations/auth'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'
import { Button } from '@/components/ui/button'

export function PasswordResetForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordResetFormData>({
        resolver: zodResolver(passwordResetSchema),
        mode: 'onBlur',
    })

    const onSubmit = async (data: PasswordResetFormData) => {
        setIsLoading(true)
        setServerError(null)

        try {
            // TODO: Implement reset password API route
            setServerError('Funcionalidade em desenvolvimento')
        } catch (error) {
            setServerError('Erro ao enviar e-mail. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md mx-auto text-center space-y-6"
            >
                <div className="flex justify-center">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
                        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">E-mail enviado!</h2>
                    <p className="text-muted-foreground">
                        Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada.
                    </p>
                </div>

                <div className="pt-4">
                    <Link
                        href="/auth/login"
                        className="text-primary hover:underline font-medium"
                    >
                        Voltar para login
                    </Link>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md mx-auto"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence>
                    {serverError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg"
                        >
                            <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold">Esqueceu sua senha?</h2>
                    <p className="text-muted-foreground">
                        Digite seu e-mail e enviaremos um link para redefinir sua senha.
                    </p>
                </div>

                <FloatingLabelInput
                    label="E-mail"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    error={errors.email?.message}
                    disabled={isLoading}
                />

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Mail className="mr-2 h-5 w-5" />
                            Enviar link de redefinição
                        </>
                    )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Lembrou sua senha?{' '}
                    <Link
                        href="/auth/login"
                        className="text-primary hover:underline font-medium"
                    >
                        Faça login
                    </Link>
                </p>
            </form>
        </motion.div>
    )
}
