'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Send, AlertCircle } from 'lucide-react';

interface ResendAccessButtonProps {
    transactionId: string;
    customerEmail: string;
}

export function ResendAccessButton({
    transactionId,
    customerEmail,
}: ResendAccessButtonProps) {
    const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleResend = async () => {
        if (state === 'loading' || state === 'success') return;

        setState('loading');
        setErrorMsg('');

        try {
            const response = await fetch('/api/admin/vendas/reenviar-acesso', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao reenviar acesso');
            }

            setState('success');

            // Volta ao idle após 4 segundos (permite reenviar novamente se necessário)
            setTimeout(() => setState('idle'), 4_000);
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro desconhecido';
            setErrorMsg(msg);
            setState('error');
            // Volta ao idle após 5 segundos
            setTimeout(() => {
                setState('idle');
                setErrorMsg('');
            }, 5_000);
        }
    };

    // ── Success ───────────────────────────────────────────────────────────────
    if (state === 'success') {
        return (
            <Button
                size="sm"
                variant="outline"
                disabled
                className="text-green-500 border-green-800 bg-green-500/5 cursor-default"
                title={`E-mail enviado para ${customerEmail}`}
            >
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Enviado!
            </Button>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (state === 'error') {
        return (
            <Button
                size="sm"
                variant="outline"
                disabled
                className="text-red-400 border-red-900 bg-red-500/5 cursor-default max-w-[160px]"
                title={errorMsg}
            >
                <AlertCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                <span className="truncate text-xs">{errorMsg}</span>
            </Button>
        );
    }

    // ── Idle / Loading ────────────────────────────────────────────────────────
    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handleResend}
            disabled={state === 'loading'}
            className="hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-800"
            title={`Reenviar e-mail de acesso para ${customerEmail}`}
        >
            {state === 'loading' ? (
                <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Enviando...
                </>
            ) : (
                <>
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Reenviar Acesso
                </>
            )}
        </Button>
    );
}
