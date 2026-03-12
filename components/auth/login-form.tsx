'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, LogIn, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'
import { Button } from '@/components/ui/button'

export function LoginForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [emailNotVerified, setEmailNotVerified] = useState(false)
    const [pendingEmail, setPendingEmail] = useState<string | null>(null)
    const [resendLoading, setResendLoading] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    })

    const handleResendVerification = async () => {
        const email = pendingEmail || getValues('email')
        if (!email) return

        setResendLoading(true)
        try {
            await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            setResendSuccess(true)
        } catch {
            // silencioso — mensagem genérica já foi exibida
        } finally {
            setResendLoading(false)
        }
    }

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        setServerError(null)
        setEmailNotVerified(false)
        setResendSuccess(false)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Importante para cookies
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                if (result.emailNotVerified) {
                    setEmailNotVerified(true)
                    setPendingEmail(data.email)
                    setIsLoading(false)
                    return
                }
                setServerError(result.error || 'Erro ao fazer login')
                setIsLoading(false)
                return
            }

            console.log('[LOGIN_FORM] Login successful, redirecting...')
            
            // Debug: verificar se o cookie foi setado
            console.log('[LOGIN_FORM] Cookies:', document.cookie)
            
            // Aguardar um pouco para garantir que o cookie foi setado
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Debug: verificar novamente após aguardar
            console.log('[LOGIN_FORM] Cookies after wait:', document.cookie)
            
            // Redirecionar para dashboard com hard reload para garantir que o cookie seja lido
            window.location.href = '/dashboard'
        } catch (error) {
            console.error('[LOGIN_FORM] Error:', error)
            setServerError('Erro ao fazer login. Tente novamente.')
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md mx-auto"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Server Error */}
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

                {/* Email Not Verified */}
                <AnimatePresence>
                    {emailNotVerified && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg space-y-3"
                        >
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                Seu e-mail ainda não foi verificado. Enviamos um novo link para{' '}
                                <strong>{pendingEmail}</strong>.
                            </p>
                            {resendSuccess ? (
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    Novo e-mail enviado! Verifique sua caixa de entrada.
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendVerification}
                                    disabled={resendLoading}
                                    className="text-sm text-amber-700 dark:text-amber-400 underline hover:no-underline disabled:opacity-50 flex items-center gap-1"
                                >
                                    {resendLoading ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <Mail className="h-3 w-3" />
                                    )}
                                    Reenviar e-mail de verificação
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Email */}
                <FloatingLabelInput
                    label="E-mail"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    error={errors.email?.message}
                    disabled={isLoading}
                />

                {/* Password */}
                <FloatingLabelInput
                    label="Senha"
                    type="password"
                    autoComplete="current-password"
                    {...register('password')}
                    error={errors.password?.message}
                    disabled={isLoading}
                />

                {/* Forgot Password Link */}
                <div className="text-right">
                    <Link
                        href="/auth/reset-password"
                        className="text-sm text-primary hover:underline"
                    >
                        Esqueci minha senha
                    </Link>
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
                            Entrando...
                        </>
                    ) : (
                        <>
                            <LogIn className="mr-2 h-5 w-5" />
                            Entrar
                        </>
                    )}
                </Button>

                {/* Register Link */}
                <p className="text-center text-sm text-muted-foreground">
                    Não tem uma conta?{' '}
                    <Link
                        href="/auth/register"
                        className="text-primary hover:underline font-medium"
                    >
                        Cadastre-se
                    </Link>
                </p>
            </form>
        </motion.div>
    )
}
