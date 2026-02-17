import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyToken, type JWTPayload } from './jwt'

const COOKIE_NAME = 'auth-token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export const COOKIE_OPTIONS = {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
}

export async function getSession(): Promise<JWTPayload | null> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get(COOKIE_NAME)?.value

        if (!token) {
            console.log('[SESSION] No token found in cookies')
            return null
        }

        const payload = await verifyToken(token)
        console.log('[SESSION] Token verified for user:', payload.userId)
        return payload
    } catch (error) {
        console.error('[SESSION] Session verification failed:', error instanceof Error ? error.message : 'Unknown error')
        return null
    }
}

/**
 * Seta o cookie de sessão diretamente em um NextResponse.
 * Use este método em API Route Handlers para garantir que o cookie
 * seja incluído na resposta HTTP corretamente.
 */
export function setSessionOnResponse(response: NextResponse, token: string): void {
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS)
    console.log('[SESSION] Cookie set on response:', {
        ...COOKIE_OPTIONS,
        tokenLength: token.length
    })
}

/**
 * @deprecated Use setSessionOnResponse em API Route Handlers
 */
export async function setSession(token: string): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS)
}

export function clearSessionOnResponse(response: NextResponse): void {
    response.cookies.set(COOKIE_NAME, '', {
        ...COOKIE_OPTIONS,
        maxAge: 0,
    })
}

export async function clearSession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, '', {
        ...COOKIE_OPTIONS,
        maxAge: 0,
    })
}

export async function getUserId(): Promise<string | null> {
    const session = await getSession()
    return session?.userId || null
}

