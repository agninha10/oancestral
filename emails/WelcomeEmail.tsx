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
  Hr,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface WelcomeEmailProps {
  name: string;
  verificationCode: string;
}

export default function WelcomeEmail({ name, verificationCode }: WelcomeEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const verificationUrl = `${baseUrl}/auth/verify?token=${verificationCode}`;
  const firstName = name.split(" ")[0];

  return (
    <Html>
      <Head />
      <Preview>
        Bem-vindo ao O Ancestral, {firstName}! Seu código de verificação: {verificationCode}
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
                Bem-vindo à Forja, {firstName}.
              </Heading>
              <Text className="text-stone-400 text-sm mt-2">
                Sua jornada ancestral começa agora.
              </Text>
            </Section>

            {/* Main card */}
            <Section className="bg-stone-900 border border-stone-800 rounded-2xl px-8 py-10">
              <Text className="text-base text-stone-300 leading-relaxed">
                Sua conta no portal foi criada automaticamente ao garantir seu produto. Para ativar
                o acesso completo ao portal, confirme seu e-mail usando o código abaixo:
              </Text>

              {/* Verification code block */}
              <Section className="text-center my-8 bg-stone-950 border border-amber-500/30 rounded-xl px-6 py-8">
                <Text className="text-xs uppercase tracking-[0.3em] text-amber-500 font-semibold mb-3">
                  Seu código de verificação
                </Text>
                <Text className="text-5xl font-bold tracking-[0.2em] text-amber-400 my-0">
                  {verificationCode}
                </Text>
                <Text className="text-xs text-stone-500 mt-3">
                  Válido por 24 horas
                </Text>
              </Section>

              {/* Or use link button */}
              <Section className="text-center mb-4">
                <Text className="text-stone-400 text-sm mb-4">
                  Ou clique no botão abaixo para verificar automaticamente:
                </Text>
                <Button
                  href={verificationUrl}
                  className="bg-amber-500 text-stone-950 px-8 py-3 rounded-xl text-sm font-bold"
                >
                  Verificar meu e-mail
                </Button>
              </Section>

              <Hr className="border-stone-800 my-6" />

              {/* Login reminder */}
              <Text className="text-sm text-stone-400 leading-relaxed">
                Para acessar o portal, use o link{" "}
                <a
                  href={`${baseUrl}/auth/login`}
                  className="text-amber-400 underline"
                >
                  oancestral.com.br/auth/login
                </a>{" "}
                e clique em <strong className="text-stone-200">&quot;Esqueci minha senha&quot;</strong> para
                criar sua senha de acesso.
              </Text>

              <Text className="text-xs text-stone-600 mt-6">
                Se você não realizou nenhuma compra no O Ancestral, ignore este e-mail.
              </Text>
            </Section>

            {/* Footer com unsubscribe */}
            <Section className="text-center mt-8">
              <Text className="text-xs text-stone-600 m-0">
                O Ancestral • Sabedoria que atravessa gerações
              </Text>
              <Text className="text-xs text-stone-700 mt-2 m-0">
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
