'use client';

/**
 * Thin wrapper around NextAuth's SessionProvider.
 * Required for useSession() to work in client components.
 */

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function SessionProvider({ children }: { children: React.ReactNode }) {
    return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
