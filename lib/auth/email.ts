import crypto from 'crypto'
import { Resend } from 'resend'
import VerifyEmail from '@/emails/VerifyEmail'
import WelcomeEmail from '@/emails/WelcomeEmail'

export function generateToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

/** Generates a 6-digit numeric verification code for checkout-created accounts. */
export function generateVerificationCode(): string {
    return Math.floor(100_000 + Math.random() * 900_000).toString()
}

export async function sendVerificationEmail(
    email: string,
    token: string
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
        react: VerifyEmail({ token }),
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
    token: string
): Promise<void> {
    // TODO: Implement with Resend or Nodemailer
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password?token=${token}`

    console.log('📧 Password Reset Email')
    console.log('To:', email)
    console.log('Link:', resetUrl)
    console.log('---')

    // For now, just log. In production, send actual email
}
