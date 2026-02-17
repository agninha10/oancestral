import { cookies } from 'next/headers'
import { verifyToken, type JWTPayload } from './jwt'

const COOKIE_NAME = 'auth-token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function getSession(): Promise<JWTPayload | null> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get(COOKIE_NAME)?.value

        if (!token) {
            console.log('[SESSION] No token found in cookies')
            return null
        }

        console.log('[SESSION] Token found, verifying...')
        const payload = await verifyToken(token)
        console.log('[SESSION] Token verified successfully for user:', payload.userId)
        return payload
    } catch (error) {
        console.error('[SESSION] Session verification failed:', error instanceof Error ? error.message : 'Unknown error')
        return null
    }
}

export async function setSession(token: string): Promise<void> {
    const cookieStore = await cookies()
    
    const isProduction = process.env.NODE_ENV === 'production'

    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
        // Não definir domain - deixa o cookie válido apenas para o hostname atual
    })
    
    console.log('[SESSION] Cookie set successfully:', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
        nodeEnv: process.env.NODE_ENV,
        tokenLength: token.length
    })
}

export async function clearSession(): Promise<void> {
    const cookieStore = await cookies()
    
    // Deletar o cookie de forma mais robusta
    cookieStore.set(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // Expira imediatamente
        path: '/',
        // Não definir domain -留a o cookie válido apenas para o hostname atual
    })
}

export async function getUserId(): Promise<string | null> {
    const session = await getSession()
    return session?.userId || null
}
