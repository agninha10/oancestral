'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Trash2, Loader2 } from 'lucide-react';
import { revokeCourseAccess } from '@/app/admin/cursos/actions';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface RevokeEnrollmentButtonProps {
    enrollmentId: string;
    userName: string | null;
    courseTitle: string;
}

export function RevokeEnrollmentButton({
    enrollmentId,
    userName,
    courseTitle,
}: RevokeEnrollmentButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleRevoke = () => {
        startTransition(async () => {
            const result = await revokeCourseAccess(enrollmentId);

            if (result.success) {
                toast.success(`Acesso de "${userName}" ao curso "${courseTitle}" foi revogado.`);
            } else {
                toast.error(result.error ?? 'Erro ao revogar acesso.');
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    aria-label="Revogar acesso"
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Revogar acesso?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação vai remover o acesso gratuito de{' '}
                        <strong>{userName}</strong> ao curso{' '}
                        <strong>"{courseTitle}"</strong>. O usuário perderá o acesso
                        imediatamente.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleRevoke}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Sim, revogar acesso
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
