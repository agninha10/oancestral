import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export interface JWTPayload extends JoseJWTPayload {
    userId: string
    email: string
    role: string
}

export async function signToken(payload: Omit<JWTPayload, keyof JoseJWTPayload>): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // 7 days
        .sign(secret)
}

export async function verifyToken(token: string): Promise<JWTPayload> {
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload as unknown as JWTPayload
    } catch (error) {
        throw new Error('Invalid token')
    }
}
