'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';

type NewsletterBoxProps = {
    source: 'BLOG_FOOTER' | 'RECIPE_POPUP' | 'INLINE_CTA' | 'HOMEPAGE' | 'OTHER';
    title?: string;
    description?: string;
};

export function NewsletterBox({
    source,
    title = 'Receitas ancestrais direto no seu inbox',
    description = 'Sem spam, só nutrição de verdade.'
}: NewsletterBoxProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, source }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao processar inscrição');
            }

            setSuccess(true);
            setEmail('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao processar inscrição');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:via-neutral-900 dark:to-neutral-950 border border-orange-200 dark:border-orange-500/20 p-8"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />

            <div className="relative z-10">
                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center py-4"
                        >
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                Inscrição confirmada!
                            </h3>
                            <p className="text-muted-foreground">
                                Você receberá nossas melhores receitas em breve.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-500/10 border border-orange-300 dark:border-orange-500/20">
                                    <Mail className="w-6 h-6 text-orange-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-foreground mb-1">
                                        {title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-red-400"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Inscrevendo...
                                        </span>
                                    ) : (
                                        'Inscrever-se'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
