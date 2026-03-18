import { Html, Head, Body, Container, Section, Heading, Text, Button, Hr, Preview } from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

interface PasswordResetEmailProps {
    name?: string
    resetUrl: string
    expiresInHours?: number
}

export default function PasswordResetEmail({
    name,
    resetUrl,
    expiresInHours = 24,
}: PasswordResetEmailProps) {
    const firstName = name ? name.split(' ')[0] : 'Usuário'

    return (
        <Html>
            <Head />
            <Preview>
                Redefina sua senha no O Ancestral
            </Preview>
            <Tailwind>
                <Body className="bg-stone-950 text-stone-100">
                    <Container className="mx-auto max-w-[600px] px-6 py-10">
                        {/* Logo */}
                        <Section className="text-center mb-8">
                            <Text className="text-xs uppercase tracking-[0.35em] text-amber-500 font-semibold">
                                O Ancestral
                            </Text>
                            <Heading className="font-serif text-3xl text-stone-50 mt-2 mb-0">
                                Redefinir Senha
                            </Heading>
                        </Section>

                        {/* Main Card */}
                        <Section className="bg-stone-900 border border-stone-800 rounded-2xl px-8 py-10">
                            <Text className="text-base text-stone-300 leading-relaxed mt-0">
                                Oi {firstName},
                            </Text>

                            <Text className="text-base text-stone-300 leading-relaxed">
                                Recebemos um pedido para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:
                            </Text>

                            {/* CTA Button */}
                            <Section className="text-center my-8">
                                <Button
                                    href={resetUrl}
                                    className="bg-amber-500 text-stone-950 px-8 py-4 rounded-xl text-base font-bold"
                                >
                                    Redefinir Senha →
                                </Button>
                            </Section>

                            <Hr className="border-stone-800 my-6" />

                            <Text className="text-xs text-stone-600 mt-6 mb-0">
                                <strong>Importante:</strong> Este link é válido por {expiresInHours} horas. Se você não solicitou a redefinição de senha, ignore este e-mail.
                            </Text>

                            <Text className="text-xs text-stone-600 mt-4 mb-0">
                                Se o botão acima não funcionar, copie e cole este link em seu navegador:
                            </Text>

                            <Text className="text-xs text-amber-400 break-all mt-2 mb-0">
                                {resetUrl}
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Section className="text-center mt-8">
                            <Text className="text-xs text-stone-600 m-0">
                                O Ancestral • Sabedoria que atravessa gerações
                            </Text>
                            <Text className="text-xs text-stone-700 mt-2 m-0">
                                © 2026 O Ancestral. Todos os direitos reservados.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
