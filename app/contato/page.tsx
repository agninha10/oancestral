import { redirect } from 'next/navigation';

/**
 * Página de redirecionamento do AbacatePay
 * O AbacatePay redireciona para esta rota após o pagamento
 * Aqui nós redirecionamos para /sucesso
 */
export default function ContatoRedirectPage() {
    // Redirecionar para página de sucesso
    redirect('/sucesso');
}
