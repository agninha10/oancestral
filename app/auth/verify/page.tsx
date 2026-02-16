import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import VerifyResult from './verify-result'

export const metadata: Metadata = {
    title: 'Verificação de E-mail | O Ancestral',
    description: 'Confirme seu cadastro para ativar sua conta',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

interface VerifyPageProps {
    searchParams?: {
        token?: string
    }
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
    const token = searchParams?.token

    if (!token) {
        return <VerifyResult status="invalid" />
    }

    const user = await prisma.user.findFirst({
        where: {
            verificationToken: token,
        },
    })

    if (!user) {
        return <VerifyResult status="invalid" />
    }

    if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
        return <VerifyResult status="expired" />
    }

    if (user.emailVerified) {
        if (user.verificationToken || user.verificationTokenExpires) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    verificationToken: null,
                    verificationTokenExpires: null,
                },
            })
        }

        return <VerifyResult status="already" />
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: new Date(),
            verificationToken: null,
            verificationTokenExpires: null,
        },
    })

    return <VerifyResult status="success" />
}
