import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, sendPasswordResetEmail } from '@/lib/auth/email'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        // Basic validation
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'E-mail inválido' },
                { status: 400 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { id: true, email: true, name: true },
        })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: 'Se o e-mail existir na plataforma, você receberá um link para redefinir sua senha.',
            })
        }

        // Generate reset token (32-byte hex string, different from verification code)
        const resetToken = generateToken()
        const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        // Update user with reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        })

        // Send password reset email
        try {
            await sendPasswordResetEmail(user.email, resetToken, user.name ?? undefined)
        } catch (emailError) {
            console.error('[FORGOT_PASSWORD] Failed to send password reset email:', emailError)
            // Don't fail the request, but log the error
            // In production, you might want to notify an admin or retry later
        }

        return NextResponse.json({
            message: 'Se o e-mail existir na plataforma, você receberá um link para redefinir sua senha.',
        })
    } catch (error) {
        console.error('[FORGOT_PASSWORD] Error:', error)
        return NextResponse.json(
            { error: 'Erro ao processar solicitação. Tente novamente mais tarde.' },
            { status: 500 }
        )
    }
}
