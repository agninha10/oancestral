import type { Metadata } from 'next'
import Link from 'next/link'
import { Playfair_Display } from 'next/font/google'
import {
    Leaf,
    Shield,
    Clock,
    Droplet,
    Lock,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    BadgeCheck,
    Skull,
    FlaskConical,
    Bug,
} from 'lucide-react'
import { LandingNav } from './landing-nav'

// ─────────────────────────────────────────────────────────────────────────────
// Fonte serifada — Playfair Display exclusiva para esta página
// ─────────────────────────────────────────────────────────────────────────────
const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700', '900'],
    style: ['normal', 'italic'],
    variable: '--font-playfair',
    display: 'swap',
})

const CHECKOUT_URL = 'https://pay.kiwify.com.br/6ZxOdTr'

// ─────────────────────────────────────────────────────────────────────────────
// SEO Metadata
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    title: 'Repelentes Naturais: Proteja sua Biologia | O Ancestral',
    description:
        'Uma única picada de carrapato-estrela pode te proibir de comer carne para sempre. Aprenda a se proteger com receitas ancestrais que custam centavos — sem neurotoxinas, sem DEET.',
    keywords: [
        'repelente natural',
        'repelente caseiro',
        'síndrome alpha-gal',
        'carrapato-estrela',
        'DEET perigos',
        'óleos essenciais repelente',
        'repelente andiroba',
        'repelente neem',
        'repelente cravo',
        'receita repelente natural',
        'proteção natural insetos',
        'ebook repelente',
        'repelente indígena',
    ],
    robots: { index: true, follow: true },
    alternates: { canonical: '/ebook-repelente' },
    openGraph: {
        title: 'Repelentes Naturais: Proteja sua Biologia | O Ancestral',
        description:
            'Descubra por que o DEET é uma neurotoxina militar e aprenda as receitas ancestrais que protegem de verdade.',
        type: 'website',
        url: 'https://oancestral.com.br/ebook-repelente',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Repelentes Naturais: Proteja sua Biologia | O Ancestral',
        description:
            'Descubra por que o DEET é uma neurotoxina militar e aprenda as receitas ancestrais que protegem de verdade.',
    },
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente CTAButton — amber glow pulsante
// ─────────────────────────────────────────────────────────────────────────────
function CTAButton({
    href,
    children,
    className = '',
}: {
    href: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`cta-amber-glow inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold uppercase tracking-wider rounded-xl transition-colors duration-200 ${className}`}
        >
            {children}
        </a>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Dados das seções
// ─────────────────────────────────────────────────────────────────────────────
const DEET_CARDS = [
    {
        icon: Skull,
        title: 'Origem Militar',
        desc: 'Desenvolvido pelo Exército dos EUA em 1946 para uso em zonas de guerra. Nunca foi projetado para uso civil diário.',
        color: 'border-red-700/60 bg-red-950/30',
        iconColor: 'text-red-400',
    },
    {
        icon: FlaskConical,
        title: '17% Absorção em 6h',
        desc: 'Estudos confirmam que até 17% do DEET aplicado na pele entra diretamente na corrente sanguínea em apenas 6 horas.',
        color: 'border-orange-700/60 bg-orange-950/25',
        iconColor: 'text-orange-400',
    },
    {
        icon: AlertTriangle,
        title: 'Derrete Plástico',
        desc: 'O DEET dissolve plásticos, borrachas e roupas sintéticas — e ainda assim é aprovado para aplicação direta na pele de crianças.',
        color: 'border-yellow-700/60 bg-yellow-950/20',
        iconColor: 'text-yellow-400',
    },
    {
        icon: Bug,
        title: 'Danos Neurológicos',
        desc: 'Associado a convulsões e lesões cerebrais, especialmente em crianças com exposição prolongada. A ANVISA aprova o veneno, desde que ele não te mate imediatamente.',
        color: 'border-red-800/60 bg-red-950/30',
        iconColor: 'text-red-500',
    },
]

const ICARIDINA_CARDS = [
    { label: 'DEET', sub: 'Neurotóxico · Origem militar · Absorção dérmica comprovada', bad: true },
    { label: 'Icaridina', sub: 'Sem estudos de longo prazo · Ineficaz contra carrapatos · "Nova geração"', bad: true },
    { label: 'Receitas Naturais', sub: 'Sem toxicidade · Custo de centavos · Eficácia milenar comprovada', bad: false },
]

const CONTENT_CARDS = [
    {
        icon: Clock,
        title: 'Receitas em < 10 minutos',
        desc: 'Passo a passo completo para preparar repelentes de alta eficácia com ingredientes que você encontra em qualquer mercado, por centavos.',
    },
    {
        icon: Leaf,
        title: 'O Guia dos Óleos Essenciais',
        desc: 'Cravo, Andiroba e Neem: como usar cada óleo, concentrações corretas e como combinar para proteção máxima contra carrapatos, mosquitos e flebótomos.',
    },
    {
        icon: Shield,
        title: 'Regras de Ouro para Crianças & Pets',
        desc: 'Formulações seguras e diluições corretas para proteger quem mais precisa — sem colocar em risco o sistema nervoso em desenvolvimento.',
    },
    {
        icon: Droplet,
        title: 'Sabedoria Ticuna, Guarani e Xavante',
        desc: 'As três tribos que vivem há milênios na floresta tropical mais infestada do planeta — e nunca precisaram de um frasco de DEET para sobreviver.',
    },
]

const STATS = [
    { value: '34.000%', label: 'aumento de casos Alpha-gal (CDC)' },
    { value: '17%', label: 'do DEET absorvido em 6h' },
    { value: '0', label: 'cura existente para Alpha-gal' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────────────────────────────────────
export default function EbookRepelentePage() {
    return (
        <>
            {/* ── Estilos internos da landing page ── */}
            <style>{`
        /* Textura de grão sobre o fundo */
        .grain-bg::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.045;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
        }

        /* Glow âmbar pulsante no CTA */
        @keyframes amberGlowPulse {
          0%,100% {
            box-shadow:
              0 0 22px rgba(245,158,11,0.55),
              0 0 55px rgba(245,158,11,0.25),
              0 4px 24px rgba(0,0,0,0.45);
          }
          50% {
            box-shadow:
              0 0 40px rgba(245,158,11,0.9),
              0 0 90px rgba(245,158,11,0.45),
              0 4px 24px rgba(0,0,0,0.45);
          }
        }
        .cta-amber-glow { animation: amberGlowPulse 2.4s ease-in-out infinite; }

        /* Fade + slide para cima */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up        { animation: fadeUp 0.75s ease-out forwards; }
        .delay-100      { animation-delay: 0.10s; opacity: 0; }
        .delay-200      { animation-delay: 0.20s; opacity: 0; }
        .delay-300      { animation-delay: 0.30s; opacity: 0; }
        .delay-500      { animation-delay: 0.50s; opacity: 0; }

        /* Entrada dos cards de perigo */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .deet-card {
          animation: slideInLeft 0.6s ease-out forwards;
          opacity: 0;
        }
        .deet-card:nth-child(1) { animation-delay: 0.1s; }
        .deet-card:nth-child(2) { animation-delay: 0.25s; }
        .deet-card:nth-child(3) { animation-delay: 0.40s; }
        .deet-card:nth-child(4) { animation-delay: 0.55s; }

        /* Brilho sutil nos números estatísticos */
        .stat-value {
          text-shadow: 0 0 30px rgba(245,158,11,0.45);
        }

        /* Linha divisória âmbar */
        .amber-divider {
          width: 64px;
          height: 3px;
          background: linear-gradient(to right, transparent, #f59e0b, transparent);
          margin: 0 auto;
        }
      `}</style>

            <div className={`${playfair.variable} grain-bg bg-zinc-950 text-zinc-100 relative`}>

                <LandingNav />

                {/* ═══════════════════════════════════════════════════════════════
          1. HERO — O CHOQUE
        ═══════════════════════════════════════════════════════════════ */}
                <header className="relative min-h-svh flex items-center justify-center overflow-hidden">
                    {/* Gradiente radial de fundo */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(120,53,15,0.3)_0%,transparent_60%)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/0 via-zinc-950/40 to-zinc-950" />

                    {/* Elementos decorativos de fundo */}
                    <div className="absolute top-1/4 left-8 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl" aria-hidden="true" />
                    <div className="absolute bottom-1/3 right-8 w-48 h-48 rounded-full bg-amber-600/8 blur-2xl" aria-hidden="true" />

                    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 text-center py-36 sm:py-44">

                        {/* Badge de alerta */}
                        <div className="fade-up inline-flex items-center gap-2 bg-amber-950/50 border border-amber-700/60 text-amber-400 text-xs sm:text-sm font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full mb-10">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            Alerta de Saúde Pública — Leia antes do próximo churrasco
                        </div>

                        {/* H1 — serifado, impactante */}
                        <h1 className="font-[family-name:var(--font-playfair)] fade-up delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black leading-[1.08] text-white mb-8">
                            Uma Única Picada Pode Te{' '}
                            <span className="italic text-amber-400">
                                Proibir de Comer Carne
                            </span>{' '}
                            Para Sempre.
                        </h1>

                        {/* Subheadline */}
                        <p className="fade-up delay-200 text-lg sm:text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-14 leading-relaxed">
                            Conheça a síndrome Alpha-gal e saiba por que passar{' '}
                            <strong className="text-amber-300">veneno industrial</strong> na sua pele
                            é tão perigoso quanto os próprios carrapatos.
                        </p>

                        {/* CTA principal */}
                        <div className="fade-up delay-300 flex flex-col items-center gap-5">
                            <CTAButton
                                href={CHECKOUT_URL}
                                className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl py-5 sm:py-6 px-10 sm:px-14 w-full sm:w-auto"
                            >
                                <Leaf className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
                                QUERO O MANUAL DE PROTEÇÃO · R$ 29
                            </CTAButton>

                            <span className="flex items-center gap-2 text-zinc-500 text-sm">
                                <Lock className="w-4 h-4" aria-hidden="true" />
                                Pagamento 100% Seguro — PDF com Acesso Imediato
                            </span>
                        </div>

                        {/* Seta scroll-down */}
                        <div className="fade-up delay-500 mt-20 flex justify-center">
                            <div className="w-px h-16 bg-gradient-to-b from-amber-500/40 to-transparent" aria-hidden="true" />
                        </div>
                    </div>
                </header>

                <main>
                    {/* ═══════════════════════════════════════════════════════════════
              2. STATS — Números que assustam
            ═══════════════════════════════════════════════════════════════ */}
                    <section aria-label="Dados sobre a crise" className="py-16 bg-zinc-900/50 border-y border-zinc-800/50">
                        <div className="max-w-4xl mx-auto px-4 sm:px-8">
                            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 text-center">
                                {STATS.map((s) => (
                                    <div key={s.label} className="space-y-2">
                                        <dt className="stat-value font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-black text-amber-400">
                                            {s.value}
                                        </dt>
                                        <dd className="text-sm sm:text-base text-zinc-400 leading-snug">{s.label}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════════════════════════
              3. A CRISE SILENCIOSA — Alpha-gal
            ═══════════════════════════════════════════════════════════════ */}
                    <section aria-labelledby="alphagal-heading" className="py-24 sm:py-32 px-4 sm:px-8">
                        <div className="max-w-3xl mx-auto">
                            <div className="amber-divider mb-8" aria-hidden="true" />
                            <h2
                                id="alphagal-heading"
                                className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-black text-center text-white mb-6 leading-tight"
                            >
                                A Crise Silenciosa que o{' '}
                                <span className="italic text-amber-400">Brasil Ignora</span>
                            </h2>
                            <p className="text-center text-zinc-400 text-lg mb-16 leading-relaxed">
                                Confirmada pela USP e Fiocruz — e crescendo em silêncio por todo o território nacional.
                            </p>

                            {/* Bloco narrativo em prosa */}
                            <div className="space-y-8 text-zinc-300 text-lg leading-[1.85]">
                                <p>
                                    Você acaba de fazer um churrasco dos sonhos. Costela, picanha, linguiça. Algumas horas depois,{' '}
                                    <strong className="text-white">você acorda sufocado</strong>, com urticária espalhada pelo corpo
                                    e o coração disparado. Não foi o álcool. Não foi intoxicação alimentar.
                                </p>

                                <div className="border-l-2 border-amber-500 pl-6 py-1">
                                    <p className="text-xl font-[family-name:var(--font-playfair)] font-bold text-amber-300 italic">
                                        Foi uma picada de carrapato-estrela que você nem lembrava ter levado.
                                    </p>
                                </div>

                                <p>
                                    O <strong className="text-white">carrapato-estrela</strong> (<em>Amblyomma cajennense</em>) injeta
                                    um carboidrato chamado Alpha-gal no seu sangue. O seu sistema imunológico cria anticorpos
                                    permanentes contra ele — e o Alpha-gal está presente em toda carne de mamífero.
                                </p>

                                <p>
                                    O CDC americano registrou um crescimento de{' '}
                                    <strong className="text-amber-400">34.000% nos casos diagnosticados</strong> na última década.
                                    No Brasil, pesquisadores da USP e Fiocruz já confirmaram sua presença em múltiplos estados.
                                    A alergia é <strong className="text-white">permanente</strong>. Não existe cura.
                                </p>
                            </div>

                            {/* Card de impacto */}
                            <div className="mt-12 rounded-2xl border border-amber-700/50 bg-amber-950/20 p-8 text-center">
                                <p className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-white leading-snug">
                                    "Prevenir a picada custa centavos.{' '}
                                    <span className="text-amber-400 italic">
                                        Tratar a alergia custa milhares por ano.
                                    </span>{' '}
                                    A cura? Não existe."
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════════════════════════
              4. O VENENO NO FRASCO BONITO — DEET
            ═══════════════════════════════════════════════════════════════ */}
                    <section
                        aria-labelledby="deet-heading"
                        className="py-24 sm:py-32 px-4 sm:px-8 bg-zinc-900/30"
                    >
                        <div className="max-w-5xl mx-auto">
                            <div className="amber-divider mb-8" aria-hidden="true" />
                            <h2
                                id="deet-heading"
                                className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-black text-center text-white mb-6 leading-tight"
                            >
                                O Veneno no{' '}
                                <span className="italic text-amber-400">Frasco Bonito</span>
                            </h2>
                            <p className="text-center text-zinc-400 text-lg mb-16 max-w-2xl mx-auto leading-relaxed">
                                A indústria farmacêutica vendeu uma promessa. Você está pagando com a sua neuroquímica.
                            </p>

                            {/* Grid de cards com animação de entrada */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
                                {DEET_CARDS.map((card) => (
                                    <div
                                        key={card.title}
                                        className={`deet-card rounded-2xl border p-7 ${card.color}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <card.icon className={`w-7 h-7 ${card.iconColor}`} aria-hidden="true" />
                                            </div>
                                            <div>
                                                <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-white mb-2">
                                                    {card.title}
                                                </h3>
                                                <p className="text-zinc-400 text-sm leading-relaxed">{card.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tabela comparativa */}
                            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-center text-white mb-8">
                                DEET vs. Icaridina vs. Natural — A Verdade Que Ninguém Conta
                            </h3>
                            <div className="space-y-3">
                                {ICARIDINA_CARDS.map((item) => (
                                    <div
                                        key={item.label}
                                        className={`flex items-start gap-4 p-5 rounded-xl border ${
                                            item.bad
                                                ? 'border-zinc-700/60 bg-zinc-800/30'
                                                : 'border-amber-600/60 bg-amber-950/30'
                                        }`}
                                    >
                                        {item.bad ? (
                                            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                        ) : (
                                            <CheckCircle2 className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                        )}
                                        <div>
                                            <span className={`font-bold text-lg ${item.bad ? 'text-zinc-200' : 'text-amber-300'}`}>
                                                {item.label}
                                            </span>
                                            <p className="text-zinc-400 text-sm mt-1">{item.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-center text-zinc-500 text-sm italic mt-8 max-w-xl mx-auto">
                                "A ANVISA aprova o veneno, desde que ele não te mate imediatamente."
                            </p>
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════════════════════════
              5. CONTEÚDO DO EBOOK
            ═══════════════════════════════════════════════════════════════ */}
                    <section aria-labelledby="conteudo-heading" className="py-24 sm:py-32 px-4 sm:px-8">
                        <div className="max-w-5xl mx-auto">
                            <div className="amber-divider mb-8" aria-hidden="true" />
                            <h2
                                id="conteudo-heading"
                                className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-black text-center text-white mb-4 leading-tight"
                            >
                                O Que Você Vai{' '}
                                <span className="italic text-amber-400">Receber</span>
                            </h2>
                            <p className="text-center text-zinc-400 text-lg mb-16 max-w-2xl mx-auto leading-relaxed">
                                Décadas de pesquisa etnobotânica, receitas validadas e o protocolo completo de proteção ancestral.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {CONTENT_CARDS.map((card) => (
                                    <div
                                        key={card.title}
                                        className="group relative rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-8 hover:border-amber-600/50 hover:bg-amber-950/10 transition-all duration-300"
                                    >
                                        {/* Glow decorativo no hover */}
                                        <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" aria-hidden="true" />

                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-11 h-11 rounded-xl bg-amber-950/60 border border-amber-700/40 flex items-center justify-center flex-shrink-0">
                                                <card.icon className="w-5 h-5 text-amber-400" aria-hidden="true" />
                                            </div>
                                            <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white">
                                                {card.title}
                                            </h3>
                                        </div>
                                        <p className="text-zinc-400 leading-relaxed">{card.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════════════════════════
              6. OFERTA FINAL & GARANTIA
            ═══════════════════════════════════════════════════════════════ */}
                    <section
                        id="oferta"
                        aria-labelledby="oferta-heading"
                        className="py-24 sm:py-32 px-4 sm:px-8 bg-zinc-900/40 border-t border-zinc-800/50"
                    >
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="amber-divider mb-8" aria-hidden="true" />

                            <h2
                                id="oferta-heading"
                                className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
                            >
                                Proteja sua{' '}
                                <span className="italic text-amber-400">Biologia</span>{' '}
                                Hoje
                            </h2>

                            <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
                                A sabedoria das tribos Ticuna, Guarani e Xavante — que vivem há milênios na floresta mais infestada
                                do planeta — agora em formato PDF com acesso imediato.
                            </p>

                            {/* Card de preço */}
                            <div className="rounded-2xl border border-amber-600/50 bg-amber-950/20 p-10 mb-10">
                                {/* Ancoragem de valor */}
                                <p className="text-zinc-500 text-sm uppercase tracking-widest mb-3">
                                    Investimento único · sem mensalidades
                                </p>

                                {/* Preço destacado */}
                                <div className="mb-8">
                                    <span className="font-[family-name:var(--font-playfair)] text-7xl sm:text-8xl font-black text-amber-400 stat-value">
                                        R$ 29
                                    </span>
                                    <p className="text-zinc-500 text-sm mt-2">pagamento único · acesso vitalício</p>
                                </div>

                                {/* Lista do que está incluído */}
                                <ul className="text-left space-y-3 mb-10 max-w-sm mx-auto">
                                    {[
                                        'E-book Repelentes Naturais (PDF)',
                                        'Receitas passo a passo com óleos essenciais',
                                        'Guia de aplicação segura para crianças e pets',
                                        'Sabedoria ancestral das tribos brasileiras',
                                        'Acesso vitalício — sem assinatura',
                                    ].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-zinc-300">
                                            <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" aria-hidden="true" />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Botão principal */}
                                <CTAButton
                                    href={CHECKOUT_URL}
                                    className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl py-5 px-10 w-full"
                                >
                                    <Leaf className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
                                    QUERO O MANUAL AGORA · R$ 29
                                </CTAButton>

                                {/* Segurança */}
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                                    <span className="flex items-center gap-2 text-zinc-500 text-xs">
                                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                                        Checkout 100% Seguro
                                    </span>
                                    <span className="hidden sm:block text-zinc-700">·</span>
                                    <span className="flex items-center gap-2 text-zinc-500 text-xs">
                                        <BadgeCheck className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                                        Garantia incondicional de 7 dias
                                    </span>
                                </div>
                            </div>

                            {/* Selos de garantia */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-6 py-4">
                                    <BadgeCheck className="w-8 h-8 text-amber-500 flex-shrink-0" aria-hidden="true" />
                                    <div className="text-left">
                                        <p className="text-white font-bold text-sm">Garantia 7 Dias</p>
                                        <p className="text-zinc-500 text-xs">Reembolso total sem perguntas</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-6 py-4">
                                    <Lock className="w-8 h-8 text-amber-500 flex-shrink-0" aria-hidden="true" />
                                    <div className="text-left">
                                        <p className="text-white font-bold text-sm">Acesso Imediato</p>
                                        <p className="text-zinc-500 text-xs">PDF na caixa de entrada em segundos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* ── Footer mínimo ── */}
                <footer className="py-10 border-t border-zinc-800/50 text-center px-4">
                    <p className="text-zinc-600 text-xs">
                        © {new Date().getFullYear()} O Ancestral · Todos os direitos reservados ·{' '}
                        <Link href="/politica-de-privacidade" className="hover:text-zinc-400 transition-colors underline underline-offset-2">
                            Política de Privacidade
                        </Link>
                        {' '}·{' '}
                        <Link href="/termos-de-servico" className="hover:text-zinc-400 transition-colors underline underline-offset-2">
                            Termos de Serviço
                        </Link>
                    </p>
                    <p className="text-zinc-700 text-xs mt-2">
                        Este produto é um guia educativo. Consulte um médico para questões de saúde específicas.
    </p>
                </footer>
            </div>
        </>
    )
}
