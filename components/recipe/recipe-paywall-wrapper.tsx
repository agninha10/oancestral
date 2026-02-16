'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RecipePaywallWrapperProps {
    children: ReactNode;
    isPremium: boolean;
    userSubscriptionStatus?: 'FREE' | 'ACTIVE';
}

export function RecipePaywallWrapper({
    children,
    isPremium,
    userSubscriptionStatus = 'FREE',
}: RecipePaywallWrapperProps) {
    const shouldTeaser = isPremium && userSubscriptionStatus !== 'ACTIVE';

    // Se for teaser, renderizar com lógica especial (3 ingredientes + 1 passo visíveis)
    if (shouldTeaser) {
        return (
            <div className="paywall-blur-ingredients relative space-y-12">
                {/* Content com blur progressivo aplicado via CSS global */}
                {children}

                {/* Máscara de Fade Out - transição suave (gradiente invisível que vira background) */}
                <div className="absolute -bottom-32 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />

                {/* CTA Flutuante - Premium Conversion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="relative mt-16 mb-8"
                >
                    <div className="mx-auto max-w-md bg-gradient-to-br from-orange-500/15 via-red-500/10 to-orange-500/5 border-2 border-orange-500/40 rounded-xl p-6 text-center backdrop-blur-md shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
                        {/* Lock Icon */}
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-orange-500/30 to-orange-400/20 border border-orange-500/50 mb-4">
                            <Lock className="w-7 h-7 text-orange-400" />
                        </div>

                        {/* Headline */}
                        <h3 className="text-base font-semibold text-foreground mb-2">
                            Prévia do Conteúdo Exclusivo
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                            Você está vendo uma prévia. <strong className="text-foreground font-medium">O Clã</strong> tem acesso a <strong className="text-orange-400">+200 receitas completas</strong> e exclusivas.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col gap-2">
                            <Button
                                asChild
                                size="sm"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
                            >
                                <Link href="/auth/register?plan=premium">
                                    Liberar Receita Agora
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="w-full text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                            >
                                <Link href="/auth/login">
                                    Já sou membro? Entrar
                                </Link>
                            </Button>
                        </div>

                        {/* Trust Signal */}
                        <p className="text-xs text-muted-foreground mt-4">
                            ✓ Acesso imediato • Sem cartão de crédito
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Se for assinante ou receita não premium, renderizar tudo normalmente (sem restrições)
    return <>{children}</>;
}
