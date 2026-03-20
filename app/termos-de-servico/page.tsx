import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
    title: 'Termos de Serviço | O Ancestral',
    description: 'Leia as regras de uso da plataforma O Ancestral — direitos, responsabilidades e regras da comunidade.',
    alternates: { canonical: '/termos-de-servico' },
};

const LAST_UPDATED = '20 de março de 2026';
const CONTACT_EMAIL = 'contato@oancestral.com.br';

export default function TermosDeServico() {
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
                            Termos de Serviço
                        </h1>
                        <p className="mt-4 text-sm text-zinc-500">
                            Última atualização: <span className="text-zinc-400">{LAST_UPDATED}</span>
                        </p>
                        <p className="mt-3 text-zinc-400">
                            Ao criar uma conta ou utilizar qualquer recurso de{' '}
                            <strong className="text-zinc-300">O Ancestral</strong>, você declara ter lido, compreendido
                            e concordado com estes Termos de Serviço (&ldquo;Termos&rdquo;). Se não concordar com
                            qualquer disposição, não utilize nossa plataforma.
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

                        <h2>1. A Plataforma</h2>
                        <p>
                            <strong>O Ancestral</strong> é uma plataforma digital que oferece cursos em vídeo,
                            e-books, uma comunidade (o Fórum &ldquo;A Forja&rdquo;) e ferramentas de
                            acompanhamento de hábitos como o Protocolo de Jejum Intermitente. O acesso a
                            determinados recursos pode exigir assinatura ativa.
                        </p>

                        <h2>2. Isenção de Responsabilidade Médica e Nutricional</h2>

                        <div className="not-prose rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 my-6">
                            <p className="text-sm font-semibold text-amber-400 mb-2 uppercase tracking-wide">
                                ⚠️ Aviso Importante
                            </p>
                            <p className="text-sm text-zinc-300 leading-relaxed">
                                Todo o conteúdo disponível em O Ancestral — incluindo cursos, vídeos, e-books,
                                artigos de blog e o Protocolo de Jejum Intermitente — tem caráter{' '}
                                <strong>estritamente educacional e informativo</strong>. Ele não constitui,
                                nem deve ser interpretado como, aconselhamento médico, nutricional, terapêutico
                                ou diagnóstico de qualquer condição de saúde.
                            </p>
                        </div>

                        <p>
                            <strong>
                                Antes de iniciar qualquer protocolo de jejum, mudança alimentar ou rotina de
                                exercícios divulgada na plataforma, consulte obrigatoriamente um médico,
                                nutricionista ou profissional de saúde habilitado.
                            </strong>
                        </p>
                        <p>
                            O usuário é o <strong>único e integral responsável</strong> pela implementação
                            dos protocolos apresentados. O Ancestral, seus criadores, instrutores e parceiros
                            não se responsabilizam por quaisquer danos à saúde, efeitos adversos ou
                            consequências decorrentes do uso das informações disponibilizadas na plataforma.
                        </p>
                        <p>
                            Esta isenção se aplica especialmente a pessoas com condições médicas preexistentes,
                            gestantes, lactantes, menores de 18 anos, idosos ou qualquer grupo de risco.
                        </p>

                        <h2>3. Conta de Usuário</h2>
                        <h3>3.1 Cadastro</h3>
                        <p>
                            Para acessar os recursos da plataforma, você deve criar uma conta fornecendo
                            informações verdadeiras, precisas e atualizadas. Você é responsável por manter
                            a confidencialidade de suas credenciais de acesso.
                        </p>
                        <h3>3.2 Responsabilidade pelo Acesso</h3>
                        <p>
                            Toda atividade realizada a partir de sua conta é de sua responsabilidade. Em caso
                            de acesso não autorizado, notifique-nos imediatamente em{' '}
                            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                        </p>
                        <h3>3.3 Encerramento</h3>
                        <p>
                            Você pode encerrar sua conta a qualquer momento nas configurações de perfil.
                            Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos.
                        </p>

                        <h2>4. Regras da Comunidade — A Forja</h2>
                        <p>
                            O Fórum &ldquo;A Forja&rdquo; é um espaço de troca entre membros que compartilham
                            o objetivo de alta performance e saúde. Para preservar esse ambiente, as seguintes
                            condutas são <strong>estritamente proibidas</strong>:
                        </p>
                        <ul>
                            <li>
                                <strong>Spam e autopromoção</strong> — publicação de links de afiliados não
                                autorizados, anúncios ou mensagens repetitivas com fins comerciais;
                            </li>
                            <li>
                                <strong>Discurso de ódio e desrespeito</strong> — ofensas, discriminação por
                                raça, gênero, religião, orientação sexual, condição de saúde ou qualquer
                                outra característica pessoal;
                            </li>
                            <li>
                                <strong>Conteúdo inadequado</strong> — material sexual explícito, violento,
                                ilegal ou que viole direitos de terceiros;
                            </li>
                            <li>
                                <strong>Desinformação de saúde</strong> — afirmações médicas não embasadas,
                                conselhos perigosos ou conteúdo que contradiga consenso científico estabelecido;
                            </li>
                            <li>
                                <strong>Assédio e perseguição</strong> — mensagens repetitivas e indesejadas
                                direcionadas a outros membros.
                            </li>
                        </ul>
                        <p>
                            As violações são julgadas pelos <strong>Moderadores</strong> da plataforma, que
                            podem remover conteúdo, emitir avisos, suspender temporariamente ou{' '}
                            <strong>banir permanentemente o usuário sem direito a reembolso</strong>, a critério
                            exclusivo da equipe de moderação.
                        </p>

                        <h2>5. Propriedade Intelectual</h2>
                        <h3>5.1 Conteúdo da Plataforma</h3>
                        <p>
                            Todo o conteúdo disponível em O Ancestral — incluindo, mas não se limitando a,
                            vídeoaulas, e-books, artigos, imagens, logotipos, trilhas sonoras e o código-fonte
                            da plataforma — é <strong>propriedade exclusiva de O Ancestral</strong> ou de
                            seus licenciantes e está protegido por leis de direito autoral, marcas registradas
                            e outras normas de propriedade intelectual.
                        </p>
                        <h3>5.2 Uso Permitido</h3>
                        <p>
                            Ao adquirir acesso, concedemos a você uma <strong>licença pessoal, intransferível
                            e não exclusiva</strong> para consumir o conteúdo exclusivamente para uso privado
                            e não comercial.
                        </p>
                        <h3>5.3 Usos Proibidos</h3>
                        <p>É expressamente proibido:</p>
                        <ul>
                            <li>
                                Baixar, copiar, gravar ou redistribuir os vídeos, e-books ou qualquer
                                material da plataforma por qualquer meio;
                            </li>
                            <li>
                                Compartilhar credenciais de acesso com terceiros (compartilhamento de conta);
                            </li>
                            <li>
                                Utilizar o conteúdo para fins comerciais, incluindo revenda, cursos derivados
                                ou criação de materiais baseados no conteúdo protegido;
                            </li>
                            <li>
                                Publicar, transmitir ao vivo ou disponibilizar o conteúdo em qualquer
                                plataforma pública.
                            </li>
                        </ul>
                        <p>
                            O descumprimento desta cláusula sujeita o infrator a resposta civil e criminal
                            nos termos da Lei de Direitos Autorais (Lei nº 9.610/1998) e do Código Penal.
                        </p>

                        <h2>6. Pagamentos, Assinaturas e Reembolsos</h2>
                        <h3>6.1 Planos e Preços</h3>
                        <p>
                            O acesso premium a O Ancestral pode ser adquirido via assinatura mensal ou anual,
                            ou por compra única de produtos específicos (e-books, cursos avulsos). Os valores
                            vigentes estão disponíveis na página de planos da plataforma.
                        </p>
                        <h3>6.2 Processamento de Pagamento</h3>
                        <p>
                            Os pagamentos são processados por gateways de pagamento terceiros (como Kiwify).
                            Não armazenamos dados de cartão de crédito em nossos servidores. As transações
                            estão sujeitas também aos termos do processador de pagamento utilizado.
                        </p>
                        <h3>6.3 Cancelamento de Assinatura</h3>
                        <p>
                            Você pode cancelar sua assinatura a qualquer momento. O cancelamento terá efeito
                            ao final do período já pago, mantendo o acesso ativo até a data de expiração.
                        </p>
                        <h3>6.4 Reembolsos</h3>
                        <p>
                            Oferecemos reembolso integral em até <strong>7 (sete) dias corridos</strong> após
                            a compra, conforme o direito de arrependimento previsto no{' '}
                            <strong>Código de Defesa do Consumidor (Art. 49, Lei nº 8.078/1990)</strong>,
                            para compras realizadas fora de estabelecimento comercial. Após esse prazo, não
                            são concedidos reembolsos por desistência. Solicitações de reembolso devem ser
                            feitas por e-mail para{' '}
                            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                        </p>

                        <h2>7. Disponibilidade do Serviço</h2>
                        <p>
                            Nos esforçamos para manter a plataforma disponível 24 horas por dia, 7 dias por
                            semana. No entanto, não garantimos disponibilidade ininterrupta. Poderemos
                            realizar manutenções programadas ou emergenciais, e não seremos responsáveis
                            por perdas decorrentes de indisponibilidade temporária.
                        </p>

                        <h2>8. Limitação de Responsabilidade</h2>
                        <p>
                            Na máxima extensão permitida pela lei, O Ancestral não será responsável por
                            danos indiretos, incidentais, consequenciais ou punitivos, incluindo perda de
                            dados ou lucros cessantes, decorrentes do uso ou da impossibilidade de uso
                            da plataforma.
                        </p>

                        <h2>9. Alterações nos Termos</h2>
                        <p>
                            Reservamo-nos o direito de modificar estes Termos a qualquer momento.
                            Notificaremos usuários ativos por e-mail com antecedência mínima de{' '}
                            <strong>30 dias</strong> para alterações substanciais. O uso continuado
                            da plataforma após o prazo constitui aceite das novas condições.
                        </p>

                        <h2>10. Lei Aplicável e Foro</h2>
                        <p>
                            Estes Termos são regidos pelas leis da <strong>República Federativa do Brasil</strong>.
                            Fica eleito o foro da comarca de <strong>São Paulo — SP</strong> para dirimir
                            quaisquer controvérsias oriundas destes Termos, com renúncia expressa a qualquer
                            outro foro, por mais privilegiado que seja.
                        </p>

                        <h2>11. Contato</h2>
                        <p>
                            Para dúvidas sobre estes Termos ou qualquer aspecto da plataforma:
                        </p>
                        <ul>
                            <li>
                                <strong>E-mail:</strong>{' '}
                                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                            </li>
                        </ul>
                    </div>

                    {/* Bottom nav */}
                    <div className="mt-16 flex flex-col gap-3 border-t border-zinc-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            href="/politica-de-privacidade"
                            className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                        >
                            Ler a Política de Privacidade →
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
