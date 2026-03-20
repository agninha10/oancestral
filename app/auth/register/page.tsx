import { redirect } from 'next/navigation';

/**
 * Legacy route — registration is now handled via social OAuth on /login.
 */
export default function LegacyRegisterPage() {
    redirect('/login');
}
