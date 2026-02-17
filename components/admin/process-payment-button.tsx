'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProcessPaymentButtonProps {
    transactionId: string;
    disabled?: boolean;
}

export function ProcessPaymentButton({ transactionId, disabled }: ProcessPaymentButtonProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleProcess = async () => {
        if (disabled || loading || success) return;

        try {
            setLoading(true);
            
            const response = await fetch('/api/admin/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transactionId }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao processar pagamento');
            }

            setSuccess(true);
            
            // Aguardar 1 segundo e recarregar a página
            setTimeout(() => {
                router.refresh();
            }, 1000);
            
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            alert(error instanceof Error ? error.message : 'Erro ao processar pagamento');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Button size="sm" variant="outline" disabled className="text-green-500">
                <Check className="h-4 w-4 mr-1" />
                Processado
            </Button>
        );
    }

    return (
        <Button 
            size="sm" 
            variant="outline"
            onClick={handleProcess}
            disabled={disabled || loading}
            className="hover:bg-amber-500/10 hover:text-amber-500"
        >
            {loading ? (
                <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Processando...
                </>
            ) : (
                'Processar Manualmente'
            )}
        </Button>
    );
}
