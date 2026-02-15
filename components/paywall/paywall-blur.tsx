'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PaywallBlurProps {
    children: ReactNode;
    isBlurred: boolean;
    className?: string;
}

export function PaywallBlur({ children, isBlurred, className }: PaywallBlurProps) {
    if (!isBlurred) {
        return <>{children}</>;
    }

    return (
        <div className={cn('relative', className)}>
            {/* Blurred Content */}
            <div className="paywall-blur">{children}</div>

            {/* Overlay CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-neutral-950/80 backdrop-blur-sm"
            >
                <div className="max-w-md mx-auto text-center px-6 py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/30 mb-4">
                        <Lock className="w-8 h-8 text-orange-500" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">
                        Conteúdo Exclusivo O Ancestral
                    </h3>

                    <p className="text-neutral-300 mb-6">
                        Torne-se membro para liberar receitas e treinos exclusivos, além de
                        conteúdos aprofundados sobre nutrição ancestral.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                            <Link href="/auth/register">Criar Conta Grátis</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/auth/login">Já sou membro</Link>
                        </Button>
                    </div>

                    <p className="text-xs text-neutral-500 mt-4">
                        Acesso completo a todo conteúdo premium
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
