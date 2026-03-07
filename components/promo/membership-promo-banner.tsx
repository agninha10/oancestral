import Link from "next/link";
import { ArrowRight, Star, Crown, Sparkles } from "lucide-react";

const MEMBERSHIP_URL = "/assinatura";

interface MembershipPromoBannerProps {
  variant?: "inline" | "sidebar";
}

/**
 * Banner de propaganda da assinatura Premium.
 *
 * variant="inline"  — faixa horizontal larga, para inserir entre posts
 * variant="sidebar" — card vertical compacto, para sidebar
 */
export function MembershipPromoBanner({ variant = "inline" }: MembershipPromoBannerProps) {
  if (variant === "sidebar") {
    return (
      <Link
        href={MEMBERSHIP_URL}
        className="group block rounded-2xl overflow-hidden border border-amber-700/40 bg-gradient-to-b from-zinc-900 to-amber-950/30 hover:border-amber-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/20"
      >
        {/* Header com gradiente premium */}
        <div className="relative px-4 py-5 bg-gradient-to-br from-amber-900/60 to-zinc-900 border-b border-amber-800/30">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-4 w-4 text-amber-400" />
            <span className="text-amber-400 text-[10px] font-bold tracking-widest uppercase">
              Membro Premium
            </span>
          </div>
          <p className="text-stone-100 font-bold text-sm leading-tight">
            Acesse todo o conteúdo exclusivo
          </p>
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold tracking-widest bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-full">
              A partir de R$ 35/mês
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <ul className="space-y-1.5 text-xs text-stone-300">
            {["Receitas premium ilimitadas", "Artigos aprofundados", "Aulas em vídeo", "Comunidade exclusiva"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-amber-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {/* Stars */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-stone-500 text-[10px] ml-1">+500 membros</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs py-2.5 px-3 rounded-lg transition-colors">
            <Crown className="h-3.5 w-3.5" />
            Quero ser Membro
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  // variant="inline"
  return (
    <Link
      href={MEMBERSHIP_URL}
      className="group relative flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-amber-700/40 bg-gradient-to-r from-zinc-900 via-amber-950/20 to-zinc-900 hover:border-amber-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20 p-6 sm:p-8 overflow-hidden"
    >
      {/* Background sparkle decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Crown icon */}
      <div className="relative flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-900/60 to-zinc-900 border border-amber-700/40 flex items-center justify-center shadow-xl shadow-black/40">
        <Crown className="h-9 w-9 text-amber-400" />
      </div>

      {/* Text */}
      <div className="flex-1 text-center sm:text-left">
        <span className="inline-block text-[10px] font-bold tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full mb-2">
          👑 ASSINATURA PREMIUM — ACESSO COMPLETO
        </span>
        <h3 className="text-stone-100 font-bold text-xl sm:text-2xl leading-tight mb-2">
          Torne-se Membro e desbloqueie tudo
        </h3>
        <p className="text-stone-400 text-sm leading-relaxed mb-3 max-w-md">
          Receitas premium, artigos exclusivos, aulas em vídeo e comunidade privada.
          Tudo o que você precisa para transformar sua saúde.
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-stone-500 text-xs ml-1">+500 membros ativos</span>
          </div>
          <div className="text-amber-400 font-bold text-lg">
            A partir de <span className="text-2xl">R$ 35</span>/mês
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 bg-amber-500 group-hover:bg-amber-400 text-zinc-950 font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap shadow-lg shadow-amber-900/30">
          <Crown className="h-4 w-4" />
          Quero ser Membro
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
