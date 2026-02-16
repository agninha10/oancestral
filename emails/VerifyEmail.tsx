import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

interface VerifyEmailProps {
    token: string
}

export default function VerifyEmail({ token }: VerifyEmailProps) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const verificationUrl = `${baseUrl}/auth/verify?token=${token}`

    return (
        <Html>
            <Head />
            <Preview>Confirme seu e-mail para ativar sua conta</Preview>
            <Tailwind>
                <Body className="bg-stone-50 text-slate-800">
                    <Container className="mx-auto px-6 py-10">
                        <Section className="text-center mb-10">
                            <Text className="text-sm uppercase tracking-[0.35em] text-slate-500">
                                O Ancestral
                            </Text>
                            <Heading className="font-serif text-3xl text-slate-900 mt-3">
                                Bem-vindo à Forja
                            </Heading>
                        </Section>

                        <Section className="bg-white border border-stone-200 rounded-2xl px-8 py-10 shadow-sm">
                            <Text className="text-base text-slate-700 leading-relaxed">
                                Para acessar os conhecimentos ancestrais, confirme que este
                                e-mail é seu.
                            </Text>

                            <Section className="text-center mt-8">
                                <Button
                                    href={verificationUrl}
                                    className="bg-slate-900 text-stone-50 px-6 py-3 rounded-md text-sm font-semibold"
                                >
                                    Confirmar E-mail
                                </Button>
                            </Section>

                            <Text className="text-xs text-slate-500 mt-8">
                                Se você não solicitou este cadastro, ignore este e-mail.
                            </Text>
                        </Section>

                        <Section className="text-center mt-8">
                            <Text className="text-xs text-slate-500">
                                O Ancestral • Sabedoria que atravessa gerações
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
