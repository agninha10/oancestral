import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations/auth'
import { verifyPassword } from '@/lib/auth/password'
import { signToken } from '@/lib/auth/jwt'
import { setSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const result = loginSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: result.error.issues },
                { status: 400 }
            )
        }

        const { email, password } = result.data

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                emailVerified: true,
                role: true,
            },
        })

        if (!user || !user.password) {
            return NextResponse.json(
                { error: 'E-mail ou senha incorretos' },
                { status: 401 }
            )
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'E-mail ou senha incorretos' },
                { status: 401 }
            )
        }

        // Generate JWT token
        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        // Set session cookie
        await setSession(token)

        return NextResponse.json({
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                emailVerified: user.emailVerified,
                role: user.role,
            },
            token, // For mobile app usage
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Erro ao fazer login. Tente novamente.' },
            { status: 500 }
        )
    }
}
