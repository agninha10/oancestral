import crypto from 'crypto'
import { Resend } from 'resend'
import VerifyEmail from '@/emails/VerifyEmail'

export function generateToken(): string {
    return crypto.randomBytes(32).toString('hex')
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
