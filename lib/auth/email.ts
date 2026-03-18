import crypto from 'crypto'
import { Resend } from 'resend'
import VerifyEmail from '@/emails/VerifyEmail'
import WelcomeEmail from '@/emails/WelcomeEmail'
import PasswordResetEmail from '@/emails/PasswordResetEmail'

export function generateToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

/** Generates a 6-digit numeric verification code for checkout-created accounts. */
export function generateVerificationCode(): string {
    return Math.floor(100_000 + Math.random() * 900_000).toString()
}

export async function sendVerificationEmail(
    email: string,
    code: string,
    name?: string
): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
        throw new Error('RESEND_API_KEY não configurada')
    }

    const resend = new Resend(apiKey)

    await resend.emails.send({
        from: 'O Ancestral <no-reply@oancestral.com.br>',
        to: email,
        subject: 'Confirme seu e-mail no O Ancestral',
        react: VerifyEmail({ code, name }),
    })
}

/**
 * Sends a welcome email to users created at checkout.
 * Includes a 6-digit verification code and a link to verify their email.
 * No password is requested — they use "Forgot password" to set one later.
 */
export async function sendWelcomeCheckoutEmail(
    email: string,
    name: string,
    verificationCode: string
): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
        console.error('[EMAIL] RESEND_API_KEY não configurada — e-mail de boas-vindas não enviado')
        return
    }

    const resend = new Resend(apiKey)

    await resend.emails.send({
        from: 'O Ancestral <no-reply@oancestral.com.br>',
        to: email,
        subject: `Bem-vindo ao O Ancestral, ${name.split(' ')[0]}! Confirme seu e-mail`,
        react: WelcomeEmail({ name, verificationCode }),
    })
}

export async function sendPasswordResetEmail(
    email: string,
    token: string,
    name?: string
): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
        throw new Error('RESEND_API_KEY não configurada')
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/update-password?token=${token}`

    const resend = new Resend(apiKey)

    await resend.emails.send({
        from: 'O Ancestral <no-reply@oancestral.com.br>',
        to: email,
        subject: 'Redefina sua senha no O Ancestral',
        react: PasswordResetEmail({ name, resetUrl, expiresInHours: 24 }),
    })
}
