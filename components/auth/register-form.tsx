'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'
import { PhoneInput } from '@/components/ui/phone-input'
import { DatePicker } from '@/components/ui/date-picker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export function RegisterForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        control,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
    })

    const termsAccepted = watch('terms')

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)
        setServerError(null)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                setServerError(result.error || 'Erro ao criar conta')
                return
            }

            // Redirect to verification page
            router.push('/auth/verify-email')
        } catch (error) {
            setServerError('Erro ao criar conta. Tente novamente.')
        } finally {
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

                {/* Name */}
                <FloatingLabelInput
                    label="Nome Completo"
                    type="text"
                    {...register('name')}
                    error={errors.name?.message}
                    disabled={isLoading}
                />

                {/* Email */}
                <FloatingLabelInput
                    label="Melhor E-mail"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    error={errors.email?.message}
                    disabled={isLoading}
                />

                {/* WhatsApp */}
                <PhoneInput
                    label="WhatsApp (Opcional)"
                    {...register('whatsapp')}
                    error={errors.whatsapp?.message}
                    disabled={isLoading}
                />

                {/* Birthdate */}
                <Controller
                    control={control}
                    name="birthdate"
                    render={({ field }) => (
                        <DatePicker
                            label="Data de Nascimento"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.birthdate?.message}
                            disabled={isLoading}
                        />
                    )}
                />

                {/* Password */}
                <FloatingLabelInput
                    label="Senha"
                    type="password"
                    autoComplete="new-password"
                    {...register('password')}
                    error={errors.password?.message}
                    disabled={isLoading}
                />

                {/* Terms */}
                <div className="flex items-start space-x-3">
                    <Checkbox
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setValue('terms', checked as boolean)}
                        disabled={isLoading}
                        className="mt-1"
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                    >
                        Li e aceito os{' '}
                        <Link
                            href="/termos-de-uso"
                            className="text-primary hover:underline font-medium"
                            target="_blank"
                        >
                            Termos de Uso
                        </Link>{' '}
                        e a{' '}
                        <Link
                            href="/politica-de-privacidade"
                            className="text-primary hover:underline font-medium"
                            target="_blank"
                        >
                            Política de Privacidade
                        </Link>
                    </label>
                </div>
                {errors.terms && (
                    <p className="text-sm text-red-500 -mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        {errors.terms.message}
                    </p>
                )}

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
                            Criando sua conta...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Criar Conta
                        </>
                    )}
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm text-muted-foreground">
                    Já tem uma conta?{' '}
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
