"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Flame,
  Brain,
  Sun,
  Dumbbell,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { KiwifyCheckoutDialog } from "@/components/checkout/kiwify-checkout-dialog";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/* ─────────────────────────────────────────────
   Grain overlay (identical to mentoria-jejum)
───────────────────────────────────────────── */
function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.022]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   Pulse CTA – adapted from PulseCTA (onClick)
───────────────────────────────────────────── */
function PulseCTAButton({
  label,
  onClick,
  disabled,
  variant = "primary",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}) {
  const base =
    "group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl px-8 py-5 text-sm font-black uppercase tracking-[0.1em] shadow-2xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
  const styles =
    variant === "primary"
      ? "bg-amber-500 text-zinc-950 shadow-amber-500/30 hover:bg-amber-400 hover:shadow-amber-400/40"
      : "bg-zinc-800 text-zinc-100 shadow-zinc-800/30 hover:bg-zinc-700";

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl ring-2 ring-amber-400/50 animate-ping opacity-30"
        />
      )}
      <span className="relative">{label}</span>
      <ArrowRight className="relative h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/* ─────────────────────────────────────────────
   Arsenal cards data
───────────────────────────────────────────── */
const arsenal = [
  {
    icon: Flame,
    tag: "Protocolo I",
    title: "Jejum Ancestral",
    description:
      "Domine o Jejum Intermitente e estendido. Autofagia, cetose e controle absoluto da fome — o que a indústria alimentícia nunca quis que você soubesse.",
    accent: "from-amber-500/10 to-transparent",
    border: "hover:border-amber-500/40",
  },
  {
    icon: Sun,
    tag: "Protocolo II",
    title: "Biologia Ancestral",
    description:
      "Exposição solar estratégica, carnes de qualidade, eliminação de ultraprocessados e o roadmap completo para recuperar a testosterona e a libido naturalmente.",
    accent: "from-orange-500/10 to-transparent",
    border: "hover:border-orange-500/40",
  },
  {
    icon: Brain,
    tag: "Protocolo III",
    title: "Mente Ancestral",
    description:
      "Clareza mental radical. Elimine a névoa cognitiva com protocolos de foco, sono profundo, respiração e gestão do estresse que o homem moderno perdeu.",
    accent: "from-sky-500/10 to-transparent",
    border: "hover:border-sky-500/40",
  },
  {
    icon: Dumbbell,
    tag: "Protocolo IV",
    title: "Espírito Ancestral",
    description:
      "Treino funcional primal, comunidade exclusiva do Clã e os rituais diários que reconstroem disciplina, propósito e força de caráter — do zero.",
    accent: "from-emerald-500/10 to-transparent",
    border: "hover:border-emerald-500/40",
  },
];

/* ─────────────────────────────────────────────
   Symptoms (O Inimigo)
───────────────────────────────────────────── */
const symptoms = [
  "Libido destruída pela inflamação crônica",
  "Gordura visceral que não sai nem na dieta",
  "Névoa mental que te impede de performar",
  "Cansaço mesmo dormindo 8 horas",
  "Dependência de açúcar e ultraprocessados",
  "Testosterona caindo ano após ano",
];

