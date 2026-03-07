'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown, Flame, ChevronRight } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Dados estáticos
// ─────────────────────────────────────────────────────────────────────────────
const STATS = [
    { value: '25kg', label: 'de gordura derretida' },
    { value: '90', label: 'dias de protocolo' },
    { value: '0', label: 'calorias contadas' },
] as const

// viewport compartilhado — aciona a animação quando 80 px do elemento aparecem
const VP = { once: true, margin: '-80px' } as const

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: Card de foto (Antes ou Depois)
// ─────────────────────────────────────────────────────────────────────────────
interface PhotoCardProps {
    src: string
    alt: string
    tag: string
    tagColor: 'red' | 'amber'
    bottomLabel: string
    badge?: string
    slideFrom: 'left' | 'right'
    delay?: number
}

function PhotoCard({
    src,
    alt,
    tag,
    tagColor,
    bottomLabel,
    badge,
    slideFrom,
    delay = 0,
}: PhotoCardProps) {
    const isRed = tagColor === 'red'
    const xFrom = slideFrom === 'left' ? -48 : 48

    return (
        <motion.div
            initial={{ opacity: 0, x: xFrom }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.7, delay, type: 'tween' }}
            className={`relative flex-1 rounded-2xl overflow-hidden shadow-2xl ${
                isRed
                    ? 'border border-red-900/55 shadow-red-950/50'
                    : 'border border-amber-500/50 shadow-amber-950/35'
            }`}
        >
            {/* Gradient overlay */}
            <div
                className={`absolute inset-0 z-10 ${
                    isRed
                        ? 'bg-gradient-to-t from-red-950/80 via-red-950/15 to-red-900/25'
                        : 'bg-gradient-to-t from-amber-950/80 via-amber-950/15 to-transparent'
                }`}
                aria-hidden="true"
            />

            {/* Anel de brilho externo (só no Depois) */}
            {!isRed && (
                <div
                    className="absolute inset-0 rounded-2xl ring-1 ring-amber-400/20 z-20 pointer-events-none"
                    aria-hidden="true"
                />
            )}

            {/* Tag superior esquerda */}
            <div
                className={`absolute top-4 left-4 z-30 flex items-center gap-1.5 backdrop-blur-sm border text-xs font-semibold px-3 py-1.5 rounded-full ${
                    isRed
                        ? 'bg-red-950/85 border-red-800/60 text-red-300'
                        : 'bg-amber-950/85 border-amber-700/60 text-amber-300'
                }`}
            >
                <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isRed ? 'bg-red-500 animate-pulse' : 'bg-amber-400'
                    }`}
                />
                {tag}
            </div>

            {/* Badge −25kg (canto superior direito, só no Depois) */}
            {badge && (
                <div className="absolute top-4 right-4 z-30 bg-amber-500 text-stone-950 text-xs font-black px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/50 tracking-wide">
                    {badge}
                </div>
            )}

            {/* Rótulo inferior */}
            <div className="absolute bottom-0 inset-x-0 z-20 px-4 pb-5 text-center">
                <p
                    className={`text-sm font-medium tracking-wide ${
                        isRed ? 'text-red-300' : 'text-amber-300'
                    }`}
                >
                    {bottomLabel}
                </p>
            </div>

            <Image
                src={src}
                alt={alt}
                width={480}
                height={640}
                loading="lazy"
                className="w-full h-[360px] sm:h-[480px] md:h-[580px] object-cover object-top"
            />
        </motion.div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────
interface TransformationSectionProps {
    /** Override the default vertical padding (py-24 sm:py-32) for CRO placement tweaks */
    sectionClassName?: string
}

export function TransformationSection({ sectionClassName }: TransformationSectionProps = {}) {
    const sectionCls = sectionClassName ?? 'py-24 sm:py-32'
    return (
        <section
            aria-labelledby="transformation-heading"
            className={`relative ${sectionCls} px-4 sm:px-8 bg-stone-950 overflow-hidden`}
        >
            {/* ── Radial glows de fundo ── */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-900/18 blur-[110px]" />
                <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-[110px]" />
                <div className="absolute left-1/2 top-[38%] -translate-x-1/2 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">

                {/* ════════════════════════════════
                    CABEÇALHO
                ════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VP}
                    transition={{ duration: 0.55 }}
                    className="text-center mb-14"
                >
                    <span className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-7">
                        <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                        A Prova Biológica
                    </span>

                    <h2
                        id="transformation-heading"
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5"
                    >
                        A Teoria é Bonita.{' '}
                        <br className="hidden sm:block" />
                        <span className="text-amber-400">O Resultado é Incontestável.</span>
                    </h2>

                    <p className="text-stone-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Como eu derreti{' '}
                        <strong className="text-white">25kg de pura inflamação</strong> em apenas 90
                        dias usando o Jejum e a Nutrição Ancestral.{' '}
                        <strong className="text-white">Sem passar fome, sem contar calorias.</strong>
                    </p>
                </motion.div>

                {/* ════════════════════════════════
                    FOTOS ANTES / DEPOIS
                ════════════════════════════════ */}
                <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-5 mb-12">

                    {/* Card ANTES */}
                    <PhotoCard
                        src="/images/fotos-antes-e-depois/antes.png"
                        alt="Antes — dia 1 do protocolo de jejum intermitente e dieta ancestral, 25kg de excesso de gordura inflamatória"
                        tag="Dia 1: O Sistema Venceu"
                        tagColor="red"
                        bottomLabel="Inflamado & Exausto"
                        slideFrom="left"
                        delay={0.1}
                    />

                    {/* Divisor — ArrowRight desktop / ArrowDown mobile */}
                    <div className="flex items-center justify-center py-2 md:py-0 flex-shrink-0">
                        <div
                            className="hidden md:flex w-14 h-14 rounded-full bg-stone-900 border border-amber-500/40 items-center justify-center shadow-xl shadow-black/50"
                            aria-hidden="true"
                        >
                            <ArrowRight className="w-6 h-6 text-amber-400" />
                        </div>
                        <div
                            className="md:hidden w-12 h-12 rounded-full bg-stone-900 border border-amber-500/40 flex items-center justify-center shadow-xl shadow-black/50"
                            aria-hidden="true"
                        >
                            <ArrowDown className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>

                    {/* Card DEPOIS */}
                    <PhotoCard
                        src="/images/fotos-antes-e-depois/depois.jpeg"
                        alt="Depois — dia 90 do protocolo de jejum intermitente e dieta ancestral, menos 25kg de gordura"
                        tag="Dia 90: Soberania Resgatada"
                        tagColor="amber"
                        bottomLabel="Energia & Clareza Restauradas"
                        badge="−25 kg"
                        slideFrom="right"
                        delay={0.22}
                    />
                </div>

                {/* ════════════════════════════════
                    STATS — 25kg | 90 dias | 0 calorias
                ════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VP}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-3 gap-3 sm:gap-5 mb-12"
                >
                    {STATS.map((s) => (
                        <article
                            key={s.label}
                            className="bg-stone-900/70 border border-stone-800/80 rounded-xl py-5 px-3 text-center"
                        >
                            <p className="text-3xl sm:text-4xl font-black text-amber-400 leading-none mb-1.5">
                                {s.value}
                            </p>
                            <p className="text-stone-500 text-xs sm:text-sm leading-tight">
                                {s.label}
                            </p>
                        </article>
                    ))}
                </motion.div>

                {/* ════════════════════════════════
                    GANCHO / QUOTE
                ════════════════════════════════ */}
                <motion.blockquote
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VP}
                    transition={{ duration: 0.5, delay: 0.08 }}
                    className="mb-8 bg-stone-900/60 border-l-4 border-amber-500 rounded-r-2xl px-7 py-6 sm:px-9 sm:py-8"
                >
                    <p className="text-stone-200 text-base sm:text-xl leading-relaxed italic">
                        "O segredo não foi apenas{' '}
                        <strong className="text-white not-italic">parar de comer</strong>. Foi o que
                        eu comi quando{' '}
                        <strong className="text-white not-italic">quebrei o jejum</strong>. Carnes,
                        órgãos e gorduras naturais que forçaram meu corpo a queimar o próprio
                        estoque."
                    </p>
                </motion.blockquote>

                {/* ════════════════════════════════
                    CTA CARD → LIVRO DE RECEITAS
                ════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VP}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    className="relative bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 border border-amber-500/35 rounded-2xl p-7 sm:p-10 overflow-hidden"
                >
                    {/* Glows decorativos */}
                    <div
                        className="absolute -top-12 -right-12 w-56 h-56 bg-amber-500/8 rounded-full blur-3xl pointer-events-none"
                        aria-hidden="true"
                    />
                    <div
                        className="absolute -bottom-8 -left-8 w-40 h-40 bg-amber-900/10 rounded-full blur-2xl pointer-events-none"
                        aria-hidden="true"
                    />

                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-7">

                        {/* Texto */}
                        <div className="flex-1 min-w-0">
                            <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                                <Flame className="w-3 h-3" aria-hidden="true" />
                                Copie o Meu Protocolo Exato
                            </span>

                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
                                Eu cataloguei todas as refeições que usei para quebrar meus jejuns e
                                derreter essa gordura.
                            </h3>

                            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                                Mais de{' '}
                                <strong className="text-stone-200">100 receitas</strong> de carnes,
                                órgãos e gorduras naturais que compõem a Dieta da Selva — o método
                                que tornou o resultado acima possível.
                            </p>
                        </div>

                        {/* Botão */}
                        <Link
                            href="/livro-de-receitas-ancestrais"
                            className="flex-shrink-0 inline-flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 text-sm sm:text-base font-bold uppercase tracking-wide px-7 py-4 rounded-xl transition-colors duration-200 shadow-lg shadow-amber-900/40 whitespace-nowrap"
                        >
                            Ver o Manual
                            <ChevronRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
