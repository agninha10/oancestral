import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Flame } from "lucide-react";

const TESTO_URL = "/testosterona-primal";

interface TestoPrimalPromoBannerProps {
  variant?: "inline" | "sidebar";
}

/**
 * Banner de propaganda do ebook "Testosterona Primal — Guia da Dieta da Selva".
 *
 * variant="inline"  — faixa horizontal larga
 * variant="sidebar" — card vertical compacto
 *
 * Dark mode: cores originais (zinc-900 / stone-100).
 * Light mode: fundo red-50, textos zinc.
 */
export function TestoPrimalPromoBanner({ variant = "inline" }: TestoPrimalPromoBannerProps) {
  if (variant === "sidebar") {
    return (
      <Link
        href={TESTO_URL}
        className="group block rounded-2xl overflow-hidden
          border border-red-200 dark:border-red-800/40
          bg-white dark:bg-zinc-900
          hover:border-red-400 dark:hover:border-red-600/60
          shadow-sm hover:shadow-lg dark:hover:shadow-red-900/20
          transition-all duration-300"
      >
        {/* Cover image */}
        <div className="relative w-full aspect-[3/2] overflow-hidden">
          <Image
            src="/images/capa-livro-testo.png"
            alt="Testosterona Primal — Guia da Dieta da Selva"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="300px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 dark:from-zinc-900/80 to-transparent" />
          <div className="absolute bottom-2 left-3">
            <span className="text-[10px] font-bold tracking-widest bg-red-700 text-white px-2 py-0.5 rounded-full">
              R$ 29,90
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-red-600 dark:text-red-400 text-[10px] font-semibold tracking-widest uppercase mb-1">
            Ebook Digital
          </p>
          <h3 className="text-zinc-900 dark:text-stone-100 font-bold text-sm leading-tight mb-2">
            Testosterona Primal
          </h3>
          <p className="text-zinc-600 dark:text-stone-400 text-xs leading-relaxed mb-3">
            Resgate a sua testosterona natural em 30 dias com a Dieta da Selva.
          </p>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3 text-red-500 fill-red-500 dark:text-red-400 dark:fill-red-400"
              />
            ))}
            <span className="text-zinc-500 dark:text-stone-500 text-[10px] ml-1">Protocolo 30 dias</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 bg-red-700 hover:bg-red-600 text-white font-bold text-xs py-2.5 px-3 rounded-lg transition-colors">
            <Flame className="h-3.5 w-3.5" />
            Quero o Protocolo
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  // ── variant="inline" ──────────────────────────────────────────────────────
  return (
    <Link
      href={TESTO_URL}
      className="group relative flex flex-col sm:flex-row items-center gap-6 rounded-2xl overflow-hidden
        border border-red-200 dark:border-red-800/40
        bg-red-50 dark:bg-zinc-900 dark:bg-gradient-to-r dark:from-zinc-900 dark:via-red-950/20 dark:to-zinc-900
        hover:border-red-400 dark:hover:border-red-600/60
        transition-all duration-300
        hover:shadow-xl hover:shadow-red-100 dark:hover:shadow-red-900/20
        p-6 sm:p-8"
    >
      {/* Decorative glow — dark mode only */}
      <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl hidden dark:block" />

      {/* Cover */}
      <div className="relative flex-shrink-0 w-28 sm:w-32 aspect-[3/4] rounded-xl overflow-hidden shadow-md shadow-red-200 dark:shadow-2xl dark:shadow-black/50">
        <Image
          src="/images/capa-livro-testo.png"
          alt="Testosterona Primal — Guia da Dieta da Selva"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="130px"
        />
      </div>

      {/* Text */}
      <div className="flex-1 text-center sm:text-left">
        {/* Badge */}
        <span
          className="inline-block text-[10px] font-bold tracking-widest
            bg-red-100 dark:bg-red-500/20
            text-red-700 dark:text-red-400
            border border-red-200 dark:border-red-500/30
            px-2.5 py-0.5 rounded-full mb-2"
        >
          🔥 EBOOK DIGITAL — ACESSO IMEDIATO
        </span>

        <h3 className="text-zinc-900 dark:text-stone-100 font-bold text-xl sm:text-2xl leading-tight mb-2">
          Testosterona Primal: O Guia da Dieta da Selva
        </h3>

        <p className="text-zinc-600 dark:text-stone-400 text-sm leading-relaxed mb-3 max-w-md">
          Protocolo implacável de 30 dias baseado em Carnes, Frutas e Jejum para resgatar a
          sua testosterona natural e queimar gordura abdominal.
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 text-red-500 fill-red-500 dark:text-red-400 dark:fill-red-400"
              />
            ))}
            <span className="text-zinc-500 dark:text-stone-500 text-xs ml-1">Protocolo 30 dias</span>
          </div>
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-lg">
            <span className="text-zinc-400 dark:text-stone-500 text-sm line-through font-normal">R$ 97</span>
            R$ 29,90
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 bg-red-700 group-hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap shadow-lg shadow-red-900/30">
          Quero o Protocolo
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
