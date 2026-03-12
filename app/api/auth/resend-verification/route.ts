import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateVerificationCode, sendVerificationEmail } from '@/lib/auth/email'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            select: { id: true, email: true, name: true, emailVerified: true },
        })

        // Responder sempre com sucesso para não vazar se o e-mail existe
        if (!user || user.emailVerified) {
            return NextResponse.json({
                message: 'Se o e-mail existir e não estiver verificado, você receberá um novo link.',
            })
        }

        const code = generateVerificationCode()
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken: code,
                verificationTokenExpires: expires,
            },
        })

        await sendVerificationEmail(user.email, code, user.name ?? undefined)

        return NextResponse.json({
            message: 'Se o e-mail existir e não estiver verificado, você receberá um novo link.',
        })
    } catch (error) {
        console.error('[RESEND_VERIFICATION] Error:', error)
        return NextResponse.json(
            { error: 'Erro ao reenviar e-mail. Tente novamente.' },
            { status: 500 }
        )
    }
}
