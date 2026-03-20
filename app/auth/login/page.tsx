import { redirect } from 'next/navigation';

/**
 * Legacy route — kept to avoid broken links in e-mails / bookmarks.
 * Redirects to the new login page at /login.
 */
export default function LegacyLoginPage() {
    redirect('/login');
}
