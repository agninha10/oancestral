'use server';

import { signIn } from '@/auth';

export async function googleSignIn(formData: FormData) {
    const callbackUrl = (formData.get('callbackUrl') as string | null) ?? '/dashboard';
    await signIn('google', { redirectTo: callbackUrl });
}

export async function appleSignIn(formData: FormData) {
    const callbackUrl = (formData.get('callbackUrl') as string | null) ?? '/dashboard';
    await signIn('apple', { redirectTo: callbackUrl });
}
