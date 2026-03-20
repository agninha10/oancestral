import {
    Body,
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

interface EmailChangeEmailProps {
    code: string;
    name?: string;
    newEmail: string;
}

export default function EmailChangeEmail({ code, name, newEmail }: EmailChangeEmailProps) {
    const firstName = name ? name.split(' ')[0] : 'Guerreiro';

    return (
        <Html>
            <Head />
            <Preview>Código para confirmar seu novo e-mail: {code}</Preview>
            <Tailwind>
                <Body className="bg-stone-950 text-stone-100 font-sans">
                    <Container className="mx-auto max-w-[600px] px-6 py-10">

                        <Section className="text-center mb-8">
                            <Text className="text-xs uppercase tracking-[0.35em] text-amber-500 font-semibold m-0">
                                O Ancestral
                            </Text>
                            <Heading className="font-serif text-3xl text-stone-50 mt-2 mb-0">
                                Confirme seu novo e-mail, {firstName}.
                            </Heading>
                            <Text className="text-stone-400 text-sm mt-1 mb-0">
                                Você solicitou a alteração do seu endereço de e-mail.
                            </Text>
                        </Section>

                        <Section className="bg-stone-900 border border-stone-800 rounded-2xl px-8 py-10">
                            <Text className="text-base text-stone-300 leading-relaxed mt-0">
                                Para confirmar que{' '}
                                <span className="text-amber-400 font-semibold">{newEmail}</span>{' '}
                                é seu novo e-mail, insira o código abaixo no painel do O Ancestral:
                            </Text>

                            <Section className="text-center my-8 bg-stone-950 border border-amber-500/30 rounded-xl px-6 py-8">
                                <Text className="text-xs uppercase tracking-[0.3em] text-amber-500 font-semibold mb-3 mt-0">
                                    Código de confirmação
                                </Text>
                                <Text className="text-5xl font-bold tracking-[0.2em] text-amber-400 my-0">
                                    {code}
                                </Text>
                                <Text className="text-xs text-stone-500 mt-3 mb-0">
                                    Válido por 1 hora
                                </Text>
                            </Section>

                            <Hr className="border-stone-800 my-6" />

                            <Text className="text-xs text-stone-600 mt-0 mb-0">
                                Se você não solicitou esta alteração, ignore este e-mail. Seu
                                e-mail atual permanece ativo e nenhuma mudança será feita.
                            </Text>
                        </Section>

                        <Section className="text-center mt-8">
                            <Text className="text-xs text-stone-600 m-0">
                                O Ancestral • Sabedoria que atravessa gerações
                            </Text>
                        </Section>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
