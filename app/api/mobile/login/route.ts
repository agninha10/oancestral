import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth/password'
import { signMobileToken } from '@/lib/auth/mobile-jwt'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body as { email?: string; password?: string }

        if (!email || !password) {
            const motivo = 'Campos obrigatórios ausentes (email ou password)'
            console.log('❌ [LOGIN MOBILE ERRO] Motivo:', motivo)
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
            const motivo = `Usuário não encontrado para o e-mail: ${email.toLowerCase().trim()}`
            console.log('❌ [LOGIN MOBILE ERRO] Motivo:', motivo)
            return NextResponse.json(
                { success: false, error: 'E-mail ou senha incorretos.' },
                { status: 401 },
            )
        }

        // Social-only account — no local password set
        if (!user.password) {
            const motivo = `Conta social sem senha local (userId: ${user.id})`
            console.log('❌ [LOGIN MOBILE ERRO] Motivo:', motivo)
            return NextResponse.json(
                {
                    success: false,
                    error: 'Sua conta usa Login Social. Use o botão do Google/Apple no aplicativo.',
                },
                { status: 400 },
            )
        }

        const passwordValid = await verifyPassword(password, user.password)
        if (!passwordValid) {
            const motivo = `Senha incorreta para userId: ${user.id}`
            console.log('❌ [LOGIN MOBILE ERRO] Motivo:', motivo)
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

        const responseData = {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                role: user.role,
                xp: user.xp,
                level: user.level,
                subscriptionStatus: user.subscriptionStatus,
            },
        }

        console.log('🔥 [LOGIN MOBILE SUCESSO] Payload:', JSON.stringify(responseData))

        return NextResponse.json({ success: true, data: responseData })
    } catch (error) {
        const motivo = error instanceof Error ? error.message : 'Erro desconhecido'
        console.log('❌ [LOGIN MOBILE ERRO] Motivo:', motivo)
        return NextResponse.json(
            { success: false, error: 'Erro interno. Tente novamente.' },
            { status: 500 },
        )
    }
}
