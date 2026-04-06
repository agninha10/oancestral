'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Send, AlertCircle } from 'lucide-react';
import { resendVerificationEmail } from '@/app/admin/usuarios/actions';

interface ResendVerificationButtonProps {
    userId: string;
    userEmail: string;
}

export function ResendVerificationButton({ userId, userEmail }: ResendVerificationButtonProps) {
    const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleResend = async () => {
        if (state === 'loading' || state === 'success') return;

        setState('loading');
        setErrorMsg('');

        try {
            const result = await resendVerificationEmail(userId);

            if (!result.success) {
                throw new Error(result.error || 'Erro ao reenviar verificação');
            }

            setState('success');
            setTimeout(() => setState('idle'), 4000);
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Erro desconhecido';
            setErrorMsg(msg);
            setState('error');
            setTimeout(() => {
                setState('idle');
                setErrorMsg('');
            }, 5000);
        }
    };

    if (state === 'success') {
        return (
            <Button
                size="sm"
                variant="outline"
                disabled
                className="text-green-500 border-green-800 bg-green-500/5 cursor-default"
                title={`E-mail enviado para ${userEmail}`}
            >
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Enviado!
            </Button>
        );
    }

    if (state === 'error') {
        return (
            <Button
                size="sm"
                variant="outline"
                disabled
                className="text-red-400 border-red-900 bg-red-500/5 cursor-default max-w-42.5"
                title={errorMsg}
            >
                <AlertCircle className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                <span className="truncate text-xs">{errorMsg}</span>
            </Button>
        );
    }

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handleResend}
            disabled={state === 'loading'}
            className="hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-800"
            title={`Reenviar e-mail de verificação para ${userEmail}`}
        >
            {state === 'loading' ? (
                <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Enviando...
                </>
            ) : (
                <>
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Reenviar Verificação
                </>
            )}
        </Button>
    );
}
