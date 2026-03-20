import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth/password'
import { signMobileToken } from '@/lib/auth/mobile-jwt'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body as { email?: string; password?: string }

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'E-mail e senha são obrigatórios.' },
                { status: 400 },
            )
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
                avatarUrl: true,
                xp: true,
                level: true,
                subscriptionStatus: true,
            },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'E-mail ou senha incorretos.' },
                { status: 401 },
            )
        }

        // Social-only account — no local password set
        if (!user.password) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        'Sua conta usa Login Social. Use o botão do Google/Apple no aplicativo.',
                },
                { status: 400 },
            )
        }

        const passwordValid = await verifyPassword(password, user.password)
        if (!passwordValid) {
            return NextResponse.json(
                { success: false, error: 'E-mail ou senha incorretos.' },
                { status: 401 },
            )
        }

        const token = await signMobileToken({
            id: user.id,
            email: user.email!,
            role: user.role,
        })

        const { password: _pwd, ...safeUser } = user

        return NextResponse.json({
            success: true,
            data: {
                token,
                user: safeUser,
            },
        })
    } catch (error) {
        console.error('[mobile/login]', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno. Tente novamente.' },
            { status: 500 },
        )
    }
}
