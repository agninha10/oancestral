import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
    title: 'Política de Privacidade | O Ancestral',
    description: 'Saiba como o O Ancestral coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.',
    alternates: { canonical: '/politica-de-privacidade' },
};

const LAST_UPDATED = '20 de março de 2026';
const CONTACT_EMAIL = 'privacidade@oancestral.com.br';

export default function PoliticaDePrivacidadePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-zinc-950">
                <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">

                    {/* Header */}
                    <div className="mb-12 border-b border-zinc-800 pb-10">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-500">
                            Legal
                        </p>
                        <h1 className="font-serif text-4xl font-bold text-zinc-50 md:text-5xl">
                            Política de Privacidade
                        </h1>
                        <p className="mt-4 text-sm text-zinc-500">
                            Última atualização: <span className="text-zinc-400">{LAST_UPDATED}</span>
                        </p>
                        <p className="mt-3 text-zinc-400">
                            Esta Política de Privacidade explica como <strong className="text-zinc-300">O Ancestral</strong>{' '}
                            (&ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou &ldquo;plataforma&rdquo;) coleta, utiliza, armazena e
                            protege seus dados pessoais, em conformidade com a{' '}
                            <strong className="text-zinc-300">
                                Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)
                            </strong>
                            .
                        </p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert prose-zinc max-w-none
                        prose-headings:font-serif prose-headings:font-bold prose-headings:text-zinc-50
                        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-3
                        prose-h3:text-lg prose-h3:text-amber-400 prose-h3:mt-8 prose-h3:mb-3
                        prose-p:text-zinc-400 prose-p:leading-relaxed
                        prose-li:text-zinc-400 prose-li:leading-relaxed
                        prose-strong:text-zinc-300 prose-strong:font-semibold
                        prose-a:text-amber-400 prose-a:no-underline hover:prose-a:text-amber-300
                        prose-ul:my-4 prose-ul:space-y-1
                    ">

                        <h2>1. Quem Somos</h2>
                        <p>
                            <strong>O Ancestral</strong> é uma plataforma digital de educação em saúde, biohacking e
                            alta performance, com sede no Brasil. Somos o <strong>Controlador</strong> dos seus dados
                            pessoais conforme definido na LGPD. Para questões relacionadas à privacidade, entre em
                            contato pelo e-mail{' '}
                            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                        </p>

                        <h2>2. Dados que Coletamos</h2>

                        <h3>2.1 Dados de Identificação e Conta</h3>
                        <p>Coletamos os seguintes dados quando você cria uma conta ou utiliza nossa plataforma:</p>
                        <ul>
                            <li>
                                <strong>Nome completo</strong> — fornecido diretamente por você no cadastro ou
                                obtido automaticamente via Login Social (Google ou Apple).
                            </li>
                            <li>
                                <strong>Endereço de e-mail</strong> — necessário para autenticação, comunicações
                                transacionais e recuperação de conta.
                            </li>
                            <li>
                                <strong>Foto de perfil</strong> — obtida opcionalmente via Login Social (Google ou
                                Apple) ou enviada por você. Nenhuma foto é obrigatória.
                            </li>
                            <li>
                                <strong>Senha criptografada</strong> — quando você opta pelo cadastro tradicional
                                (e-mail e senha), armazenamos <strong>exclusivamente o hash bcrypt</strong> da sua
                                senha. Nunca armazenamos sua senha em texto puro.
                            </li>
                        </ul>

                        <h3>2.2 Dados de Uso e Progresso</h3>
                        <ul>
                            <li>
                                <strong>Histórico de progresso nos cursos</strong> — quais aulas foram assistidas,
                                percentual de conclusão e certificados emitidos.
                            </li>
                            <li>
                                <strong>Publicações e interações no Fórum (A Forja)</strong> — posts, respostas,
                                curtidas e categorias frequentadas.
                            </li>
                            <li>
                                <strong>Pontos de XP, nível e conquistas (Badges)</strong> — dados de gamificação
                                gerados pelo seu engajamento na plataforma.
                            </li>
                        </ul>

                        <h3>2.3 Dados de Saúde e Hábitos (Fasting Tracker)</h3>
                        <p>
                            O <strong>Protocolo de Jejum</strong> permite que você registre voluntariamente seus
                            ciclos de jejum intermitente. Isso inclui:
                        </p>
                        <ul>
                            <li>Horário de início e término dos jejuns;</li>
                            <li>Duração total de cada protocolo;</li>
                            <li>Histórico de sessões concluídas ou interrompidas.</li>
                        </ul>
                        <p>
                            <strong>
                                Esses dados são de natureza sensível (saúde) e estão sujeitos a proteção
                                reforçada sob a LGPD.
                            </strong>{' '}
                            Eles são utilizados <strong>exclusivamente</strong> para:
                        </p>
                        <ul>
                            <li>Exibir seu histórico pessoal de jejum dentro da plataforma;</li>
                            <li>Calcular pontos de XP e desbloquear badges de gamificação;</li>
                            <li>Gerar estatísticas de acompanhamento pessoal (visíveis apenas para você).</li>
                        </ul>
                        <p>
                            <strong>
                                Dados do Fasting Tracker NUNCA são compartilhados com terceiros, anunciantes,
                                parceiros comerciais ou qualquer entidade externa.
                            </strong>
                        </p>

                        <h3>2.4 Dados Técnicos e Cookies</h3>
                        <ul>
                            <li>
                                <strong>Sessão de autenticação</strong> — armazenamos um cookie seguro e criptografado
                                (HttpOnly, SameSite) para manter você conectado. Esse cookie não contém dados pessoais
                                em texto puro.
                            </li>
                            <li>
                                <strong>Logs técnicos</strong> — endereço IP, tipo de navegador e data/hora de acesso,
                                coletados para fins de segurança e diagnóstico de erros.
                            </li>
                        </ul>

                        <h2>3. Base Legal para o Tratamento</h2>
                        <p>Tratamos seus dados com base nas seguintes hipóteses previstas na LGPD:</p>
                        <ul>
                            <li>
                                <strong>Execução de contrato</strong> (Art. 7º, V) — para criar sua conta e
                                fornecer os serviços contratados.
                            </li>
                            <li>
                                <strong>Legítimo interesse</strong> (Art. 7º, IX) — para segurança da plataforma,
                                prevenção a fraudes e melhoria dos serviços.
                            </li>
                            <li>
                                <strong>Consentimento</strong> (Art. 7º, I) — para o uso de dados de saúde do
                                Fasting Tracker, coletados apenas quando você utiliza voluntariamente o recurso.
                            </li>
                            <li>
                                <strong>Cumprimento de obrigação legal</strong> (Art. 7º, II) — quando exigido por
                                lei ou autoridade competente.
                            </li>
                        </ul>

                        <h2>4. Como Utilizamos seus Dados</h2>
                        <ul>
                            <li>Autenticar seu acesso à plataforma;</li>
                            <li>Exibir seu nome e foto de perfil na comunidade;</li>
                            <li>Registrar e exibir seu progresso nos cursos;</li>
                            <li>Calcular sua pontuação de XP e desbloqueio de badges;</li>
                            <li>Enviar e-mails transacionais (confirmação de conta, notificações de conquistas);</li>
                            <li>Garantir a segurança e integridade da plataforma;</li>
                            <li>Cumprir obrigações legais e regulatórias.</li>
                        </ul>

                        <h2>5. Compartilhamento de Dados</h2>
                        <p>
                            <strong>Não vendemos seus dados pessoais.</strong> O compartilhamento ocorre apenas nas
                            situações abaixo:
                        </p>
                        <ul>
                            <li>
                                <strong>Provedores de serviço essenciais</strong> — hospedagem de servidores,
                                serviço de envio de e-mail transacional — vinculados por contratos que exigem
                                conformidade com a LGPD.
                            </li>
                            <li>
                                <strong>Processadores de pagamento</strong> — para transações de assinatura,
                                apenas os dados estritamente necessários são transmitidos ao gateway.
                            </li>
                            <li>
                                <strong>Autoridades competentes</strong> — quando exigido por lei, ordem judicial
                                ou investigação legítima.
                            </li>
                        </ul>
                        <p>
                            <strong>
                                Dados do Fasting Tracker e de saúde não são compartilhados com nenhum terceiro,
                                em nenhuma hipótese.
                            </strong>
                        </p>

                        <h2>6. Segurança dos Dados</h2>
                        <p>Adotamos medidas técnicas e administrativas para proteger seus dados, incluindo:</p>
                        <ul>
                            <li>Senhas armazenadas exclusivamente como hash bcrypt (fator 10);</li>
                            <li>Cookies de sessão com flags HttpOnly, Secure e SameSite=Lax;</li>
                            <li>Comunicação via HTTPS/TLS em toda a plataforma;</li>
                            <li>Acesso restrito ao banco de dados, limitado a sistemas e pessoal autorizados.</li>
                        </ul>
                        <p>
                            Em caso de incidente de segurança que possa afetar seus dados, notificaremos a Autoridade
                            Nacional de Proteção de Dados (ANPD) e os usuários impactados nos prazos legais.
                        </p>

                        <h2>7. Retenção de Dados</h2>
                        <p>
                            Mantemos seus dados enquanto sua conta estiver ativa. Ao solicitar exclusão da conta,
                            seus dados são removidos em até <strong>30 dias</strong>, exceto quando a retenção for
                            obrigatória por lei (ex: registros fiscais).
                        </p>

                        <h2>8. Seus Direitos como Titular</h2>
                        <p>Nos termos da LGPD, você tem direito a:</p>
                        <ul>
                            <li><strong>Confirmação e acesso</strong> — saber quais dados tratamos sobre você;</li>
                            <li><strong>Correção</strong> — solicitar a atualização de dados incompletos ou incorretos;</li>
                            <li>
                                <strong>Anonimização, bloqueio ou eliminação</strong> — de dados desnecessários
                                ou tratados em desconformidade;
                            </li>
                            <li>
                                <strong>Portabilidade</strong> — receber seus dados em formato estruturado;
                            </li>
                            <li>
                                <strong>Revogação de consentimento</strong> — especialmente para dados do Fasting
                                Tracker, que podem ser excluídos a qualquer momento nas configurações do perfil;
                            </li>
                            <li>
                                <strong>Oposição</strong> — ao tratamento com base no legítimo interesse.
                            </li>
                        </ul>
                        <p>
                            Para exercer qualquer um desses direitos, entre em contato:{' '}
                            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Responderemos em até{' '}
                            <strong>15 dias úteis</strong>.
                        </p>

                        <h2>9. Alterações nesta Política</h2>
                        <p>
                            Podemos atualizar esta Política periodicamente. Notificaremos você por e-mail ou aviso
                            na plataforma em caso de mudanças significativas. O uso continuado dos serviços após a
                            notificação constitui aceite das alterações.
                        </p>

                        <h2>10. Contato e Encarregado (DPO)</h2>
                        <p>
                            Para exercer seus direitos, tirar dúvidas ou registrar reclamações sobre o tratamento
                            de dados pessoais:
                        </p>
                        <ul>
                            <li>
                                <strong>E-mail:</strong>{' '}
                                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                            </li>
                        </ul>
                        <p>
                            Você também pode registrar reclamações junto à{' '}
                            <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong> em{' '}
                            <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">
                                www.gov.br/anpd
                            </a>
                            .
                        </p>
                    </div>

                    {/* Bottom nav */}
                    <div className="mt-16 flex flex-col gap-3 border-t border-zinc-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            href="/termos-de-servico"
                            className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                        >
                            Ler os Termos de Serviço →
                        </Link>
                        <Link
                            href="/"
                            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            ← Voltar ao início
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
