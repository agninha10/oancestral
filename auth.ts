/**
 * auth.ts — NextAuth v5 (Auth.js) configuration
 *
 * Strategy: JWT sessions for fast, edge-compatible middleware.
 * The PrismaAdapter handles DB writes (Account, User creation) on first OAuth sign-in.
 *
 * Required env vars:
 *   AUTH_SECRET             — openssl rand -base64 32
 *   GOOGLE_CLIENT_ID        — Google Cloud Console → OAuth 2.0 Client
 *   GOOGLE_CLIENT_SECRET
 *
 * Optional (Apple Sign In requires Apple Developer account):
 *   APPLE_ID                — Services ID (e.g. br.com.ancestral.auth)
 *   APPLE_SECRET            — Private key in PEM format or path
 */

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';
import Apple from 'next-auth/providers/apple';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import type { DefaultSession } from 'next-auth';

// ─── Type augmentation ────────────────────────────────────────────────────────
// Extend the built-in session.user type so TypeScript knows about our custom fields.

declare module 'next-auth' {
    interface Session {
        user: {
            id:   string;
            role: string;
        } & DefaultSession['user'];
    }
    interface User {
        role?: string | null;
    }
}

// ─── Providers ────────────────────────────────────────────────────────────────

const providers = [
    Google({
        clientId:     process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        allowDangerousEmailAccountLinking: true,
        authorization: {
            params: {
                access_type: 'offline',
                prompt:      'consent',
            },
        },
    }),

    // Apple Sign In — requires Apple Developer account + Services ID + private key
    ...(process.env.APPLE_ID
        ? [
              Apple({
                  clientId:     process.env.APPLE_ID!,
                  clientSecret: process.env.APPLE_SECRET!,
                  allowDangerousEmailAccountLinking: true,
              }),
          ]
        : []),

    // ─── Credentials (E-mail + Senha) ──────────────────────────────────────────
    Credentials({
        credentials: {
            email:    { label: 'E-mail',  type: 'email'    },
            password: { label: 'Senha',   type: 'password' },
        },
        async authorize(credentials) {
            const email    = credentials?.email    as string | undefined;
            const password = credentials?.password as string | undefined;

            if (!email || !password) return null;

            const user = await prisma.user.findUnique({
                where:  { email },
                select: { id: true, name: true, email: true, password: true, role: true },
            });

            // No user, or OAuth-only account (no local password)
            if (!user?.password) return null;

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return null;

            return {
                id:    user.id,
                name:  user.name,
                email: user.email,
                role:  user.role,
            };
        },
    }),
];

// ─── NextAuth config ──────────────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET,
    adapter: PrismaAdapter(prisma),

    // JWT strategy: sessions are stored in a signed cookie, not the DB.
    // Fast middleware — no DB call on every request.
    session: { strategy: 'jwt' },

    providers,

    pages: {
        signIn:  '/login',
        error:   '/login',   // ?error=... is appended by NextAuth on OAuth errors
    },

    callbacks: {
        /**
         * jwt — runs when a JWT is created (sign-in) or read (session access).
         * On sign-in, `user` is populated — inject our custom fields into the token.
         */
        async jwt({ token, user }) {
            if (user) {
                token.id   = user.id;
                token.role = user.role ?? 'USER';
            }
            return token;
        },

        /**
         * session — runs when the session is read in a Server Component or hook.
         * Populate `session.user` from the JWT token so the role is always available.
         */
        async session({ session, token }) {
            if (token) {
                session.user.id   = token.id   as string;
                session.user.role = (token.role as string) ?? 'USER';
            }
            return session;
        },
    },

    events: {
        /**
         * signIn — fires after a successful sign-in.
         * Sync the NextAuth `image` field to our custom `avatarUrl` column
         * so existing code that reads `avatarUrl` keeps working.
         */
        async signIn({ user }) {
            if (user.id && user.image) {
                await prisma.user.update({
                    where: { id: user.id },
                    data:  { avatarUrl: user.image },
                }).catch(() => {
                    // Non-critical — don't fail the sign-in if this errors
                });
            }
        },
    },
});
