import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations/auth'
import { hashPassword } from '@/lib/auth/password'
import { generateToken, sendVerificationEmail } from '@/lib/auth/email'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const result = registerSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: result.error.issues },
                { status: 400 }
            )
        }

        const { email, password, name, whatsapp, birthdate } = result.data

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'E-mail já cadastrado' },
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Generate verification token
        const verificationToken = generateToken()

        // Normalize phone (remove formatting)
        const normalizedWhatsapp = whatsapp ? whatsapp.replace(/\D/g, '') : null

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                whatsapp: normalizedWhatsapp,
                birthdate: new Date(birthdate), // Already ISO from Zod transform
                verificationToken,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        })

        // Send verification email
        await sendVerificationEmail(email, verificationToken)

        return NextResponse.json(
            {
                message: 'Conta criada com sucesso! Verifique seu e-mail.',
                user,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Register error:', error)
        return NextResponse.json(
            { error: 'Erro ao criar conta. Tente novamente.' },
            { status: 500 }
        )
    }
}
