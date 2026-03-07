import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Oswald } from 'next/font/google'
import { Shield, Lock, CheckCircle2, AlertTriangle, Flame, Zap, Star } from 'lucide-react'
import { LandingNav } from './landing-nav'

// ─────────────────────────────────────────────────────────────────────────────
// Fonte de impacto — Oswald (condensed bold) só para esta página
// ─────────────────────────────────────────────────────────────────────────────
const oswald = Oswald({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-oswald',
    display: 'swap',
})

// ─────────────────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────────────────
const CHECKOUT_URL = 'https://pay.kiwify.com.br/uO2O0jC'

const HERO_IMG =
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop'
const STRENGTH_IMG =
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1600&auto=format&fit=crop'
const MEAT_IMG =
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2000&auto=format&fit=crop'

// ─────────────────────────────────────────────────────────────────────────────
// SEO Metadata
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    title: 'Testosterona Primal: O Guia da Dieta da Selva',
    description:
        'Resgate sua testosterona natural em 30 dias. Descubra o protocolo da Dieta da Selva baseado em Carnes, Frutas e Jejum para queimar gordura e recuperar a energia masculina.',
    keywords: [
        'testosterona natural',
        'aumentar testosterona',
        'dieta da selva',
        'jejum intermitente homens',
        'dieta carnívora testosterona',
        'hormônios masculinos',
        'queimar gordura abdominal homem',
        'testosterona primal',
        'ebook testosterona',
        'protocolo testosterona 30 dias',
        'xenoestrogênios',
        'energia masculina',
        'dieta ancestral homens',
    ],
    alternates: {
        canonical: '/testosterona-primal',
    },
    openGraph: {
        title: 'Testosterona Primal: O Guia da Dieta da Selva | O Ancestral',
        description:
            'Resgate sua testosterona natural em 30 dias com o protocolo da Dieta da Selva baseado em Carnes, Frutas e Jejum.',
        type: 'website',
        url: 'https://oancestral.com.br/testosterona-primal',
        images: [
            {
                url: HERO_IMG,
                width: 1200,
                height: 630,
                alt: 'Testosterona Primal — Dieta da Selva baseada em Carnes, Frutas e Jejum para homens',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Testosterona Primal: O Guia da Dieta da Selva | O Ancestral',
        description:
            'Resgate sua testosterona natural em 30 dias com o protocolo da Dieta da Selva.',
        images: [HERO_IMG],
    },
}

// ─────────────────────────────────────────────────────────────────────────────
// Dados das seções
// ─────────────────────────────────────────────────────────────────────────────
const PAINS = [
    'Acorda exausto, mesmo depois de dormir 8 horas?',
    'A sua libido e energia para a vida estão cada vez mais baixas?',
    'Acumula gordura abdominal que não sai, por mais cardio que faça?',
]

const BENEFITS = [
    {
        title: 'Jejum Intermitente:',
        desc: 'O passo a passo para a autofagia e hormônio do crescimento (GH).',
    },
    {
        title: 'A Mentira do Colesterol:',
        desc: 'Porque o seu corpo precisa desesperadamente de carne vermelha e gemas de ovos.',
    },
    {
        title: 'Frutas como Combustível:',
        desc: 'Energia explosiva sem a inflamação dos grãos e sementes.',
    },
    {
        title: 'Xenoestrogênios Ocultos:',
        desc: 'Os 4 assassinos hormonais que feminizam o seu corpo na sua própria cozinha.',
    },
    {
        title: 'Protocolo de 30 Dias + Plano de Refeições Primal:',
        desc: 'Guia completo de refeições diárias — Bônus incluso.',
    },
]

const WHATS_INSIDE = [
    'E-book Testosterona Primal (PDF — acesso imediato após o pagamento)',
    'Plano de Refeições Primal de 30 dias (Bônus)',
    'Protocolo de Jejum Intermitente passo a passo',
    'Lista dos 4 xenoestrogênios a eliminar hoje da sua cozinha',
    'Acesso vitalício ao material, sem mensalidades',
]

const STATS = [
    { value: '30', label: 'Dias de Protocolo' },
    { value: '5', label: 'Segredos Revelados' },
    { value: '7', label: 'Dias de Garantia' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Componente auxiliar: botão CTA com glow pulsante
// ─────────────────────────────────────────────────────────────────────────────
function CTAButton({
    href,
    children,
    className = '',
    external = false,
}: {
    href: string
    children: React.ReactNode
    className?: string
    external?: boolean
}) {
    const base =
        'cta-glow inline-flex items-center justify-center gap-3 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-bold uppercase tracking-wider rounded-xl transition-colors duration-200 '
    return external ? (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${base} ${className}`}
        >
            {children}
        </a>
    ) : (
        <a href={href} className={`${base} ${className}`}>
            {children}
        </a>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────────────────────────────────────
export default function TestosteronaPrimalPage() {
    return (
        <>
            {/* Animações CSS — contidas nesta página */}
            <style>{`
        @keyframes glowPulse {
          0%,100% {
            box-shadow:
              0 0 22px rgba(185,28,28,0.55),
              0 0 55px rgba(185,28,28,0.25),
              0 4px 24px rgba(0,0,0,0.45);
          }
          50% {
            box-shadow:
              0 0 38px rgba(220,38,38,0.85),
              0 0 90px rgba(185,28,28,0.45),
              0 4px 24px rgba(0,0,0,0.45);
          }
        }
        .cta-glow { animation: glowPulse 2.3s ease-in-out infinite; }

        @keyframes bookFloat {
          0%,100% { transform: perspective(900px) rotateY(-20deg) rotateX(4deg) translateY(0px); }
          50%      { transform: perspective(900px) rotateY(-20deg) rotateX(4deg) translateY(-14px); }
        }
        .book-float { animation: bookFloat 5s ease-in-out infinite; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.75s ease-out forwards; }
        .delay-150 { animation-delay: 0.15s; opacity: 0; }
        .delay-300 { animation-delay: 0.30s; opacity: 0; }
        .delay-450 { animation-delay: 0.45s; opacity: 0; }

        /* Borda lateral do livro */
        .book-spine {
          position: absolute;
          top: 4px; bottom: 4px;
          left: -14px; width: 14px;
          background: linear-gradient(to right, #450a0a, #7f1d1d);
          border-radius: 3px 0 0 3px;
          transform: perspective(900px) rotateY(65deg);
          transform-origin: right center;
        }
      `}</style>

            <div className={`${oswald.variable} bg-zinc-950 text-zinc-100`}>
                {/* ── Navegação fixa da landing page ── */}
                <LandingNav />

                {/* ═══════════════════════════════════════════════════════════════
          1. HERO — Primeira Dobra
        ═══════════════════════════════════════════════════════════════ */}
                <header className="relative min-h-svh flex items-center justify-center overflow-hidden">
                    {/* Imagem de fundo */}
                    <Image
                        src={HERO_IMG}
                        alt="Carne grelhada na brasa — dieta ancestral primal para aumentar testosterona naturalmente"
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="100vw"
                    />

                    {/* Gradiente escuro por cima da imagem */}
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/75 via-zinc-950/55 to-zinc-950" />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-zinc-950/60" />

                    {/* Conteúdo Hero */}
                    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 text-center py-28 sm:py-36">
                        {/* Badge de atenção */}
                        <div className="fade-up inline-flex items-center gap-2 bg-red-950/60 border border-red-700/70 text-red-400 text-xs sm:text-sm font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full mb-10">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            Atenção: Apenas para homens decididos
                        </div>

                        {/* H1 — único na página */}
                        <h1 className="font-[family-name:var(--font-oswald)] fade-up delay-150 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.05] tracking-wide text-white mb-7">
                            O Fim da Fraqueza:{' '}
                            <span className="text-red-500">
                                Resgate a sua Testosterona Natural
                            </span>{' '}
                            em 30 Dias.
                        </h1>

                        {/* Sub-headline */}
                        <p className="fade-up delay-300 text-lg sm:text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                            Descubra o protocolo implacável da{' '}
                            <strong className="text-white">Dieta da Selva</strong> baseado em{' '}
                            <strong className="text-red-400">Carnes, Frutas e Jejum</strong> que
                            está a transformar homens comuns em máquinas de queimar gordura.
                        </p>

                        {/* CTA primário */}
                        <div className="fade-up delay-450 flex flex-col items-center gap-5">
                            <CTAButton
                                href="#oferta"
                                className="font-[family-name:var(--font-oswald)] text-xl sm:text-2xl py-5 sm:py-6 px-10 sm:px-14 w-full sm:w-auto"
                            >
                                <Flame className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
                                Quero o Protocolo Agora
                            </CTAButton>

                            <span className="flex items-center gap-2 text-zinc-500 text-sm">
                                <Lock className="w-4 h-4" aria-hidden="true" />
                                Pagamento 100% Seguro — Acesso Imediato ao PDF
                            </span>
                        </div>
                    </div>

                    {/* Fade para a próxima secção */}
                    <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
                </header>

                <main>
                    {/* ═══════════════════════════════════════════════════════════════
            2. A DOR — Problema / Agitação
          ═══════════════════════════════════════════════════════════════ */}
                    <section
                        aria-labelledby="dor-heading"
                        className="py-20 sm:py-28 px-4 sm:px-8 bg-zinc-950"
                    >
                        <div className="max-w-3xl mx-auto">
                            <h2
                                id="dor-heading"
                                className="font-[family-name:var(--font-oswald)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-center text-white mb-14 leading-tight"
                            >
                                A sociedade{' '}
                                <span className="text-red-500">normalizou</span> a sua fraqueza.
                            </h2>

                            {/* Checklist de dores */}
                            <ul className="space-y-5 mb-14" role="list">
                                {PAINS.map((pain, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-4 bg-zinc-900/70 border border-zinc-800 rounded-xl p-5 sm:p-6 hover:border-red-900/60 transition-colors"
                                    >
                                        <span
                                            className="flex-shrink-0 w-8 h-8 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-500 font-bold text-sm mt-0.5"
                                            aria-hidden="true"
                                        >
                                            ✕
                                        </span>
                                        <span className="text-zinc-200 text-base sm:text-lg leading-relaxed">
                                            {pain}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Caixa de destaque */}
                            <blockquote className="relative bg-red-950/25 border-l-4 border-red-600 rounded-r-2xl p-7 sm:p-9">
                                <p className="text-zinc-200 text-base sm:text-lg leading-relaxed">
                                    <strong className="font-[family-name:var(--font-oswald)] text-white block text-xl sm:text-2xl uppercase tracking-wide mb-3">
                                        A Culpa Não É Sua.
                                    </strong>
                                    Disseram-lhe para comer grãos integrais, evitar a carne
                                    vermelha e fugir do colesterol. Essa mesma dieta é o que está
                                    a{' '}
                                    <strong className="text-red-400">
                                        envenenar o seu sistema endócrino
                                    </strong>{' '}
                                    com óleos de sementes inflamatórios e a destruir a
                                    matéria-prima da sua testosterona.
                                </p>
                            </blockquote>
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════════════════════════
            VISUAL BREAK — Imagem de transição (homem forte)
          ═══════════════════════════════════════════════════════════════ */}
                    <div className="relative h-56 sm:h-72 overflow-hidden">
                        <Image
                            src={STRENGTH_IMG}
                            alt="Homem forte e musculoso resultado da dieta ancestral e protocolo de testosterona natural"
                            fill
                            loading="lazy"
                            className="object-cover object-center object-[center_20%]"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/20 to-zinc-950" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="font-[family-name:var(--font-oswald)] text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-white tracking-widest text-center drop-shadow-2xl">
                                A biologia não mente.{' '}
                                <span className="text-red-500">O protocolo funciona.</span>
                            </p>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════
            3. O PRODUTO — Solução
          ═══════════════════════════════════════════════════════════════ */}
                    <section
                        aria-labelledby="produto-heading"
                        className="relative py-20 sm:py-28 px-4 sm:px-8 overflow-hidden"
                    >
                        {/* Background carne/fogo em baixa opacidade */}
                        <Image
                            src={MEAT_IMG}
                            alt="Carne crua na brasa — protocolo de alimentação ancestral para homens"
                            fill
                            loading="lazy"
                            className="object-cover object-center opacity-10"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/92 to-zinc-950" />

                        <div className="relative z-10 max-w-6xl mx-auto">
                            {/* Header da seção */}
                            <div className="text-center mb-16">
                                <span className="inline-block bg-red-950/50 border border-red-800/60 text-red-400 text-xs font-semibold uppercase tracking-widest px-5 py-2 rounded-full mb-5">
                                    A Solução
                                </span>
                                <h2
                                    id="produto-heading"
                                    className="font-[family-name:var(--font-oswald)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-white leading-tight"
                                >
                                    Apresentamos o{' '}
                                    <span className="text-red-500">Testosterona Primal.</span>
                                </h2>
                            </div>

                            {/* Layout: mockup | benefícios */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
                                {/* ── Mockup 3D do livro ── */}
                                <div className="flex justify-center">
                                    <div className="book-float relative w-52 sm:w-64 md:w-72 select-none">
                                        {/* Lombada */}
                                        <div className="book-spine" aria-hidden="true" />

                                        {/* Capa */}
                                        <div
                                            style={{
                                                transform:
                                                    'perspective(900px) rotateY(-20deg) rotateX(4deg)',
                                                boxShadow:
                                                    '-22px 22px 70px rgba(0,0,0,0.95), -4px 4px 20px rgba(185,28,28,0.35), 18px -6px 35px rgba(0,0,0,0.6)',
                                                borderRadius: '2px 10px 10px 2px',
                                            }}
                                            className="overflow-hidden border-r border-zinc-800"
                                        >
                                            <Image
                                                src="/images/capa-livro-testo.png"
                                                alt="Capa do E-book Testosterona Primal — Guia da Dieta da Selva para homens"
                                                width={288}
                                                height={384}
                                                loading="lazy"
                                                className="block w-full h-auto"
                                                style={{ aspectRatio: '3/4', objectFit: 'cover' }}
                                            />
                                            {/* Overlay com título na capa */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent flex flex-col justify-end p-5">
                                                <div className="font-[family-name:var(--font-oswald)]">
                                                    <p className="text-red-500 text-xs font-semibold uppercase tracking-widest mb-1">
                                                        O Ancestral
                                                    </p>
                                                    <h3 className="text-white text-xl sm:text-2xl font-bold uppercase leading-tight">
                                                        Testosterona Primal
                                                    </h3>
                                                    <p className="text-zinc-400 text-xs uppercase tracking-widest mt-1">
                                                        Dieta da Selva
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reflexo / sombra no chão */}
                                        <div
                                            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-red-900/20 blur-2xl rounded-full"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>

                                {/* ── Benefícios ── */}
                                <div>
                                    <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-8">
                                        O manual prático, direto e sem rodeios para{' '}
                                        <strong className="text-white">
                                            limpar os venenos do seu corpo
                                        </strong>{' '}
                                        e forçar a sua biologia a produzir hormonas masculinas e a
                                        queimar a gordura estagnada.
                                    </p>

                                    <ul className="space-y-5" role="list">
                                        {BENEFITS.map((b, i) => (
                                            <li key={i} className="flex items-start gap-4">
                                                <CheckCircle2
                                                    className="flex-shrink-0 w-6 h-6 text-red-500 mt-0.5"
                                                    aria-hidden="true"
                                                />
                                                <span className="text-zinc-200 text-base sm:text-lg leading-relaxed">
                                                    <strong className="text-white">{b.title}</strong>{' '}
                                                    {b.desc}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-10">
                                        <a
                                            href="#oferta"
                                            className="font-[family-name:var(--font-oswald)] inline-flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-red-700/60 text-white text-base sm:text-lg font-bold uppercase tracking-wider px-7 py-4 rounded-xl transition-all duration-200"
                                        >
                                            <Zap
                                                className="w-5 h-5 text-red-500"
                                                aria-hidden="true"
                                            />
                                            Ver Preço e Garantia
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════════════════════════
            STATS STRIP
          ═══════════════════════════════════════════════════════════════ */}
                    <div className="py-10 sm:py-14 bg-red-950/15 border-y border-red-900/25">
                        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 sm:gap-8 text-center">
                            {STATS.map((s) => (
                                <article key={s.label} className="flex flex-col items-center gap-1">
                                    <span className="font-[family-name:var(--font-oswald)] text-4xl sm:text-5xl md:text-6xl font-bold text-red-500">
                                        {s.value}
                                    </span>
                                    <span className="text-zinc-500 text-xs sm:text-sm uppercase tracking-widest leading-tight">
                                        {s.label}
                                    </span>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════
            4. OFERTA IRRESISTÍVEL — Preço e Checkout
          ═══════════════════════════════════════════════════════════════ */}
                    <section
                        id="oferta"
                        aria-labelledby="oferta-heading"
                        className="py-20 sm:py-28 px-4 sm:px-8 bg-zinc-950"
                    >
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center mb-10">
                                <span className="inline-block bg-red-950/50 border border-red-800/60 text-red-400 text-xs font-semibold uppercase tracking-widest px-5 py-2 rounded-full mb-6">
                                    Oferta por Tempo Limitado
                                </span>
                                <h2
                                    id="oferta-heading"
                                    className="font-[family-name:var(--font-oswald)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-white leading-tight"
                                >
                                    A Sua Soberania Está a{' '}
                                    <span className="text-red-500">Um Clique.</span>
                                </h2>
                            </div>

                            {/* Card de preço */}
                            <div className="relative bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/70">
                                {/* Barra de destaque topo */}
                                <div className="h-1.5 bg-gradient-to-r from-red-900 via-red-600 to-red-900" />

                                <div className="p-8 sm:p-12">
                                    {/* Nome do produto */}
                                    <div className="text-center mb-8">
                                        <p className="font-[family-name:var(--font-oswald)] text-zinc-500 text-sm uppercase tracking-widest mb-1">
                                            E-book Digital
                                        </p>
                                        <h3 className="font-[family-name:var(--font-oswald)] text-3xl sm:text-4xl font-bold uppercase text-white mb-1">
                                            Testosterona Primal
                                        </h3>
                                        <p className="text-zinc-500 text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                                            <Star
                                                className="w-4 h-4 text-red-600"
                                                aria-hidden="true"
                                            />
                                            + Plano de Refeições Primal — Bônus Incluso
                                        </p>
                                    </div>

                                    {/* Preço com ancoragem */}
                                    <div className="text-center mb-8">
                                        <p className="text-zinc-600 text-base line-through mb-1">
                                            De R$ 97,00
                                        </p>
                                        <p className="text-zinc-400 text-sm mb-1 uppercase tracking-widest">
                                            Por apenas
                                        </p>
                                        <p className="font-[family-name:var(--font-oswald)] text-6xl sm:text-7xl font-bold text-white leading-none">
                                            R$ 29
                                            <span className="text-4xl sm:text-5xl text-zinc-300">
                                                ,90
                                            </span>
                                        </p>
                                        <p className="text-zinc-600 text-xs mt-2 uppercase tracking-wider">
                                            Pagamento único · Sem mensalidades
                                        </p>
                                    </div>

                                    {/* O que está incluído */}
                                    <ul
                                        className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 sm:p-6 space-y-3 mb-9"
                                        role="list"
                                    >
                                        {WHATS_INSIDE.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base"
                                            >
                                                <CheckCircle2
                                                    className="flex-shrink-0 w-5 h-5 text-red-500 mt-0.5"
                                                    aria-hidden="true"
                                                />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Botão CTA principal */}
                                    <CTAButton
                                        href={CHECKOUT_URL}
                                        external
                                        className="font-[family-name:var(--font-oswald)] block w-full text-xl sm:text-2xl py-5 sm:py-6 px-8"
                                    >
                                        <Flame className="w-6 h-6 flex-shrink-0" aria-hidden="true" />
                                        Comprar Agora →
                                    </CTAButton>

                                    {/* Aviso + selos de confiança */}
                                    <p className="text-center text-zinc-600 text-xs mt-4 mb-6">
                                        Acesso imediato ao PDF após a confirmação do pagamento.
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-zinc-600 text-xs sm:text-sm border-t border-zinc-800 pt-6">
                                        <span className="flex items-center gap-1.5">
                                            <Lock className="w-4 h-4" aria-hidden="true" />
                                            Pagamento Seguro
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Shield className="w-4 h-4" aria-hidden="true" />
                                            Garantia 7 Dias
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Zap className="w-4 h-4" aria-hidden="true" />
                                            Acesso Imediato
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════════════════════════
            5. GARANTIA BLINDADA
          ═══════════════════════════════════════════════════════════════ */}
                    <section
                        aria-labelledby="garantia-heading"
                        className="py-20 sm:py-28 px-4 sm:px-8 bg-zinc-900/30 border-t border-zinc-800"
                    >
                        <div className="max-w-2xl mx-auto text-center">
                            {/* Ícone de escudo */}
                            <div
                                className="mx-auto mb-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-red-950/40 border-2 border-red-800/50 flex items-center justify-center ring-8 ring-red-950/20"
                                aria-hidden="true"
                            >
                                <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />
                            </div>

                            <h3
                                id="garantia-heading"
                                className="font-[family-name:var(--font-oswald)] text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-white mb-6"
                            >
                                Garantia Blindada de 7 Dias.
                            </h3>

                            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                                Temos a certeza absoluta de que este protocolo vai mudar o seu
                                corpo. Mas se por qualquer motivo não gostar do material, basta
                                enviar-nos um email no prazo de{' '}
                                <strong className="text-white">7 dias</strong> e devolveremos{' '}
                                <strong className="text-white">100% do seu dinheiro</strong>. Sem
                                perguntas. Sem complicações.
                            </p>

                            <CTAButton
                                href={CHECKOUT_URL}
                                external
                                className="font-[family-name:var(--font-oswald)] text-base sm:text-lg py-4 sm:py-5 px-10"
                            >
                                <Shield className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                                Quero Começar com Garantia
                            </CTAButton>
                        </div>
                    </section>
                </main>

                {/* ═══════════════════════════════════════════════════════════════
          FOOTER
        ═══════════════════════════════════════════════════════════════ */}
                <footer className="border-t border-zinc-800/60 bg-zinc-950 py-14 px-4 sm:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Logo */}
                        <p className="font-[family-name:var(--font-oswald)] text-2xl sm:text-3xl font-bold uppercase tracking-widest text-white mb-2">
                            O <span className="text-red-500">Ancestral</span>
                        </p>
                        <p className="text-zinc-700 text-xs uppercase tracking-widest mb-8">
                            oancestral.com.br
                        </p>

                        {/* Aviso legal */}
                        <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto mb-8">
                            Os resultados podem variar de pessoa para pessoa. As informações aqui
                            prestadas não substituem a consulta de um médico especialista. Este
                            material possui fins educativos.
                        </p>

                        {/* Links legais */}
                        <nav
                            aria-label="Links legais"
                            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-zinc-600 text-xs sm:text-sm mb-10"
                        >
                            <Link
                                href="/termos"
                                className="hover:text-zinc-400 transition-colors underline-offset-4 hover:underline"
                            >
                                Termos de Uso
                            </Link>
                            <span aria-hidden="true" className="text-zinc-800">
                                ·
                            </span>
                            <Link
                                href="/privacidade"
                                className="hover:text-zinc-400 transition-colors underline-offset-4 hover:underline"
                            >
                                Política de Privacidade
                            </Link>
                            <span aria-hidden="true" className="text-zinc-800">
                                ·
                            </span>
                            <Link
                                href="/contato"
                                className="hover:text-zinc-400 transition-colors underline-offset-4 hover:underline"
                            >
                                Contato
                            </Link>
                        </nav>

                        <p className="text-zinc-800 text-xs">
                            © {new Date().getFullYear()} O Ancestral. Todos os direitos
                            reservados.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    )
}
