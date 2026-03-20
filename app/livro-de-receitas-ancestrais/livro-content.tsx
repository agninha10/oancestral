"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Shield,
  Lock,
  Flame,
  Clock,
  Brain,
  CheckCircle,
  Star,
  Zap,
  Award,
  ChevronRight,
  Beef,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { KiwifyCheckoutDialog } from "@/components/checkout/kiwify-checkout-dialog";

// ─── Shared CTA button ────────────────────────────────────────────────────────
function BuyButton({
  onClick,
  children,
  fullWidth = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={`relative inline-flex ${fullWidth ? "w-full" : ""}`}>
      <span className="absolute inset-0 rounded-xl bg-amber-500 animate-ping opacity-20 pointer-events-none" />
      <button
        onClick={onClick}
        className={`relative z-10 inline-flex items-center justify-center gap-3 rounded-xl bg-amber-600 px-8 py-5 text-lg font-extrabold uppercase tracking-wide text-zinc-950 shadow-lg shadow-amber-900/40 transition-all duration-200 hover:bg-amber-500 hover:shadow-amber-700/60 active:scale-95 ${
          fullWidth ? "w-full" : ""
        }`}
      >
        {children}
      </button>
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <div className="h-px bg-gradient-to-r from-transparent via-amber-800/50 to-transparent" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LivroContent() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({ name: "", email: "", phone: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.user) return;
        setUserData({
          name: data.user.name ?? "",
          email: data.user.email ?? "",
          phone: data.user.whatsapp ?? "",
        });
        setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  const openCheckout = () => setCheckoutOpen(true);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <Header />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center px-4 pt-14 pb-20 text-center md:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(217,119,6,0.18)_0%,transparent_70%)]" />

        {/* Badge */}
        <div className="relative mb-7 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
          <Flame className="h-3.5 w-3.5" />
          A nutrição que a sociedade moderna tentou esconder de você
        </div>

        {/* H1 */}
        <h1 className="relative mx-auto max-w-3xl font-serif text-4xl font-extrabold leading-tight tracking-tight text-zinc-100 md:text-6xl">
          O Fim das Dietas Fracas: Assuma o{" "}
          <span className="text-amber-500">Controle</span> da Sua{" "}
          <span className="text-amber-500">Biologia</span> com a Dieta da Selva.
        </h1>

        <p className="relative mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Mais de{" "}
          <strong className="text-zinc-200">100 receitas</strong> focadas em
          carnes, órgãos e gorduras naturais para{" "}
          <strong className="text-zinc-200">explodir seus níveis hormonais</strong>,
          derreter gordura e recuperar o vigor ancestral.
        </p>

        {/* Ebook cover */}
        <div className="relative mt-10 mb-10 w-64 md:w-72 mx-auto">
          <div className="absolute -inset-4 blur-3xl bg-amber-600/25 rounded-full" />
          <div className="relative aspect-[5/7] rounded-xl border border-amber-700/40 bg-gradient-to-b from-zinc-800 to-zinc-950 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 text-center">
            <Flame className="h-10 w-10 text-amber-500 mb-3 opacity-60" />
            <p className="font-serif text-base font-bold text-amber-400 opacity-60">
              Manual da Cozinha Ancestral
            </p>
            <p className="text-xs text-zinc-500 mt-1 opacity-60">+100 Receitas</p>
            <Image
              src="/images/capa-livro-de-receitas.png"
              alt="Capa do E-book: Manual da Cozinha Ancestral"
              fill
              sizes="(max-width: 768px) 256px, 288px"
              className="object-cover rounded-xl"
              priority
            />
          </div>
        </div>

        {/* Hero CTA */}
        <BuyButton onClick={openCheckout}>
          <Zap className="h-5 w-5" />
          QUERO DESTRAVAR MINHA BIOLOGIA (R$&nbsp;49)
        </BuyButton>

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-zinc-500">
          <Lock className="h-4 w-4 text-green-500 flex-shrink-0" />
          Pagamento 100% seguro via Kiwify | Acesso Imediato
        </div>
      </section>

      <Divider />

      {/* ── DOR / PROBLEMA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="mb-3 text-center font-serif text-3xl font-extrabold text-zinc-100 md:text-4xl">
          O homem moderno está{" "}
          <span className="text-red-500">doente, fraco e inflamado.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-zinc-400">
          E não é por falta de força de vontade. É porque o jogo foi manipulado.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-900/40 flex-shrink-0">
                <Flame className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100">
                A Grande Mentira Industrial
              </h3>
            </div>
            <p className="leading-relaxed text-zinc-400">
              Há décadas a indústria alimentícia empurra grãos refinados, óleos
              de sementes e ultraprocessados como &ldquo;saudáveis&rdquo;. Esses
              alimentos disparam a inflamação crônica, destroem a sensibilidade
              à insulina e colapsam a produção de testosterona.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-900/40 flex-shrink-0">
                <Award className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100">
                O Caminho dos Ancestrais
              </h3>
            </div>
            <p className="leading-relaxed text-zinc-400">
              Nossos ancestrais não contavam calorias. Comiam com{" "}
              <strong className="text-zinc-200">densidade nutricional máxima</strong>{" "}
              — carnes, órgãos, tutano, gorduras animais saturadas. Alimentos
              que alimentam as mitocôndrias, constroem músculos e regulam
              hormônios.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/30 p-8">
          <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Você se identifica com algum desses sinais?
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Cansaço sem motivo aparente o dia todo",
              "Barriga que não some mesmo na dieta",
              "Libido baixa e humor instável",
              "Névoa mental e falta de foco",
              "Inflamações e dores recorrentes",
              "Sensação de envelhecer antes da hora",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-zinc-400">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Divider />

      {/* ── SOLUÇÃO / PRODUTO ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-amber-500">
          O Produto
        </p>
        <h2 className="mb-4 text-center font-serif text-3xl font-extrabold text-zinc-100 md:text-4xl">
          Apresentando: O Manual da Cozinha Ancestral
        </h2>
        <p className="mx-auto mb-14 max-w-xl text-center text-zinc-400">
          O guia prático e definitivo para comer com propósito, otimizar sua
          biologia e voltar a sentir a força que sempre foi sua.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              {
                Icon: Beef,
                title: "+100 Receitas Carnívoras / Ceto",
                desc: "Do steak básico ao tutano assado. Receitas de carnes, órgãos e gorduras com passo a passo simples.",
              },
              {
                Icon: Zap,
                title: "Otimização Hormonal Natural",
                desc: "Ingredientes selecionados para maximizar testosterona e equilíbrio endócrino sem suplementos caros.",
              },
              {
                Icon: Clock,
                title: "Preparo Prático e Rápido",
                desc: "A maioria das receitas leva menos de 30 minutos. Sem desculpa para não cozinhar direito.",
              },
              {
                Icon: Brain,
                title: "Foco e Clareza Mental",
                desc: "Gorduras cerebrais e nutrientes ancestrais que alimentam o cérebro e eliminam a névoa mental.",
              },
            ] as const
          ).map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="group flex flex-col items-start rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 transition-colors hover:border-amber-700/50 hover:bg-zinc-900"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-900/40 transition-colors group-hover:bg-amber-800/60">
                <Icon className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="mb-2 text-base font-bold text-zinc-100">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── BÔNUS ────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <div className="relative rounded-2xl border-2 border-amber-500/60 bg-gradient-to-b from-amber-950/40 to-zinc-900/80 p-8 shadow-xl shadow-amber-900/20 md:p-12">
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-amber-500/5" />

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Star className="h-3 w-3 fill-amber-400" />
            Bônus Exclusivo
          </div>

          <h2 className="mt-2 font-serif text-2xl font-extrabold text-zinc-100 md:text-3xl">
            Acesso Vitalício às{" "}
            <span className="text-amber-500">Receitas Premium</span> do Portal
          </h2>

          <p className="mt-4 leading-relaxed text-zinc-400">
            Ao garantir o E-book hoje, sua conta no portal O Ancestral é{" "}
            <strong className="text-zinc-200">automaticamente atualizada</strong>.
            Todas as receitas bloqueadas com cadeado serão suas{" "}
            <strong className="text-zinc-200">para sempre</strong>. Sem
            assinatura, sem mensalidade, sem prazo.
          </p>

          <ul className="mt-6 space-y-3">
            {[
              "Acesso imediato a todas as receitas premium bloqueadas do portal",
              "Sem renovação. Vitalício — pague uma vez, acesse para sempre.",
              "Novas receitas adicionadas? Você recebe sem pagar nada extra.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-zinc-300">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-lg border border-amber-800/40 bg-amber-950/30 px-5 py-4 text-sm text-amber-300">
            Só esse acesso custaria{" "}
            <strong className="text-amber-200">R$ 97/ano</strong>. Ao comprar
            hoje, é{" "}
            <strong className="text-amber-200 underline decoration-amber-500/60">
              completamente de graça
            </strong>
            .
          </div>
        </div>
      </section>

      <Divider />

      {/* ── OFERTA + CTA FINAL ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl md:p-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Oferta por tempo limitado
          </p>
          <h2 className="font-serif text-2xl font-extrabold text-zinc-100">
            Tudo que você recebe hoje:
          </h2>

          <ul className="mt-6 space-y-3 text-left">
            {[
              "E-book: +100 Receitas Ancestrais (PDF, acesso digital imediato)",
              "Acesso Vitalício às Receitas Premium do Portal",
              "Atualizações gratuitas do e-book para sempre",
              "Download imediato após o pagamento",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-zinc-300">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <span className="text-lg text-zinc-500 line-through">De R$ 146,00</span>
              <span className="rounded-full bg-red-900/50 px-2.5 py-0.5 text-xs font-bold text-red-400">
                −66%
              </span>
            </div>
            <span className="font-serif text-6xl font-extrabold text-amber-500 leading-none">
              R$ 49,00
            </span>
            <p className="mt-1 text-sm text-zinc-400">Pagamento Único · Acesso Vitalício</p>
          </div>

          <div className="mt-8">
            <BuyButton onClick={openCheckout} fullWidth>
              <Zap className="h-5 w-5" />
              GARANTIR MEU E-BOOK AGORA
              <ChevronRight className="h-5 w-5" />
            </BuyButton>
          </div>

          <div className="mt-6 flex items-center gap-4 rounded-xl border border-zinc-700/50 bg-zinc-800/40 px-5 py-4 text-left">
            <Shield className="h-10 w-10 flex-shrink-0 text-green-400" />
            <div>
              <p className="text-sm font-bold text-zinc-100">
                7 Dias de Garantia Incondicional
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">
                Não ficou satisfeito? Devolvemos 100% do seu dinheiro. Sem
                perguntas, sem burocracia.{" "}
                <strong className="text-zinc-300">Risco Zero.</strong>
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-zinc-500">
            <Lock className="h-4 w-4 text-green-500 flex-shrink-0" />
            Pagamento 100% seguro via Kiwify
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/60 bg-zinc-950 px-4 pb-10 pt-10">
        <div className="mx-auto max-w-4xl text-center">
          <span className="font-serif text-lg font-bold tracking-[0.2em] text-zinc-400 uppercase">
            O Ancestral
          </span>
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-xs text-zinc-600">
            <a href="/termos-de-servico" className="transition-colors hover:text-zinc-400">Termos de Serviço</a>
            <a href="/politica-de-privacidade" className="transition-colors hover:text-zinc-400">
              Política de Privacidade
            </a>
            <a href="/contato" className="transition-colors hover:text-zinc-400">Contato</a>
          </div>
          <p className="mx-auto mt-8 max-w-xl text-xs leading-relaxed text-zinc-700">
            <strong className="text-zinc-600">Aviso Legal:</strong> O conteúdo
            deste E-book tem fins exclusivamente informativos e educacionais. As
            informações não substituem orientação, diagnóstico ou tratamento
            médico profissional. Consulte um médico antes de realizar mudanças
            significativas na sua alimentação. Resultados podem variar.
          </p>
          <p className="mt-6 text-xs text-zinc-700">
            © {new Date().getFullYear()} O Ancestral. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* ── Checkout dialog ──────────────────────────────────────────────────── */}
      <KiwifyCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        product="livro-ancestral"
        defaultValues={userData}
        isLoggedIn={isLoggedIn}
      />
    </main>
  );
}
