import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface VerifyEmailProps {
    /** Código de 6 dígitos (também usado como token na URL de verificação) */
    code: string;
    /** Nome do usuário para personalizar o e-mail */
    name?: string;
}

export default function VerifyEmail({ code, name }: VerifyEmailProps) {
    const baseUrl   = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oancestral.com.br';
    const verifyUrl = `${baseUrl}/auth/verify?token=${code}`;
    const firstName = name ? name.split(' ')[0] : 'Guerreiro';

    return (
        <Html>
            <Head />
            <Preview>
                Seu código de verificação O Ancestral: {code}
            </Preview>
            <Tailwind>
                <Body className="bg-stone-950 text-stone-100 font-sans">
                    <Container className="mx-auto max-w-[600px] px-6 py-10">

                        {/* ── Logo / Brand ───────────────────────────────────── */}
                        <Section className="text-center mb-8">
                            <Text className="text-xs uppercase tracking-[0.35em] text-amber-500 font-semibold m-0">
                                O Ancestral
                            </Text>
                            <Heading className="font-serif text-3xl text-stone-50 mt-2 mb-0">
                                Bem-vindo à Forja, {firstName}.
                            </Heading>
                            <Text className="text-stone-400 text-sm mt-1 mb-0">
                                Confirme seu e-mail para ativar sua conta.
                            </Text>
                        </Section>

                        {/* ── Main card ──────────────────────────────────────── */}
                        <Section className="bg-stone-900 border border-stone-800 rounded-2xl px-8 py-10">

                            <Text className="text-base text-stone-300 leading-relaxed mt-0">
                                Para acessar os conhecimentos ancestrais, confirme que este
                                e-mail é seu usando o código abaixo:
                            </Text>

                            {/* ── Code block ─────────────────────────────────── */}
                            <Section className="text-center my-8 bg-stone-950 border border-amber-500/30 rounded-xl px-6 py-8">
                                <Text className="text-xs uppercase tracking-[0.3em] text-amber-500 font-semibold mb-3 mt-0">
                                    Seu código de verificação
                                </Text>
                                <Text className="text-5xl font-bold tracking-[0.2em] text-amber-400 my-0">
                                    {code}
                                </Text>
                                <Text className="text-xs text-stone-500 mt-3 mb-0">
                                    Válido por 24 horas
                                </Text>
                            </Section>

                            {/* ── One-click button ───────────────────────────── */}
                            <Section className="text-center mb-4">
                                <Text className="text-stone-400 text-sm mb-4 mt-0">
                                    Ou clique no botão abaixo para verificar automaticamente:
                                </Text>
                                <Button
                                    href={verifyUrl}
                                    className="bg-amber-500 text-stone-950 px-8 py-4 rounded-xl text-sm font-bold"
                                >
                                    Confirmar E-mail →
                                </Button>
                            </Section>

                            <Hr className="border-stone-800 my-6" />

                            <Text className="text-xs text-stone-600 mt-0 mb-0">
                                Se você não criou uma conta no O Ancestral, pode ignorar este
                                e-mail com segurança. Nenhuma ação será tomada.
                            </Text>
                        </Section>

                        {/* ── Footer com unsubscribe ─────────────────────────── */}
                        <Section className="text-center mt-8">
                            <Text className="text-xs text-stone-600 m-0">
                                O Ancestral • Sabedoria que atravessa gerações
                            </Text>
                            <Text className="text-xs text-stone-700 mt-2 mb-0">
                                Não quer mais receber nossos e-mails?{' '}
                                <a
                                    href={`${baseUrl}/api/unsubscribe`}
                                    className="text-stone-500 underline"
                                >
                                    Cancelar inscrição
                                </a>
                            </Text>
                        </Section>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
