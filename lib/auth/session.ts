import { cookies } from 'next/headers'
import { verifyToken, type JWTPayload } from './jwt'

const COOKIE_NAME = 'auth-token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function getSession(): Promise<JWTPayload | null> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get(COOKIE_NAME)?.value

        if (!token) {
            return null
        }

        return await verifyToken(token)
    } catch (error) {
        return null
    }
}

export async function setSession(token: string): Promise<void> {
    const cookieStore = await cookies()

    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.oancestral.com.br' : undefined,
    })
}

export async function clearSession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}

export async function getUserId(): Promise<string | null> {
    const session = await getSession()
    return session?.userId || null
}
