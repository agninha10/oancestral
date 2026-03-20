/**
 * lib/auth/session.ts — NextAuth compatibility shim
 *
 * All 40+ server files call getSession() and expect { userId, email, role }.
 * This shim satisfies that contract via NextAuth's auth() — no other file changes.
 *
 * cache(): React's per-request deduplication — the auth() call runs once per
 * request tree, no matter how many server components call getSession().
 */

import { auth } from '@/auth';
import { cache } from 'react';
import type { Role } from '@prisma/client';

// ─── Public type (same shape as before — backward compatible) ─────────────────

export type SessionPayload = {
    userId: string;   // Prisma DB id
    email:  string;
    role:   Role;
};

// ─── getSession ───────────────────────────────────────────────────────────────

export const getSession = cache(async (): Promise<SessionPayload | null> => {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) return null;

    return {
        userId: session.user.id,
        email:  session.user.email,
        role:   (session.user.role as Role) ?? 'USER',
    };
});

// ─── getUserId ────────────────────────────────────────────────────────────────

export async function getUserId(): Promise<string | null> {
    const s = await getSession();
    return s?.userId ?? null;
}

// ─── Legacy no-ops (old cookie-based auth — kept so callers compile) ──────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function clearSession(): Promise<void> {
    // no-op: use signOut() from next-auth/react
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function setSession(_token: string): Promise<void> {
    // no-op
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setSessionOnResponse(_response: unknown, _token: string): void {
    // no-op: NextAuth manages sessions via its own signed JWT cookie (next-auth.session-token)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function clearSessionOnResponse(_response: unknown): void {
    // no-op: use signOut() from next-auth/react or the server signOut() from @/auth
}
