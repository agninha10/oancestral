/**
 * app/api/auth/[...nextauth]/route.ts
 *
 * NextAuth v5 route handler.
 * Handles all OAuth callbacks: GET /api/auth/callback/google, etc.
 */

import { handlers } from '@/auth';

export const { GET, POST } = handlers;

// Ensure this route is always dynamic (never statically cached)
export const dynamic = 'force-dynamic';
