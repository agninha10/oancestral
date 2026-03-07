import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Mail,
  LogIn,
  Download,
  ArrowRight,
  BookOpen,
  Flame,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Compra Confirmada! | O Ancestral",
  description: "Seu pedido foi aprovado. Acesse agora o portal O Ancestral.",
  robots: { index: false, follow: false },
};

// Kiwify URL template: /obrigado?product=livro-ancestral&name={customer_name}&email={customer_email}
interface SearchParams {
  product?: string;
  name?: string;
  email?: string;
}

const PRODUCT_INFO: Record<
  string,
  { title: string; subtitle: string; steps: string[] }
> = {
  "livro-ancestral": {
    title: "Manual da Cozinha Ancestral",
    subtitle: "+100 Receitas Ancestrais — Acesso Vitalício",
    steps: [
      "Verifique seu e-mail — enviamos seu código de acesso",
      "Acesse o portal com seu e-mail e o link recebido",
      "Baixe seu ebook em Meus Ebooks no painel",
    ],
  },
  jejum: {
    title: "Guia Definitivo do Jejum Intermitente",
    subtitle: "Ebook completo para download",
    steps: [
      "Verifique seu e-mail — enviamos seu código de acesso",
      "Acesse o portal com o link recebido por e-mail",
      "Baixe seu ebook em Meus Ebooks no painel",
    ],
  },
  mensal: {
    title: "Assinatura Mensal O Ancestral",
    subtitle: "Acesso completo ao portal por 30 dias",
    steps: [
      "Verifique seu e-mail — enviamos seu código de acesso",
      "Acesse o portal com seu e-mail",
      "Explore todas as receitas, cursos e conteúdos premium",
    ],
  },
  anual: {
    title: "Assinatura Anual O Ancestral",
    subtitle: "Acesso completo ao portal por 12 meses",
    steps: [
      "Verifique seu e-mail — enviamos seu código de acesso",
      "Acesse o portal com seu e-mail",
      "Explore todas as receitas, cursos e conteúdos premium",
    ],
  },
};

// Upsell config: what to show based on what was purchased
const UPSELL: Record<
  string,
  { title: string; description: string; cta: string; href: string; badge: string } | null
> = {
  "livro-ancestral": {
    badge: "OFERTA ESPECIAL",
    title: "Quer ir além do livro?",
    description:
      "Com a assinatura O Ancestral você acessa +200 receitas exclusivas, cursos de culinária ancestral e uma comunidade de pessoas comprometidas com a saúde real. Tudo por menos de R$ 1 por dia.",
    cta: "Ver Planos de Assinatura",
    href: "/assinatura",
  },
  jejum: {
    badge: "RECOMENDADO",
    title: "Complete sua jornada com o Livro Ancestral",
    description:
      "O Guia do Jejum é poderoso — mas combinado com as receitas do Manual da Cozinha Ancestral, você tem um protocolo completo de saúde e longevidade.",
    cta: "Conhecer o Livro Ancestral",
    href: "/livro-de-receitas-ancestrais",
  },
  mensal: {
    badge: "ECONOMIZE 45%",
    title: "Migre para o Plano Anual",
    description:
      "Você está no mensal. Migrando para o anual você economiza R$ 158 por ano — e garante 12 meses de acesso sem se preocupar com renovação.",
    cta: "Ver Plano Anual",
    href: "/assinatura",
  },
  anual: null, // No upsell for annual — they're already at the top
};

export default async function ObrigadoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const product = params.product ?? "livro-ancestral";
  const firstName = params.name?.split(" ")[0] ?? "Bem-vindo";

  const info = PRODUCT_INFO[product] ?? PRODUCT_INFO["livro-ancestral"];
  const upsell = UPSELL[product];

  return (
    <main className="min-h-screen bg-zinc-950 text-stone-100 flex flex-col items-center justify-start px-4 py-16">
      {/* ── Confetti-like header ─────────────────────────────────── */}
      <div className="flex flex-col items-center text-center max-w-xl w-full">
        {/* Success icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-amber-400" />
          </div>
        </div>

        <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">
          Compra Confirmada
        </p>
        <h1 className="text-4xl font-bold text-stone-50 mb-3 leading-tight">
          {firstName}, seu pedido foi aprovado! 🎉
        </h1>
        <p className="text-stone-400 text-lg">
          <span className="text-amber-400 font-semibold">{info.title}</span>
          <br />
          <span className="text-sm">{info.subtitle}</span>
        </p>
      </div>

      {/* ── Next steps ───────────────────────────────────────────── */}
      <div className="mt-12 w-full max-w-lg">
        <h2 className="text-stone-300 text-sm font-semibold uppercase tracking-widest mb-5 text-center">
          Próximos passos
        </h2>
        <div className="space-y-3">
          {info.steps.map((step, i) => {
            const icons = [Mail, LogIn, Download];
            const Icon = icons[i] ?? CheckCircle2;
            return (
              <div
                key={i}
                className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4"
              >
                <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-xs text-amber-500 font-semibold">
                    PASSO {i + 1}
                  </span>
                  <p className="text-stone-200 text-sm mt-0.5">{step}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA buttons ──────────────────────────────────────────── */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-lg">
        <Button
          asChild
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-6 text-base"
        >
          <Link href="/auth/login">
            <LogIn className="h-4 w-4 mr-2" />
            Acessar o Portal
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="flex-1 border-zinc-700 text-stone-300 hover:text-stone-100 hover:bg-zinc-800 py-6"
        >
          <Link href="/dashboard/ebooks">
            <BookOpen className="h-4 w-4 mr-2" />
            Meus Ebooks
          </Link>
        </Button>
      </div>

      {/* ── Upsell box ───────────────────────────────────────────── */}
      {upsell && (
        <div className="mt-14 w-full max-w-lg">
          <div className="relative rounded-2xl bg-gradient-to-br from-amber-950/60 to-zinc-900 border border-amber-800/40 p-6 overflow-hidden">
            {/* Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-amber-500 text-zinc-950 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full">
                {upsell.badge}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Flame className="h-5 w-5 text-amber-400" />
              <h3 className="text-amber-300 font-bold text-lg">{upsell.title}</h3>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-5">
              {upsell.description}
            </p>

            {/* Social proof stars */}
            <div className="flex items-center gap-1.5 mb-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-stone-500 text-xs ml-1">
                +1.200 clientes satisfeitos
              </span>
            </div>

            <Button
              asChild
              className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold gap-2"
            >
              <Link href={upsell.href}>
                {upsell.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* ── Footer note ──────────────────────────────────────────── */}
      <p className="mt-12 text-stone-600 text-xs text-center max-w-sm">
        Dificuldades para acessar? Entre em contato pelo WhatsApp ou{" "}
        <Link href="/contato" className="text-amber-600 hover:text-amber-400 underline">
          formulário de contato
        </Link>
        .
      </p>
    </main>
  );
}
