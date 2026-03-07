"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useCallback } from "react"
import {
  Flame,
  Sparkles,
  Zap,
  Trophy,
  BookOpen,
  ListChecks,
  ChefHat,
  Gift,
  ArrowRight,
  Check,
  Shield,
  Star,
  Clock,
  AlertTriangle,
  Lock,
  MessageSquare,
  ChevronDown,
  X,
  Loader2,
  User,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { TransformationSection } from "./transformation-section"

const PRICE = "29,90"
const OLD_PRICE = "97,90"

function useCountdown(targetHours: number) {
  const [timeLeft, setTimeLeft] = useState({ h: targetHours, m: 59, s: 59 })
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 }
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 }
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 }
        return { h: targetHours, m: 59, s: 59 } // reinicia
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [targetHours])
  return timeLeft
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  return digits.length <= 10
    ? digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\(\d{2}\) \d{4})(\d)/, "$1-$2")
    : digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\(\d{2}\) \d{5})(\d)/, "$1-$2")
}

export default function JejumContent() {
  const [showSticky, setShowSticky] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState({ name: "", email: "", phone: "" })
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState("")
  const countdown = useCountdown(2)

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data?.user) return
        const { name, email, whatsapp } = data.user
        setCheckoutForm(prev => ({
          ...prev,
          name: name || prev.name,
          email: email || prev.email,
          phone: whatsapp ? maskPhone(whatsapp) : prev.phone,
        }))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const pad = (n: number) => String(n).padStart(2, "0")

  const openCheckout = useCallback(() => {
    setCheckoutError("")
    setShowCheckout(true)
  }, [])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setCheckoutLoading(true)
    setCheckoutError("")

    try {
      const res = await fetch("/api/checkout/kiwify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "jejum", ...checkoutForm }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erro ao processar pagamento")
      // Redireciona para o checkout Kiwify
      window.location.href = data.url
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : "Erro ao processar. Tente novamente.")
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Header />

      {/* ── STICKY CTA ── */}
      <motion.div
        initial={false}
        animate={{ y: showSticky ? 0 : -80, opacity: showSticky ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-stone-950/95 border-b border-amber-500/20 backdrop-blur py-3 px-4"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block text-sm font-semibold text-stone-300">
            Guia Definitivo do Jejum Intermitente —{" "}
            <span className="text-amber-500">R$ {PRICE}</span>
          </div>
          <Button onClick={openCheckout} size="sm" className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 rounded-full ml-auto">
            Quero o Ebook Agora <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-stone-950 to-stone-950" />
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: "radial-gradient(circle at center, rgba(245,158,11,0.15) 0%, transparent 60%)",
            backgroundSize: "120px 120px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Urgência topo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-full text-sm font-medium"
          >
            <AlertTriangle className="h-4 w-4" />
            Oferta por tempo limitado — expira em {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-amber-500/10 text-amber-500 border-amber-500/20 px-4 py-2 text-sm">
              Baseado no Prêmio Nobel de Medicina 2016
            </Badge>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight">
              Pare de Lutar{" "}
              <span className="text-amber-500">Contra seu Próprio Corpo</span>
            </h1>

            <p className="text-xl md:text-2xl text-stone-400 max-w-3xl mx-auto mb-4 leading-relaxed">
              O <strong className="text-stone-200">Guia Definitivo do Jejum Intermitente</strong> revela a tecnologia
              biológica que seu corpo já tem — e que a indústria alimentícia quer que você ignore.
            </p>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Ative a autofagia, queime gordura sem sofrimento e recupere a energia que você perdeu.
            </p>
          </motion.div>

          {/* Social proof números */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 py-6"
          >
            {[
              { value: "+3.200", label: "Leitores" },
              { value: "4.9★", label: "Avaliação média" },
              { value: "97%", label: "Recomendam" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-amber-500">{value}</div>
                <div className="text-stone-500 text-sm">{label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={openCheckout}
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-10 py-7 text-xl rounded-full group shadow-lg shadow-amber-500/25"
            >
              Quero o Ebook por R$ {PRICE}
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 text-stone-600 text-sm"
          >
            <div className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-green-500" /> Pagamento 100% seguro</div>
            <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-green-500" /> Garantia de 7 dias</div>
            <div className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> Acesso imediato</div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-stone-700 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-amber-500 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── O PROBLEMA ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-stone-950 to-stone-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              Você Foi Enganado Desde Sempre
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { pain: "Come de 3 em 3 horas e continua sem energia", truth: "Esse ciclo constante impede seu corpo de queimar gordura de verdade" },
              { pain: "Faz dieta mas a balança não sai do lugar", truth: "Calorias não são o problema — o pico de insulina constante sim" },
              { pain: "Inchaço que não passa, inflamação crônica", truth: "Seu corpo não tem tempo para se regenerar com alimentação contínua" },
              { pain: "Clareza mental zero, cansaço constante", truth: "Seu cérebro está rodando no combustível errado o tempo todo" },
            ].map(({ pain, truth }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-stone-800 bg-stone-900/50"
              >
                <p className="text-red-400 font-semibold mb-2 flex items-start gap-2">
                  <span className="text-xl">✗</span> {pain}
                </p>
                <p className="text-stone-400 text-sm leading-relaxed pl-6">{truth}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-10 p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center"
          >
            <p className="text-lg md:text-xl text-stone-300 leading-relaxed">
              <span className="text-amber-500 font-bold">A solução não é mais disciplina.</span>{" "}
              É entender como o seu corpo foi <em>projetado para funcionar</em> — e trabalhar a favor dele.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 px-4 bg-stone-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              O Que Acontece no Seu Corpo{" "}
              <span className="text-amber-500">Hora a Hora</span>
            </h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              A ciência que o Nobel de Medicina 2016 provou — e o ebook explica em linguagem simples
            </p>
          </motion.div>

          <div className="space-y-8 md:space-y-12">
            <TimelineStep timeRange="0–4h" title="Fase Digestiva" subtitle="Insulina Alta — Queima de Gordura Bloqueada" description="Seu corpo está processando a última refeição. Enquanto a insulina estiver elevada, NADA de gordura é queimada. É o estado em que você vive o dia todo se comer de 3 em 3 horas." icon={<ChefHat className="h-8 w-8" />} color="red" delay={0.1} />
            <TimelineStep timeRange="12–24h" title="A Virada Metabólica" subtitle="Queima de Gordura + Cetose Leve" description="A insulina caiu. Seu corpo finalmente acessa a gordura armazenada como combustível. Você começa a produzir cetonas — o combustível premium do cérebro. Foco e energia sobem." icon={<Flame className="h-8 w-8" />} color="amber" delay={0.2} />
            <TimelineStep timeRange="24–36h" title="Autofagia Ativada" subtitle="Prêmio Nobel — Limpeza e Rejuvenescimento Celular" description="Yoshinori Ohsumi ganhou o Nobel por descobrir isso: suas células começam a reciclar e eliminar componentes danificados. É a faxina profunda que reduz inflamação, previne doenças e rejuvenesce o corpo." icon={<Sparkles className="h-8 w-8" />} color="green" highlight delay={0.3} />
            <TimelineStep timeRange="48h+" title="Regeneração Máxima" subtitle="Sistema Imune Renovado + Hormônio do Crescimento" description="Células-tronco são ativadas. O HGH (hormônio do crescimento) pode aumentar até 5x. Seu sistema imune se renova do zero. Clareza mental extrema. É o modo ancestral de rejuvenescimento." icon={<Zap className="h-8 w-8" />} color="emerald" delay={0.4} />
          </div>
        </div>
      </section>

      {/* ── O QUE VOCÊ RECEBE ── */}
      <section className="py-20 px-4 bg-stone-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-amber-500/10 text-amber-500 border-amber-500/20 px-4 py-2">
              Tudo que você precisa em um lugar
            </Badge>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              O Que Está Dentro do Ebook
            </h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              Não é só teoria. É um guia prático e completo para você começar hoje
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <BundleCard title="Guia Completo do Jejum" description="História, ciência e prática em linguagem acessível. Entenda a biologia por trás de cada fase." icon={<BookOpen className="h-8 w-8" />} features={["A história ancestral do jejum (por que funciona há milênios)", "A ciência da autofagia explicada do zero", "Como o jejum reprograma seu metabolismo", "Todos os mitos desmontados com ciência"]} delay={0.1} />
            <BundleCard title="Protocolos Passo a Passo" description="Do iniciante ao avançado. Comece no seu ritmo e evolua com segurança." icon={<ListChecks className="h-8 w-8" />} features={["Protocolo Iniciante 12/12 — prepare seu corpo", "Protocolo 16/8 — queima de gordura ideal", "Protocolo 24–48h — autofagia profunda", "Protocolo Extremo 72h+ — regeneração máxima"]} delay={0.2} />
            <BundleCard title="Guia de Alimentação" description="O que comer antes e como quebrar o jejum sem perder os benefícios." icon={<ChefHat className="h-8 w-8" />} features={["A refeição pré-jejum ideal para resultados máximos", "A quebra de jejum perfeita com Caldo de Ossos", "Receitas ancestrais que potencializam a autofagia", "Lista completa de alimentos permitidos e proibidos"]} delay={0.3} />
            <BundleCard title="Bônus: Cetogênica + Jejum" description="A combinação mais poderosa para acelerar resultados. Sincronize dieta e jejum." icon={<Gift className="h-8 w-8" />} features={["Como entrar em cetose em menos de 24h", "Macros ideais para jejum prolongado", "Suplementação estratégica (o que realmente funciona)", "Cardápios cetogênicos prontos para usar"]} delay={0.4} highlight />
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="py-20 px-4 bg-stone-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Quem Já Leu Está{" "}
              <span className="text-amber-500">Transformando</span>
            </h2>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 text-amber-500 fill-amber-500" />)}
            </div>
            <p className="text-stone-400">+3.200 leitores — avaliação média 4.9/5</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Mariana S.", location: "São Paulo, SP", stars: 5, text: "Perdi 6kg em 3 semanas sem sofrimento. O protocolo 16/8 mudou minha relação com a comida. O guia explica tudo de um jeito simples e sem enrolação." },
              { name: "Roberto L.", location: "Belo Horizonte, MG", stars: 5, text: "Tinha tentado de tudo. Dieta, academia, suplementos. O jejum foi a única coisa que realmente funcionou. Menos inchaço, mais energia e clareza mental absurda." },
              { name: "Fernanda T.", location: "Curitiba, PR", stars: 5, text: "Comprei com desconfiança. Me arrependo de não ter comprado antes. Os protocolos são muito bem explicados e as receitas são deliciosas. Vale muito mais que o preço." },
              { name: "Carlos M.", location: "Rio de Janeiro, RJ", stars: 5, text: "Sou médico e fiquei impressionado com a qualidade científica do conteúdo. A parte da autofagia está impecável. Recomendo para meus pacientes." },
              { name: "Ana Paula R.", location: "Fortaleza, CE", stars: 5, text: "Acordei sem fome, sem aquela ansiedade por comida, com a cabeça leve. Nunca pensei que jejum fosse tão fácil com o guia certo. Compra certa!" },
              { name: "Diego F.", location: "Porto Alegre, RS", stars: 5, text: "Em 2 semanas de 16/8 já senti diferença no inchaço. Na 4ª semana já tentei 24h. O guia prepara você gradualmente. Perfeito para quem nunca jejuou." },
            ].map(({ name, location, stars, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <Card className="border-stone-800 bg-stone-950/60 h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(stars)].map((_, j) => <Star key={j} className="h-4 w-4 text-amber-500 fill-amber-500" />)}
                    </div>
                    <p className="text-stone-300 text-sm leading-relaxed mb-4">"{text}"</p>
                    <div>
                      <p className="text-stone-100 font-semibold text-sm">{name}</p>
                      <p className="text-stone-500 text-xs">{location}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROVA SOCIAL: TRANSFORMAÇÃO PESSOAL ── */}
      <TransformationSection />

      {/* ── CHECKOUT / PREÇO ── */}
      <section id="checkout" className="py-20 px-4 bg-gradient-to-b from-stone-950 via-amber-950/10 to-stone-950">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Urgência */}
            <div className="flex items-center justify-center gap-2 text-red-400 text-sm font-medium mb-6">
              <Clock className="h-4 w-4" />
              Oferta expira em {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
            </div>

            <Card className="border-amber-500/30 bg-stone-900/70 backdrop-blur shadow-2xl shadow-amber-500/5">
              <CardHeader className="text-center border-b border-stone-800 pb-8">
                <Badge className="mx-auto mb-4 bg-green-500/10 text-green-400 border-green-500/20">
                  Acesso Imediato ao Download
                </Badge>
                <CardTitle className="text-3xl md:text-4xl font-serif text-stone-100 mb-2">
                  Guia Definitivo do Jejum Intermitente
                </CardTitle>
                <CardDescription className="text-stone-400">
                  Ebook + Protocolos + Guia de Alimentação + Bônus Cetogênico
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center py-10 px-6">
                {/* Preço */}
                <div className="mb-8">
                  <div className="text-stone-500 text-base line-through mb-1">
                    De R$ {OLD_PRICE}
                  </div>
                  <div className="text-amber-500 text-sm font-semibold mb-2">
                    🔥 Promoção de lançamento — economize 70%
                  </div>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-stone-400 text-xl">R$</span>
                    <span className="text-7xl md:text-8xl font-bold text-stone-100">{PRICE.split(",")[0]}</span>
                    <span className="text-3xl font-bold text-stone-100">,{PRICE.split(",")[1]}</span>
                  </div>
                  <div className="text-stone-500 text-sm mt-2">Pagamento único • Sem mensalidade</div>
                </div>

                {/* CTA principal */}
                <Button
                  onClick={openCheckout}
                  size="lg"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-7 text-xl rounded-2xl group shadow-lg shadow-amber-500/30 mb-4"
                >
                  Quero Acessar Agora — R$ {PRICE}
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Ícones de segurança */}
                <div className="flex items-center justify-center gap-2 text-stone-500 text-xs mb-6">
                  <Lock className="h-3.5 w-3.5" />
                  Pix • Cartão de Crédito — Ambiente 100% seguro (Kiwify)
                </div>

                {/* Checklist */}
                <div className="space-y-3 text-left">
                  {[
                    "Download imediato após a confirmação",
                    "Acesso vitalício — sem prazo de expiração",
                    "Funciona em celular, tablet e computador",
                    "Garantia incondicional de 7 dias",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-green-400" />
                      </div>
                      <span className="text-stone-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Garantia */}
                <div className="mt-8 p-5 rounded-2xl border border-green-500/20 bg-green-500/5 flex gap-4 items-start text-left">
                  <Shield className="h-10 w-10 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-400 font-bold mb-1">Garantia Total de 7 Dias</p>
                    <p className="text-stone-400 text-sm leading-relaxed">
                      Se por qualquer motivo você não ficar satisfeito, basta enviar um e-mail e devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── GEO CONTENT BLOCK ── Visível para crawlers, sutil para usuários ── */}
      {/*
        Este bloco usa sr-only (screen reader / crawler) para entregar
        conteúdo semântico rico para Google, ChatGPT, Perplexity e outros
        sistemas de IA que geram respostas a partir de conteúdo de página.
        Os headings H2/H3 e o texto com entidades nomeadas criam sinais
        de autoridade topical (Topical Authority) e GEO (Generative Engine Optimization).
      */}
      <div className="sr-only" aria-hidden="false" data-speakable="true">
        <article>
          <h2>O que é Jejum Intermitente e Como Funciona</h2>
          <p>
            Jejum intermitente é uma prática alimentar que alterna períodos de alimentação
            com períodos de restrição calórica total ou parcial. Diferente de dietas
            convencionais, o jejum intermitente não define o que você come, mas quando você
            come. A prática é fundamentada em séculos de uso ancestral e, nas últimas décadas,
            ganhou respaldo científico significativo — culminando com o Prêmio Nobel de
            Fisiologia ou Medicina de 2016, concedido ao pesquisador japonês Yoshinori Ohsumi
            pela descoberta dos mecanismos da autofagia.
          </p>

          <h3>Principais protocolos de jejum intermitente</h3>
          <p>
            Os protocolos de jejum variam em duração e complexidade. O protocolo 12/12
            é indicado para iniciantes: 12 horas de jejum e 12 horas de alimentação.
            O protocolo 16/8 — o mais popular — consiste em 16 horas de jejum e uma janela
            alimentar de 8 horas, período em que ocorrem 2 a 3 refeições. O OMAD
            (One Meal A Day) representa um jejum de aproximadamente 23 horas com uma única
            refeição diária. Jejuns de 24 horas, 48 horas e 72 horas são protocolos avançados
            indicados para praticantes experientes que buscam ativar profundamente a autofagia
            e a regeneração do sistema imunológico.
          </p>

          <h3>O que é Autofagia e por que ela importa</h3>
          <p>
            Autofagia (do grego: auto = si mesmo, phagein = comer) é o processo pelo qual
            as células decompõem e reciclam seus próprios componentes danificados ou
            desnecessários. O mecanismo foi descrito cientificamente pelo biólogo japonês
            Yoshinori Ohsumi, cujas pesquisas nas leveduras Saccharomyces cerevisiae nas
            décadas de 1990 e 2000 mapearam os genes e proteínas responsáveis pelo processo.
            A autofagia começa a ser significativamente ativada após 24 a 36 horas de jejum
            contínuo. Os benefícios documentados incluem redução da inflamação sistêmica,
            eliminação de proteínas mal dobradas associadas a doenças neurodegenerativas,
            rejuvenescimento celular e melhora da resposta imunológica.
          </p>

          <h3>Fases metabólicas do jejum hora a hora</h3>
          <p>
            Entre 0 e 4 horas após a última refeição, o organismo está na fase pós-prandial:
            a insulina está elevada e o corpo utiliza glicose como fonte primária de energia.
            Entre 12 e 18 horas, os estoques de glicogênio hepático se esgotam, a insulina
            cai e o fígado começa a produzir cetonas a partir dos ácidos graxos — é o início
            da cetose. Entre 24 e 36 horas, a autofagia é intensificada. O hormônio do
            crescimento humano (HGH) pode aumentar até 5 vezes em relação aos níveis basais,
            favorecendo a preservação de massa muscular. Após 48 a 72 horas, ocorre a
            renovação de células-tronco hematopoiéticas, com regeneração parcial do sistema
            imunológico, conforme estudos da Universidade do Sul da Califórnia liderados pelo
            pesquisador Valter Longo.
          </p>

          <h3>Jejum Intermitente e Cetose</h3>
          <p>
            A cetose é um estado metabólico no qual o fígado produz corpos cetônicos
            (beta-hidroxibutirato, acetoacetato e acetona) a partir da oxidação de ácidos
            graxos. Durante o jejum, a ausência de carboidratos força essa conversão,
            fornecendo ao cérebro um combustível alternativo à glicose. Os corpos cetônicos
            têm efeito neuroprotetor documentado, melhoram a clareza mental e reduzem
            a inflamação cerebral. A combinação de jejum intermitente com dieta cetogênica
            acelera a entrada em cetose e potencializa os benefícios da autofagia.
          </p>

          <h3>Como quebrar o jejum corretamente</h3>
          <p>
            Quebrar o jejum de forma inadequada pode causar desconforto gastrointestinal
            e anular parte dos benefícios metabólicos obtidos. O caldo de ossos é
            considerado o alimento ideal para quebrar jejuns de 24 horas ou mais: é rico em
            glicina, prolina, hidroxiprolina e minerais, estimula suavemente a produção de
            ácido clorídrico e enzimas digestivas sem provocar pico insulínico significativo.
            Para jejuns de 16/8, a quebra pode ser feita com uma refeição balanceada contendo
            proteínas de qualidade, gorduras saudáveis e vegetais não amiláceos.
          </p>

          <h3>Jejum Intermitente é seguro?</h3>
          <p>
            Para adultos saudáveis, o jejum intermitente é seguro quando praticado com
            orientação adequada. Contraindicações absolutas incluem gravidez, amamentação,
            histórico de transtornos alimentares (anorexia, bulimia), diabetes tipo 1 com
            uso de insulina sem supervisão médica e desnutrição. Pessoas com hipotireoidismo,
            diabetes tipo 2 controlada e outras condições crônicas devem consultar um médico
            antes de iniciar qualquer protocolo de jejum. Os efeitos colaterais mais comuns
            nas primeiras semanas incluem dor de cabeça, tontura leve e irritabilidade —
            sinais de adaptação metabólica que geralmente desaparecem após 7 a 14 dias.
          </p>
        </article>
      </div>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 bg-stone-900">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <MessageSquare className="h-8 w-8 text-amber-500 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Perguntas Frequentes</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: "Preciso ter experiência com jejum para comprar?", a: "Não. O guia começa do absoluto zero, com o protocolo 12/12 (ideal para iniciantes) e evolui gradualmente. Você vai no seu ritmo." },
              { q: "Jejum é seguro? Vou passar mal?", a: "Para a maioria das pessoas saudáveis, sim. O guia ensina como fazer o jejum com segurança, os sinais de alerta para ficar atento e quem deve consultar um médico antes. Nunca é recomendado fazer às cegas." },
              { q: "Vou ficar com fome o tempo todo?", a: "Na primeira semana pode haver adaptação. O guia inclui estratégias específicas para controlar a fome, inclusive quais bebidas podem ser consumidas durante o jejum sem quebrá-lo." },
              { q: "Como recebo o ebook após a compra?", a: "Imediatamente. Após a confirmação do pagamento, você recebe o link de download por e-mail. O processo é automático e leva menos de 1 minuto." },
              { q: "Funciona para quem tem hipotireoidismo / diabetes / outros problemas?", a: "O guia orienta sobre condições específicas e quais protocolos são mais adequados. Para doenças crônicas, sempre recomendamos consultar o médico antes de iniciar qualquer protocolo de jejum." },
              { q: "Qual é a garantia?", a: "7 dias completos. Se você comprar, ler e não se sentir satisfeito, devolvemos 100% do valor sem nenhuma pergunta. Basta enviar um e-mail." },
            ].map(({ q, a }, i) => (
              <FAQItem key={i} question={q} answer={a} delay={i * 0.05} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 px-4 bg-stone-950">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              Seu corpo está esperando{" "}
              <span className="text-amber-500">a sua permissão</span> para se curar
            </h2>
            <p className="text-lg text-stone-400">
              Por menos de R$ 30 você tem acesso a um guia que pode mudar completamente sua relação com a comida, seu peso e sua saúde.
            </p>

            <div className="flex items-center justify-center gap-2 text-red-400 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Oferta especial expira em {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
            </div>

            <Button
              onClick={openCheckout}
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-12 py-8 text-xl rounded-full group shadow-xl shadow-amber-500/25"
            >
              Quero Começar Agora — R$ {PRICE}
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-stone-600 text-sm">
              Garantia de 7 dias • Acesso imediato • Pagamento seguro
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CHECKOUT MODAL ── */}
      <AnimatePresence>
        {showCheckout && (
          <>
            <motion.div
              key="checkout-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
              onClick={() => !checkoutLoading && setShowCheckout(false)}
            />

            <motion.div
              key="checkout-panel"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-md bg-stone-900 border border-stone-700/60 rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
                  <div>
                    <h3 className="text-lg font-bold text-stone-100">Finalizar Compra</h3>
                    <p className="text-xs text-stone-500">Pix ou Cartão de Crédito — processado pelo Kiwify</p>
                  </div>
                  <button
                    onClick={() => !checkoutLoading && setShowCheckout(false)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Resumo do produto */}
                <div className="px-6 py-4 bg-stone-800/30 border-b border-stone-800/50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-stone-200">Guia Definitivo do Jejum Intermitente</p>
                    <p className="text-xs text-stone-500">Ebook + Protocolos + Bônus Cetogênico</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-stone-500 line-through">R$ {OLD_PRICE}</p>
                    <p className="text-lg font-bold text-amber-500">R$ {PRICE}</p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleCheckout} className="px-6 py-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                      <User className="h-3 w-3" /> Seu nome
                    </label>
                    <input
                      type="text"
                      required
                      disabled={checkoutLoading}
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome completo"
                      className="w-full px-4 py-3 rounded-xl bg-stone-800/60 border border-stone-700/60 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                      <Mail className="h-3 w-3" /> E-mail (para receber o ebook)
                    </label>
                    <input
                      type="email"
                      required
                      disabled={checkoutLoading}
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-stone-800/60 border border-stone-700/60 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                      <MessageSquare className="h-3 w-3" /> WhatsApp{" "}
                      <span className="normal-case text-stone-600 font-normal">(opcional)</span>
                    </label>
                    <input
                      type="tel"
                      disabled={checkoutLoading}
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, phone: maskPhone(e.target.value) }))}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 rounded-xl bg-stone-800/60 border border-stone-700/60 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm disabled:opacity-50"
                    />
                  </div>

                  {checkoutError && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {checkoutError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={checkoutLoading}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-6 text-base rounded-xl group disabled:opacity-60"
                  >
                    {checkoutLoading ? (
                      <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Gerando pagamento...</>
                    ) : (
                      <>
                        Pagar R$ {PRICE}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Seguro</span>
                    <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> 7 dias de garantia</span>
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Acesso imediato</span>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── COMPONENTS ──────────────────────────────────────────────────────────────

interface TimelineStepProps {
  timeRange: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  color: "red" | "amber" | "green" | "emerald"
  highlight?: boolean
  delay: number
}

function TimelineStep({ timeRange, title, subtitle, description, icon, color, highlight, delay }: TimelineStepProps) {
  const styles = {
    red: { border: "border-red-500/30", bg: "bg-red-500/10", text: "text-red-500", icon: "bg-red-500/20 text-red-500" },
    amber: { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-500", icon: "bg-amber-500/20 text-amber-500" },
    green: { border: "border-green-500/30", bg: "bg-green-500/10", text: "text-green-500", icon: "bg-green-500/20 text-green-500" },
    emerald: { border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-500", icon: "bg-emerald-500/20 text-emerald-500" },
  }[color]

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <div className={`grid md:grid-cols-[200px_1fr] gap-6 md:gap-8 p-6 md:p-8 rounded-2xl border-2 ${styles.border} ${styles.bg} ${highlight ? "ring-2 ring-amber-500/50" : ""}`}>
        <div className="flex md:flex-col items-center md:items-start gap-4">
          <div className={`p-4 rounded-xl ${styles.icon}`}>{icon}</div>
          <div>
            <div className={`text-3xl md:text-4xl font-bold ${styles.text} mb-1`}>{timeRange}</div>
            {highlight && <Badge className="bg-amber-500 text-stone-950 border-none">Nobel 2016</Badge>}
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-100">{title}</h3>
          <p className={`text-lg font-semibold ${styles.text}`}>{subtitle}</p>
          <p className="text-stone-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

interface BundleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  delay: number
  highlight?: boolean
}

function BundleCard({ title, description, icon, features, delay, highlight }: BundleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <Card className={`border-amber-500/20 bg-stone-900/50 hover:bg-stone-900/70 transition-colors h-full ${highlight ? "ring-2 ring-amber-500/50" : ""}`}>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">{icon}</div>
            {highlight && <Badge className="bg-amber-500 text-stone-950 border-none">Bônus</Badge>}
          </div>
          <CardTitle className="text-2xl mb-3 text-stone-100">{title}</CardTitle>
          <CardDescription className="text-stone-400">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-stone-300">{f}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface FAQItemProps {
  question: string
  answer: string
  delay: number
}

function FAQItem({ question, answer, delay }: FAQItemProps) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="border border-stone-800 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-stone-800/40 transition-colors"
      >
        <span className="text-stone-100 font-medium">{question}</span>
        <ChevronDown className={`h-5 w-5 text-amber-500 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-stone-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </motion.div>
  )
}
