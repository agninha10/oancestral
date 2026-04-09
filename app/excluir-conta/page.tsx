'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Trash2, ShieldCheck, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// metadata não funciona em 'use client' — mover para layout se necessário
// export const metadata: Metadata = { ... }

const WHAT_IS_DELETED = [
    'Conta e dados de acesso (e-mail, senha, nome)',
    'Histórico de compras e transações',
    'Progresso em cursos e aulas assistidas',
    'Comentários e postagens no fórum',
    'Dados de perfil (bio, redes sociais, avatar)',
    'Histórico de jejum e atividades',
];

const WHAT_IS_KEPT = [
    'Registros financeiros exigidos por lei (5 anos — art. 195 do CTN)',
];

export default function ExcluirContaPage() {
    const [form, setForm] = useState({ email: '', reason: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/account-deletion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao enviar solicitação');
            setSuccess(true);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Erro ao enviar solicitação. Tente novamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-zinc-950">
                <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">

                    {/* Header */}
                    <div className="mb-12 border-b border-zinc-800 pb-10">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-500">
                            Privacidade &amp; LGPD
                        </p>
                        <h1 className="font-serif text-4xl font-bold text-zinc-50 md:text-5xl">
                            Exclusão de Conta e Dados
                        </h1>
                        <p className="mt-4 text-zinc-400 leading-relaxed">
                            Você tem o direito de solicitar a exclusão da sua conta e de todos os dados pessoais
                            associados a ela, conforme a{' '}
                            <strong className="text-zinc-300">
                                Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)
                            </strong>
                            . Após a confirmação, seus dados serão apagados em até <strong className="text-zinc-300">15 dias úteis</strong>.
                        </p>
                    </div>

                    {/* O que será excluído */}
                    <div className="mb-10 space-y-6">
                        <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Trash2 className="h-5 w-5 text-red-400 shrink-0" />
                                <h2 className="text-lg font-semibold text-zinc-100">O que será excluído</h2>
                            </div>
                            <ul className="space-y-2">
                                {WHAT_IS_DELETED.map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
                                        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-xl border border-zinc-700/40 bg-zinc-900/40 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />
                                <h2 className="text-lg font-semibold text-zinc-100">O que é mantido por obrigação legal</h2>
                            </div>
                            <ul className="space-y-2">
                                {WHAT_IS_KEPT.map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
                                        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Formulário */}
                    {success ? (
                        <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-8 text-center">
                            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
                            <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                                Solicitação recebida
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Recebemos sua solicitação de exclusão. Você receberá uma confirmação por e-mail
                                em até 2 dias úteis, e os dados serão excluídos em até <strong className="text-zinc-300">15 dias úteis</strong>.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                                    E-mail da conta *
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    placeholder="seu@email.com"
                                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-zinc-300 mb-1.5">
                                    Motivo (opcional)
                                </label>
                                <textarea
                                    id="reason"
                                    rows={4}
                                    value={form.reason}
                                    onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                                    placeholder="Conte-nos o motivo para podermos melhorar..."
                                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 text-sm resize-none"
                                />
                            </div>

                            <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-4 flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-200/80">
                                    Esta ação é <strong>irreversível</strong>. Após a exclusão, não será possível
                                    recuperar sua conta, histórico ou conteúdos adquiridos.
                                </p>
                            </div>

                            {error && (
                                <p className="text-sm text-red-400">{error}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-700 hover:bg-red-600 text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Solicitar Exclusão da Minha Conta
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-zinc-500 text-center">
                                Dúvidas? Entre em contato pelo e-mail{' '}
                                <a href="mailto:privacidade@oancestral.com.br" className="text-amber-500 hover:underline">
                                    privacidade@oancestral.com.br
                                </a>
                            </p>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
