'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'
import { Button } from '@/components/ui/button'

export function LoginForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        setServerError(null)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Importante para cookies
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                setServerError(result.error || 'Erro ao fazer login')
                setIsLoading(false)
                return
            }

            console.log('[LOGIN_FORM] Login successful, redirecting...')
            
            // Aguardar um pouco para garantir que o cookie foi setado
            await new Promise(resolve => setTimeout(resolve, 500))
            
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
