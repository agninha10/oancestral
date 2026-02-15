'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

type InlineCTAProps = {
    title?: string;
    description?: string;
    buttonText?: string;
    href?: string;
};

export function InlineCTA({
    title = 'Gostou do conteúdo?',
    description = 'Baixe o Guia de Jejum Ancestral Grátis e transforme sua saúde.',
    buttonText = 'Baixar Guia Gratuito',
    href = '#newsletter',
}: InlineCTAProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="my-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/30 via-neutral-900/50 to-neutral-950/50 border border-orange-500/30 backdrop-blur-sm"
        >
            {/* Animated background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent animate-pulse" />

            <div className="relative z-10 p-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
                    <Sparkles className="w-7 h-7 text-orange-500" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                    {title}
                </h3>

                <p className="text-neutral-300 mb-6 max-w-md mx-auto">
                    {description}
                </p>

                <Link
                    href={href}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
                >
                    {buttonText}
                </Link>
            </div>
        </motion.div>
    );
}
