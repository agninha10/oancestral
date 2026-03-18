import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/password'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token, password } = body

        // Validate input
        if (!token || typeof token !== 'string') {
            return NextResponse.json(
                { error: 'Token inválido' },
                { status: 400 }
            )
        }

        if (!password || typeof password !== 'string') {
            return NextResponse.json(
                { error: 'Senha inválida' },
                { status: 400 }
            )
        }

        // Find user by reset token
        const user = await prisma.user.findFirst({
            where: { resetToken: token },
            select: { id: true, email: true, resetTokenExpiry: true },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Link inválido ou expirado' },
                { status: 400 }
            )
        }

        // Check if token has expired
        if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            return NextResponse.json(
                { error: 'Link expirou. Solicite um novo link de redefinição de senha.' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await hashPassword(password)

        // Update user password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        })

        return NextResponse.json({
            message: 'Senha redefinida com sucesso',
        })
    } catch (error) {
        console.error('[UPDATE_PASSWORD] Error:', error)
        return NextResponse.json(
            { error: 'Erro ao redefinir senha. Tente novamente mais tarde.' },
            { status: 500 }
        )
    }
}
