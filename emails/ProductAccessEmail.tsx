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

interface ProductAccessEmailProps {
    /** Nome completo do cliente */
    customerName: string;
    /** Emoji do produto (📖 ⚡ 👑) */
    productEmoji: string;
    /** Título do card: "Seu guia chegou!" */
    title: string;
    /** Subtítulo: "Guia Definitivo do Jejum Intermitente" */
    subtitle: string;
    /** Parágrafo de instruções */
    body: string;
    /** URL do botão CTA */
    ctaUrl: string;
    /** Rótulo do botão CTA */
    ctaLabel: string;
}

export default function ProductAccessEmail({
    customerName,
    productEmoji,
    title,
    subtitle,
    body,
    ctaUrl,
    ctaLabel,
}: ProductAccessEmailProps) {
    const firstName = customerName.split(' ')[0];
    const loginUrl = ctaUrl.startsWith('http') ? ctaUrl : `https://oancestral.com.br${ctaUrl}`;

    return (
        <Html>
            <Head />
            <Preview>
                {productEmoji} {title} — O Ancestral
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
                                Olá, {firstName}.
                            </Heading>
                            <Text className="text-stone-400 text-sm mt-1 mb-0">
                                Temos uma boa notícia para você.
                            </Text>
                        </Section>

                        {/* ── Main card ──────────────────────────────────────── */}
                        <Section className="bg-stone-900 border border-stone-800 rounded-2xl px-8 py-8">

                            {/* Product badge */}
                            <Section className="text-center mb-6">
                                <Text className="text-5xl m-0">{productEmoji}</Text>
                                <Text className="text-xs uppercase tracking-[0.3em] text-amber-500 font-semibold mt-3 mb-1">
                                    {subtitle}
                                </Text>
                                <Heading className="text-stone-50 text-2xl font-bold m-0">
                                    {title}
                                </Heading>
                            </Section>

                            <Hr className="border-stone-800 my-6" />

                            {/* Instructions */}
                            <Text className="text-stone-300 text-base leading-relaxed">
                                {body}
                            </Text>

                            {/* CTA button */}
                            <Section className="text-center my-8">
                                <Button
                                    href={loginUrl}
                                    className="bg-amber-500 text-stone-950 px-8 py-4 rounded-xl text-sm font-bold"
                                >
                                    {ctaLabel} →
                                </Button>
                            </Section>

                            <Hr className="border-stone-800 my-6" />

                            {/* Login reminder */}
                            <Text className="text-sm text-stone-400 leading-relaxed">
                                Para acessar, entre em{' '}
                                <a
                                    href="https://oancestral.com.br/auth/login"
                                    className="text-amber-400 underline"
                                >
                                    oancestral.com.br/auth/login
                                </a>{' '}
                                com o e-mail em que você recebeu esta mensagem. Se ainda não criou
                                uma senha, clique em{' '}
                                <strong className="text-stone-200">&quot;Esqueci minha senha&quot;</strong>{' '}
                                para criar uma.
                            </Text>

                            <Text className="text-xs text-stone-600 mt-6 mb-0">
                                Se você não realizou nenhuma compra no O Ancestral e recebeu este
                                e-mail por engano, pode ignorá-lo com segurança.
                            </Text>
                        </Section>

                        {/* ── Footer ─────────────────────────────────────────── */}
                        <Section className="text-center mt-8">
                            <Text className="text-xs text-stone-600 m-0">
                                O Ancestral • Sabedoria que atravessa gerações
                            </Text>
                            <Text className="text-xs text-stone-700 mt-1 m-0">
                                Este e-mail foi enviado a pedido da equipe de suporte.
                            </Text>
                        </Section>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