/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */
const faqs = [
  {
    q: "Tem fidelidade?",
    a: "Não. No plano mensal você cancela quando quiser, sem burocracia. No anual, você trava o melhor preço por 12 meses.",
  },
  {
    q: "Consigo cancelar fácil?",
    a: "Sim. Cancele a qualquer momento direto pelo painel — sem ligar para ninguém.",
  },
  {
    q: "Serve para iniciantes?",
    a: "Com certeza. O conteúdo vai do protocolo básico ao avançado. Você começa onde está.",
  },
  {
    q: "Quais formas de pagamento?",
    a: "PIX e Cartão de Crédito, 100% seguro via Kiwify.",
  },
];

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
export default function AssinaturaPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<"monthly" | "yearly">("yearly");
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          const user = data.user;
          const newUserData = {
            name: user.name || "",
            email: user.email || "",
            phone: user.whatsapp || "",
          };
          console.log("[ASSINATURA] Loaded user data:", newUserData);
          setUserData(newUserData);
          setIsLoggedIn(true);
        } else {
          console.log("[ASSINATURA] User not logged in");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCheckoutClick = (frequency: "monthly" | "yearly") => {
    setSelectedFrequency(frequency);
    setShowCheckoutForm(true);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950 text-zinc-200">
      <GrainOverlay />
      <Header />

      <main className="relative z-10 flex-1">

        {/* ══════════════════════════════
            HERO
        ══════════════════════════════ */}
        <section className="relative overflow-hidden border-b border-zinc-800/60 py-24 md:py-36">
          {/* ambient glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(245,158,11,0.12),transparent)]" />

          <div className="container relative mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-4xl text-center"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                  O Clã Ancestral — Acesso Total
                </span>
              </div>

              <h1 className="mb-6 font-serif text-5xl font-bold leading-[1.1] tracking-tight text-zinc-50 md:text-7xl">
                Abandone a Biologia{" "}
                <span className="text-amber-500">do Homem Moderno.</span>
                <br />
                Entre para o Clã.
              </h1>

              <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
                Um único acesso libera todos os nossos protocolos de Jejum, Biologia Ancestral,
                Mente e Espírito. Tudo que a indústria alimentícia não quer que você descubra —
                reunido em um só lugar.
              </p>

              {/* Toggle */}
              <div className="mb-10 flex items-center justify-center gap-4">
                <span
                  className={`text-sm font-semibold transition-colors ${!isAnnual ? "text-zinc-100" : "text-zinc-500"}`}
                >
                  Mensal
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  aria-label="Alternar plano mensal/anual"
                  className={`relative h-8 w-14 rounded-full transition-colors ${
                    isAnnual ? "bg-amber-500" : "bg-zinc-700"
                  }`}
                >
                  <motion.div
                    className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md"
                    animate={{ left: isAnnual ? "calc(100% - 28px)" : "4px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
                <span
                  className={`text-sm font-semibold transition-colors ${isAnnual ? "text-zinc-100" : "text-zinc-500"}`}
                >
                  Anual{" "}
                  <span className="ml-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-bold text-green-500">
                    -31%
                  </span>
                </span>
              </div>

              <div className="mx-auto max-w-xs">
                <PulseCTAButton
                  label={loading ? "Processando..." : "Entrar para o Clã"}
                  onClick={() => handleCheckoutClick(isAnnual ? "yearly" : "monthly")}
                  disabled={loading}
                />
              </div>

              <p className="mt-4 text-xs text-zinc-600">Sem fidelidade no plano mensal. Cancele quando quiser.</p>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════
            ANTES E DEPOIS
        ══════════════════════════════ */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-14 text-center"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-500">
                A prova real
              </p>
              <h2 className="font-serif text-4xl font-bold text-zinc-50 md:text-5xl">
                Isso não é marketing.{" "}
                <span className="text-amber-500">É biologia.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-zinc-500">
                O mesmo protocolo que ensino no Clã foi o que usei para sair de homem fraco,
                inflamado e sem energia — para chefe da própria vida.
              </p>
            </motion.div>

            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {/* ANTES */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
              >
                <div className="relative aspect-3/4 w-full overflow-hidden">
                  <Image
                    src="/images/fotos-antes-e-depois/antes.png"
                    alt="Gabriel — antes dos protocolos ancestrais"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {/* dark gradient bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

                  {/* label top */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-xs font-black uppercase tracking-widest text-zinc-400 backdrop-blur-sm">
                      Antes
                    </span>
                  </div>

                  {/* copy bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-serif text-xl font-bold leading-snug text-zinc-300">
                      Inflamado. Sem energia.<br />
                      <span className="text-zinc-500 font-normal text-base">Refém do açúcar, da névoa mental e da fraqueza que a modernidade vende como normal.</span>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* DEPOIS */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-amber-500/40 bg-zinc-900 shadow-xl shadow-amber-500/10"
              >
                <div className="relative aspect-3/4 w-full overflow-hidden">
                  <Image
                    src="/images/fotos-antes-e-depois/depois.jpeg"
                    alt="Gabriel — depois dos protocolos ancestrais"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {/* amber gradient bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

                  {/* label top */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-amber-400 backdrop-blur-sm">
                      Depois
                    </span>
                  </div>

                  {/* copy bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-serif text-xl font-bold leading-snug text-zinc-50">
                      Forte. Focado. Chefe da casa.<br />
                      <span className="text-amber-400/80 font-normal text-base">Testosterona, libido e clareza mental de volta — sem remédio, sem milagre.</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* quote */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-10 max-w-xl text-center font-serif text-lg font-semibold text-zinc-400"
            >
              "Não mudei de genética. Mudei o que coloco no corpo e como vivo.
              <span className="text-amber-500"> O Clã ensina exatamente isso."</span>
            </motion.p>
          </div>
        </section>

        {/* ══════════════════════════════
            O ARSENAL — 4 Pilares
        ══════════════════════════════ */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-14 text-center"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-500">
                O que você acessa
              </p>
              <h2 className="font-serif text-4xl font-bold text-zinc-50 md:text-5xl">
                O Arsenal Completo
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-zinc-500">
                Quatro protocolos construídos com base na biologia humana — não em modismos de
                academia ou pauta de nutricionista de Instagram.
              </p>
            </motion.div>

            <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
              {arsenal.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-7 transition-all duration-300 ${item.border}`}
                  >
                    {/* accent glow */}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-linear-to-br ${item.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />
                    <div className="relative">
                      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-600">
                        {item.tag}
                      </p>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                          <Icon className="h-5 w-5 text-amber-500" />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-zinc-50">{item.title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-400">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            CERTIFICADOS
        ══════════════════════════════ */}
        <section className="border-t border-zinc-800/60 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-500">
                Credenciais
              </p>
              <h2 className="font-serif text-4xl font-bold text-zinc-50 md:text-5xl">
                Protocolo com base científica,<br />
                <span className="text-amber-500">não com achismo.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-zinc-500">
                Cada protocolo do Clã é fundamentado em formações certificadas internacionalmente —
                não em trend de Instagram.
              </p>
            </motion.div>

            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {/* Certificado 1 — Jejum */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:border-amber-500/30"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-800">
                  <Image
                    src="/images/certificados/Intermittent-Fasting.jpg"
                    alt="Certificado de Jejum Intermitente — Dr. O'Neil"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
                    Certificação Internacional
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-bold text-zinc-50">
                    Jejum Intermitente — Dr. O&apos;Neil
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Formação completa em protocolos de jejum, autofagia e saúde metabólica.
                  </p>
                </div>
              </motion.div>

              {/* Certificado 2 — Keto */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:border-amber-500/30"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-800">
                  <Image
                    src="/images/certificados/keto-coach.png"
                    alt="Ketogenic Diet: Keto Nutrition Health Coach Certification"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
                    Certificação Internacional
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-bold text-zinc-50">
                    Keto Nutrition Health Coach
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Coach certificado em dieta cetogênica e nutrição ancestral de baixo carboidrato.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* +10 certificados */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto mt-8 flex max-w-4xl items-center gap-4"
            >
              {/* avatares empilhados simulando certificados */}
              <div className="flex -space-x-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-zinc-900 bg-zinc-800 text-xs font-bold text-zinc-500"
                    style={{ zIndex: 5 - i }}
                  >
                    🏅
                  </div>
                ))}
              </div>
              <p className="text-sm text-zinc-500">
                Esses são apenas 2 de uma jornada com{" "}
                <span className="font-bold text-amber-500">+10 certificações internacionais</span>{" "}
                em saúde, nutrição e performance humana.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════
            O INIMIGO
        ══════════════════════════════ */}
        <section className="border-y border-zinc-800/60 bg-zinc-900/40 py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center"
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-red-500">
                    O diagnóstico que ninguém quer dar
                  </span>
                </div>
                <h2 className="font-serif text-4xl font-bold text-zinc-50 md:text-5xl">
                  A indústria alimentícia{" "}
                  <span className="text-red-500">quebrou sua biologia</span>{" "}
                  deliberadamente.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
                  Ultraprocessados, óleos vegetais inflamatórios, açúcar disfarçado em tudo e
                  deficiência de sol — o resultado é o homem mais fraco, mais gordo e mais
                  ansioso da história. Reconhece algum desses sintomas?
                </p>
              </motion.div>

              <div className="grid gap-3 sm:grid-cols-2">
                {symptoms.map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-center gap-3 rounded-xl border border-red-500/10 bg-red-500/5 px-5 py-3.5"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                    <span className="text-sm font-medium text-zinc-300">{s}</span>
                  </motion.div>
                ))}
              </div>

              {/* Manifesto — O Sistema */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 overflow-hidden rounded-2xl border border-red-500/10 bg-zinc-950"
              >
                <div className="border-b border-red-500/10 px-6 py-4">
                  <p className="text-xs font-black uppercase tracking-widest text-red-500">
                    ⚠ O que ninguém te conta
                  </p>
                </div>
                <div className="space-y-5 p-6 md:p-8">
                  <p className="font-serif text-2xl font-bold leading-snug text-zinc-50 md:text-3xl">
                    O sistema não quer você forte.{" "}
                    <span className="text-red-400">Quer você dócil.</span>
                  </p>
                  <p className="text-zinc-400 leading-relaxed">
                    Ultraprocessados que viciam e inflamam. Óleos vegetais que destroem sua
                    testosterona. Açúcar em tudo que te deixa dependente. Tela de celular à
                    meia-noite que arruína seu cortisol. Protector solar que bloqueia o sol que
                    geraria sua vitamina D. Isso não é descuido da indústria —{" "}
                    <span className="font-semibold text-zinc-200">é o modelo de negócio.</span>
                  </p>
                  <p className="text-zinc-400 leading-relaxed">
                    Um homem com energia alta, testosterona elevada, mente clara e libido de volta
                    não compra remédio para disfunção. Não compra ansiolítico. Não come fast food
                    toda semana. Não precisa de entretenimento vazio para suportar a própria vida.{" "}
                    <span className="font-semibold text-zinc-200">
                      Ele é perigoso para o sistema.
                    </span>
                  </p>
                  <div className="border-t border-zinc-800 pt-5">
                    <p className="font-serif text-lg font-bold text-amber-500">
                      O Clã Ancestral existe para te devolver o que roubaram de você.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10 text-center font-serif text-2xl font-bold text-amber-500"
              >
                O Clã Ancestral existe para reverter cada um deles.
              </motion.p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            PRICING
        ══════════════════════════════ */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-14 text-center"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-500">
                Investimento
              </p>
              <h2 className="font-serif text-4xl font-bold text-zinc-50 md:text-5xl">
                Escolha seu compromisso
              </h2>
            </motion.div>

            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {/* Card Mensal */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`relative rounded-2xl border bg-zinc-900 p-8 transition-all duration-300 ${
                  !isAnnual
                    ? "scale-[1.02] border-amber-500/50 shadow-2xl shadow-amber-500/10"
                    : "border-zinc-800"
                }`}
              >
                {!isAnnual && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-amber-500 px-4 py-1 text-xs font-black uppercase tracking-widest text-zinc-950 shadow-lg">
                      Selecionado
                    </span>
                  </div>
                )}
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Plano Mensal
                </p>
                <h3 className="font-serif text-2xl font-bold text-zinc-50">Flexibilidade total</h3>
                <div className="my-6 border-t border-zinc-800 pt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-5xl font-black text-zinc-50">R$ 29</span>
                    <span className="text-zinc-500">/mês</span>
                  </div>
                  <p className="mt-1.5 text-sm text-zinc-600">Cancele quando quiser</p>
                </div>
                <PulseCTAButton
                  label={loading ? "Processando..." : "Entrar para o Clã"}
                  onClick={() => handleCheckoutClick("monthly")}
                  disabled={loading}
                  variant="secondary"
                />
              </motion.div>

              {/* Card Anual */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`relative rounded-2xl border-2 bg-zinc-900 p-8 transition-all duration-300 ${
                  isAnnual
                    ? "scale-[1.02] border-amber-500 shadow-2xl shadow-amber-500/20"
                    : "border-zinc-800"
                }`}
              >
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-linear-to-r from-amber-500 to-amber-400 px-4 py-1 text-xs font-black uppercase tracking-widest text-zinc-950 shadow-lg">
                    Melhor Valor
                  </span>
                </div>

                {/* ambient top glow on annual */}
                {isAnnual && (
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-2xl bg-linear-to-b from-amber-500/8 to-transparent" />
                )}

                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-500">
                  Plano Anual
                </p>
                <h3 className="font-serif text-2xl font-bold text-amber-400">Compromisso máximo</h3>
                <div className="my-6 border-t border-zinc-800 pt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-5xl font-black text-amber-500">R$ 238,80</span>
                    <span className="text-zinc-500">/ano</span>
                  </div>
                  <p className="mt-1.5 text-sm text-amber-500/70">
                    Equivale a R$ 19,90/mês — economize R$ 109/ano
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5">
                    <span className="text-xs font-bold text-green-400">Economize 31%</span>
                  </div>
                </div>
                <PulseCTAButton
                  label={loading ? "Processando..." : "Entrar para o Clã"}
                  onClick={() => handleCheckoutClick("yearly")}
                  disabled={loading}
                />
              </motion.div>
            </div>

            {/* Guarantee line */}
            <p className="mt-8 text-center text-xs text-zinc-600">
              Pagamento 100% seguro via Kiwify · PIX e Cartão de Crédito
            </p>
          </div>
        </section>

        {/* ══════════════════════════════
            FAQ
        ══════════════════════════════ */}
        <section className="border-t border-zinc-800/60 bg-zinc-900/30 py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-2xl"
            >
              <h2 className="mb-10 text-center font-serif text-3xl font-bold text-zinc-50">
                Perguntas Frequentes
              </h2>
              <div className="divide-y divide-zinc-800">
                {faqs.map((faq, i) => (
                  <div key={i} className="py-5">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between gap-4 text-left"
                    >
                      <span className="font-semibold text-zinc-100">{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-amber-500 transition-transform duration-300 ${
                          openFaq === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════
            CTA FINAL
        ══════════════════════════════ */}
        <section className="border-t border-zinc-800/60 py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto max-w-2xl text-center"
            >
              {/* ambient glow */}
              <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-amber-500/8 blur-3xl" />

              <h2 className="relative mb-4 font-serif text-4xl font-bold text-zinc-50 md:text-5xl">
                Ou você recupera sua biologia.{" "}
                <span className="text-amber-500">Ou continua igual.</span>
              </h2>
              <p className="mb-10 text-zinc-500">
                Centenas de homens já estão dentro do Clã. A pergunta é: quanto tempo mais você
                vai esperar?
              </p>
              <div className="mx-auto flex max-w-sm flex-col gap-4">
                <PulseCTAButton
                  label={loading ? "Processando..." : "Entrar para o Clã Agora"}
                  onClick={() => handleCheckoutClick(isAnnual ? "yearly" : "monthly")}
                  disabled={loading}
                />
                <Link
                  href="/sobre"
                  className="text-sm text-zinc-600 underline-offset-4 hover:text-zinc-400 hover:underline"
                >
                  Quero saber mais antes
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Checkout Dialog (Kiwify) */}
      <KiwifyCheckoutDialog
        open={showCheckoutForm}
        onOpenChange={setShowCheckoutForm}
        product={selectedFrequency === "yearly" ? "anual" : "mensal"}
        defaultValues={userData}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
