import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, BookOpen } from "lucide-react";

const LIVRO_URL = "https://oancestral.com.br/livro-de-receitas-ancestrais";

interface LivroPromoBannerProps {
  variant?: "inline" | "sidebar";
}

/**
 * Banner de propaganda do livro "Manual da Cozinha Ancestral".
 *
 * Dark mode: cores originais (zinc-900 / stone-100).
 * Light mode: fundo amber-50, textos zinc.
 */
export function LivroPromoBanner({ variant = "inline" }: LivroPromoBannerProps) {
  if (variant === "sidebar") {
    return (
      <Link
        href={LIVRO_URL}
        className="group block rounded-2xl overflow-hidden
          border border-amber-200 dark:border-amber-800/40
          bg-white dark:bg-zinc-900
          hover:border-amber-400 dark:hover:border-amber-600/60
          shadow-sm hover:shadow-lg dark:hover:shadow-amber-900/20
          transition-all duration-300"
      >
        {/* Cover image */}
        <div className="relative w-full aspect-[3/2] overflow-hidden">
          <Image
            src="/images/capa-livro-de-receitas.png"
            alt="Manual da Cozinha Ancestral"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="300px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 dark:from-zinc-900/80 to-transparent" />
          <div className="absolute bottom-2 left-3">
            <span className="text-[10px] font-bold tracking-widest bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-full">
              R$ 49,00
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-amber-600 dark:text-amber-400 text-[10px] font-semibold tracking-widest uppercase mb-1">
            Livro Digital
          </p>
          <h3 className="text-zinc-900 dark:text-stone-100 font-bold text-sm leading-tight mb-2">
            Manual da Cozinha Ancestral
          </h3>
          <p className="text-zinc-600 dark:text-stone-400 text-xs leading-relaxed mb-3">
            +100 receitas sem ultra-processados. Acesso vitalício.
          </p>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3 text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400"
              />
            ))}
            <span className="text-zinc-500 dark:text-stone-500 text-[10px] ml-1">+1.200 compradores</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs py-2.5 px-3 rounded-lg transition-colors">
            <BookOpen className="h-3.5 w-3.5" />
            Quero o Livro
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  // ── variant="inline" ──────────────────────────────────────────────────────
  return (
    <Link
      href={LIVRO_URL}
      className="group relative flex flex-col sm:flex-row items-center gap-6 rounded-2xl overflow-hidden
        border border-amber-200 dark:border-amber-800/40
        bg-amber-50 dark:bg-zinc-900 dark:bg-gradient-to-r dark:from-zinc-900 dark:via-amber-950/20 dark:to-zinc-900
        hover:border-amber-400 dark:hover:border-amber-600/60
        transition-all duration-300
        hover:shadow-xl hover:shadow-amber-100 dark:hover:shadow-amber-900/20
        p-6 sm:p-8"
    >
      {/* Decorative glow — dark mode only */}
      <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl hidden dark:block" />

      {/* Cover */}
      <div className="relative flex-shrink-0 w-28 sm:w-32 aspect-[3/4] rounded-xl overflow-hidden shadow-md shadow-amber-200 dark:shadow-2xl dark:shadow-black/50">
        <Image
          src="/images/capa-livro-de-receitas.png"
          alt="Manual da Cozinha Ancestral"
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
            bg-amber-100 dark:bg-amber-500/20
            text-amber-700 dark:text-amber-400
            border border-amber-200 dark:border-amber-500/30
            px-2.5 py-0.5 rounded-full mb-2"
        >
          📖 LIVRO DIGITAL — ACESSO VITALÍCIO
        </span>

        <h3 className="text-zinc-900 dark:text-stone-100 font-bold text-xl sm:text-2xl leading-tight mb-2">
          Manual da Cozinha Ancestral
        </h3>

        <p className="text-zinc-600 dark:text-stone-400 text-sm leading-relaxed mb-3 max-w-md">
          +100 receitas baseadas na alimentação que destrancou a saúde humana — sem
          ultra-processados, sem inflamação, com sabor real.
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400"
              />
            ))}
            <span className="text-zinc-500 dark:text-stone-500 text-xs ml-1">+1.200 compradores</span>
          </div>
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-lg">
            <span className="text-zinc-400 dark:text-stone-500 text-sm line-through font-normal">R$ 97</span>
            R$ 49,00
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 bg-amber-500 group-hover:bg-amber-400 text-zinc-950 font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap shadow-lg shadow-amber-900/30">
          Quero o Livro
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
