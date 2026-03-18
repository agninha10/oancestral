'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

import { updatePasswordSchema, type UpdatePasswordFormData } from '@/lib/validations/auth'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'
import { Button } from '@/components/ui/button'

interface UpdatePasswordFormProps {
    token: string
}

export function UpdatePasswordForm({ token }: UpdatePasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdatePasswordFormData>({
        resolver: zodResolver(updatePasswordSchema),
        mode: 'onBlur',
    })

    const onSubmit = async (data: UpdatePasswordFormData) => {
        setIsLoading(true)
        setServerError(null)

        try {
            const response = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: data.password,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Erro ao atualizar senha')
            }

            setSuccess(true)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro ao atualizar senha. Tente novamente.'
            setServerError(message)
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
                    <h2 className="text-2xl font-bold">Senha redefinida com sucesso!</h2>
                    <p className="text-muted-foreground">
                        Você já pode fazer login com sua nova senha.
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
                            className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg flex gap-3"
                        >
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold">Crie sua nova senha</h2>
                    <p className="text-muted-foreground">
                        Escolha uma senha forte e segura para proteger sua conta.
                    </p>
                </div>

                {/* Password */}
                <div className="relative">
                    <FloatingLabelInput
                        label="Senha"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...register('password')}
                        error={errors.password?.message}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isLoading}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <FloatingLabelInput
                        label="Confirmar Senha"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isLoading}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>

                {/* Password Requirements */}
                <div className="bg-stone-900 border border-stone-800 rounded-lg p-4 space-y-2">
                    <p className="text-xs font-semibold text-stone-300">Sua senha deve ter:</p>
                    <ul className="space-y-1 text-xs text-stone-400">
                        <li>✓ Mínimo 8 caracteres</li>
                        <li>✓ Pelo menos uma letra maiúscula</li>
                        <li>✓ Pelo menos uma letra minúscula</li>
                        <li>✓ Pelo menos um número</li>
                    </ul>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Lock className="mr-2 h-5 w-5" />
                            Criar nova senha
                        </>
                    )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Lembrou sua senha?{' '}
                    <Link
                        href="/auth/login"
                        className="text-primary hover:underline font-medium"
                    >
                        Voltar para login
                    </Link>
                </p>
            </form>
        </motion.div>
    )
}
