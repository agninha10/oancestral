import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Zap } from "lucide-react";

const JEJUM_URL = "/jejum";

interface JejumPromoBannerProps {
  variant?: "inline" | "sidebar";
}

/**
 * Banner de propaganda do ebook "Guia Definitivo do Jejum Intermitente".
 *
 * variant="inline"  — faixa horizontal larga, para inserir entre posts na listagem
 * variant="sidebar" — card vertical compacto, para sidebar do post individual
 */
export function JejumPromoBanner({ variant = "inline" }: JejumPromoBannerProps) {
  if (variant === "sidebar") {
    return (
      <Link
        href={JEJUM_URL}
        className="group block rounded-2xl overflow-hidden border border-purple-800/40 bg-gradient-to-b from-zinc-900 to-purple-950/30 hover:border-purple-600/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
      >
        {/* Cover image */}
        <div className="relative w-full aspect-[3/2] overflow-hidden bg-gradient-to-br from-purple-950 to-zinc-900 flex items-center justify-center">
          <Image
            src="/images/capa-guia-jejum.png"
            alt="Guia do Jejum Intermitente"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="300px"
            onError={() => {}} // fallback handled by bg gradient
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
          <div className="absolute bottom-2 left-3">
            <span className="text-[10px] font-bold tracking-widest bg-purple-500 text-white px-2 py-0.5 rounded-full">
              R$ 29,90
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-purple-400 text-[10px] font-semibold tracking-widest uppercase mb-1">
            Ebook Digital
          </p>
          <h3 className="text-stone-100 font-bold text-sm leading-tight mb-2">
            Guia do Jejum Intermitente
          </h3>
          <p className="text-stone-400 text-xs leading-relaxed mb-3">
            Protocolo completo: quando comer, como quebrar o jejum e os erros que sabotam.
          </p>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 text-purple-400 fill-purple-400" />
            ))}
            <span className="text-stone-500 text-[10px] ml-1">+800 alunos</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 px-3 rounded-lg transition-colors">
            <Zap className="h-3.5 w-3.5" />
            Quero o Guia
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  // variant="inline" — faixa horizontal
  return (
    <Link
      href={JEJUM_URL}
      className="group flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-purple-800/40 bg-gradient-to-r from-zinc-900 via-purple-950/20 to-zinc-900 hover:border-purple-600/60 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20 p-6 sm:p-8"
    >
      {/* Icon / Cover */}
      <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900 to-zinc-900 flex items-center justify-center shadow-2xl shadow-black/50">
        <Zap className="h-10 w-10 text-purple-400" />
      </div>

      {/* Text */}
      <div className="flex-1 text-center sm:text-left">
        <span className="inline-block text-[10px] font-bold tracking-widest bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2.5 py-0.5 rounded-full mb-2">
          ⚡ GUIA COMPLETO — DOWNLOAD IMEDIATO
        </span>
        <h3 className="text-stone-100 font-bold text-xl sm:text-2xl leading-tight mb-2">
          Guia Definitivo do Jejum Intermitente
        </h3>
        <p className="text-stone-400 text-sm leading-relaxed mb-3 max-w-md">
          Protocolo completo: quando comer, como quebrar o jejum, os erros mais comuns e como o
          jejum potencializa cada refeição que você faz.
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 text-purple-400 fill-purple-400" />
            ))}
            <span className="text-stone-500 text-xs ml-1">+800 alunos</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400 font-bold text-lg">
            R$ 29,90
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 bg-purple-600 group-hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap shadow-lg shadow-purple-900/30">
          Quero o Guia
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
