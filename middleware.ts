/**
 * middleware.ts — NextAuth v5 route protection
 *
 * Uses the JWT cookie (set by NextAuth) to protect private routes.
 * No database call — token is verified locally via AUTH_SECRET.
 *
 * Protected:  /dashboard, /play, /mod, /admin
 * Public:     everything else (marketing, blog, recipes, community reading)
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const { nextUrl, auth: session } = req;
    const isLoggedIn  = !!session;
    const { pathname } = nextUrl;

    const isPrivate =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/play')      ||
        pathname.startsWith('/mod')       ||
        pathname.startsWith('/admin');

    // ── Unauthenticated on private route → redirect to login ──────────────────
    if (isPrivate && !isLoggedIn) {
        const loginUrl = new URL('/login', nextUrl);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ── Non-admin on /admin → redirect to home ────────────────────────────────
    if (pathname.startsWith('/admin') && session?.user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', nextUrl));
    }

    // ── Already logged in on /login, /cadastro or /auth/* → skip to dashboard ─
    if (isLoggedIn && (pathname === '/login' || pathname === '/cadastro' || pathname.startsWith('/auth/'))) {
        return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }

    const response = NextResponse.next();

    // No-cache on private routes
    if (isPrivate) {
        response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        response.headers.set('Pragma',  'no-cache');
        response.headers.set('Expires', '0');
    }

    return response;
});

export const config = {
    matcher: [
        // Skip Next.js internals and static assets
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
