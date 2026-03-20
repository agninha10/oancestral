import { SignJWT, jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

export interface MobileJWTPayload {
    id: string
    email: string
    role: string
}

function getSecret(): Uint8Array {
    const secret = process.env.MOBILE_JWT_SECRET
    if (!secret) throw new Error('MOBILE_JWT_SECRET is not defined in environment variables')
    return new TextEncoder().encode(secret)
}

export async function signMobileToken(payload: MobileJWTPayload): Promise<string> {
    return new SignJWT(payload as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(getSecret())
}

export async function verifyMobileToken(token: string): Promise<MobileJWTPayload> {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as MobileJWTPayload
}

// ─── Auth guard for mobile routes ──────────────────────────────────────────
// Usage:
//   const auth = await requireMobileAuth(request)
//   if (!auth.ok) return auth.response
//   const { payload } = auth

type AuthOk = { ok: true; payload: MobileJWTPayload }
type AuthFail = { ok: false; response: NextResponse }

export async function requireMobileAuth(request: Request): Promise<AuthOk | AuthFail> {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            ok: false,
            response: NextResponse.json(
                { success: false, error: 'Token de autorização ausente.' },
                { status: 401 },
            ),
        }
    }

    const token = authHeader.slice(7)

    try {
        const payload = await verifyMobileToken(token)
        return { ok: true, payload }
    } catch {
        return {
            ok: false,
            response: NextResponse.json(
                { success: false, error: 'Token inválido ou expirado.' },
                { status: 401 },
            ),
        }
    }
}
