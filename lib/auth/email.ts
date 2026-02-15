import crypto from 'crypto'

export function generateToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

export async function sendVerificationEmail(
    email: string,
    token: string
): Promise<void> {
    // TODO: Implement with Resend or Nodemailer
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`

    console.log('📧 Verification Email')
    console.log('To:', email)
    console.log('Link:', verificationUrl)
    console.log('---')

    // For now, just log. In production, send actual email
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
