"use client"

import { motion } from "framer-motion"
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
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"

export default function JejumContent() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-stone-950 to-stone-950" />
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: "radial-gradient(circle at center, rgba(245, 158, 11, 0.1) 0%, transparent 50%)",
            backgroundSize: "100px 100px"
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-amber-500/10 text-amber-500 border-amber-500/20 px-4 py-2 text-sm">
              Baseado no Prêmio Nobel de Medicina 2016
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight">
              Liberte-se da Escravidão{" "}
              <span className="text-amber-500">Alimentar</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-stone-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Descubra a tecnologia biológica que a indústria escondeu de você. 
              O guia definitivo para ativar a autofagia, queimar gordura e recuperar sua energia original.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-8 py-6 text-lg rounded-full group"
            >
              Quero Dominar o Jejum
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-stone-500 text-sm">
              Ou acesse grátis sendo membro do <span className="text-amber-500 font-semibold">Clã Ancestral</span>
            </p>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 pt-12 text-stone-600 text-sm"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Baseado em Ciência</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>Prêmio Nobel</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Resultados Comprovados</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
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

      {/* The Problem Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-stone-950 to-stone-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              O Mito Moderno que Nos Adoeceu
            </h2>
            <p className="text-lg md:text-xl text-stone-400 leading-relaxed">
              <span className="text-red-500 font-semibold">Comer de 3 em 3 horas é antinatural.</span>{" "}
              Essa mentira industrial nos deixou inflamados, inchados e dependentes de comida. 
              Nossos ancestrais jejuavam naturalmente — e prosperavam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline: A Jornada das 72 Horas */}
      <section className="py-20 px-4 bg-stone-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              A Jornada das <span className="text-amber-500">72 Horas</span>
            </h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              Descubra o que acontece em cada fase do jejum e como seu corpo se transforma
            </p>
          </motion.div>

          <div className="space-y-8 md:space-y-12">
            <TimelineStep
              timeRange="0-4h"
              title="Fase Digestiva"
              subtitle="Pico de Insulina"
              description="Seu corpo está processando a última refeição. A insulina está alta, bloqueando a queima de gordura. É o estado metabólico padrão após comer."
              icon={<ChefHat className="h-8 w-8" />}
              color="red"
              delay={0.1}
            />

            <TimelineStep
              timeRange="12-24h"
              title="A Mágica Começa"
              subtitle="Queima de Gordura + Cetose Leve"
              description="A insulina caiu. Seu corpo agora acessa os estoques de gordura como energia. Você entra em cetose leve, produzindo cetonas — o combustível premium do cérebro."
              icon={<Flame className="h-8 w-8" />}
              color="amber"
              delay={0.2}
            />

            <TimelineStep
              timeRange="24-36h"
              title="Autofagia Ativada"
              subtitle="O Nobel da Medicina — Limpeza Celular"
              description="Yoshinori Ohsumi ganhou o Nobel descobrindo este processo: suas células começam a reciclar componentes danificados. É a faxina interna que rejuvenesce seu corpo."
              icon={<Sparkles className="h-8 w-8" />}
              color="green"
              highlight
              delay={0.3}
            />

            <TimelineStep
              timeRange="48h+"
              title="Regeneração Máxima"
              subtitle="Sistema Imune Renovado + Clareza Mental"
              description="Seu sistema imunológico se regenera. Células-tronco são ativadas. Clareza mental extrema. HGH (hormônio do crescimento) pode aumentar até 5x. Você está em modo de superação."
              icon={<Zap className="h-8 w-8" />}
              color="emerald"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* The Promise Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-stone-900 to-stone-950">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              A Promessa Ancestral
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-amber-500">
              Desinchar • Desinflamar • Desintoxicar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <PromiseCard
              title="Desinchar"
              description="Elimine o inchaço causado pela inflamação constante. Veja os resultados no espelho em poucos dias."
              icon={<Sparkles className="h-6 w-6" />}
              delay={0.1}
            />
            <PromiseCard
              title="Desinflamar"
              description="Reduza marcadores inflamatórios. Menos dores, mais energia, melhor humor."
              icon={<Flame className="h-6 w-6" />}
              delay={0.2}
            />
            <PromiseCard
              title="Desintoxicar"
              description="Ative a autofagia e deixe seu corpo fazer a limpeza profunda que ele foi projetado para fazer."
              icon={<Zap className="h-6 w-6" />}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Bundle Section */}
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
              Tudo o que você precisa em um lugar
            </Badge>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              O Que Você Vai Receber
            </h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              O Protocolo Jejum Ancestral completo: conhecimento + prática + suporte
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <BundleCard
              title="O E-book Definitivo"
              description="História, ciência e prática do jejum. Desde os fundamentos até estratégias avançadas. Entenda a biologia por trás da transformação."
              icon={<BookOpen className="h-8 w-8" />}
              features={[
                "História ancestral do jejum",
                "A ciência da autofagia (Nobel 2016)",
                "Como o jejum reprograma seu metabolismo",
                "Mitos e verdades sobre jejum"
              ]}
              delay={0.1}
            />

            <BundleCard
              title="Protocolos Passo a Passo"
              description="Do iniciante absoluto ao praticante avançado. Protocolos testados e validados que você pode começar hoje."
              icon={<ListChecks className="h-8 w-8" />}
              features={[
                "Protocolo Iniciante: 12/12 (prepare seu corpo)",
                "Protocolo Intermediário: 16/8 (queima de gordura)",
                "Protocolo Avançado: 24-48h (autofagia profunda)",
                "Protocolo Extremo: 72h+ (regeneração máxima)"
              ]}
              delay={0.2}
            />

            <BundleCard
              title="Guia de Alimentação"
              description="O que comer antes do jejum e como quebrá-lo perfeitamente. Receitas ancestrais que potencializam os resultados."
              icon={<ChefHat className="h-8 w-8" />}
              features={[
                "A refeição pré-jejum ideal",
                "Quebra de jejum perfeita com Caldo de Ossos",
                "Receitas cetogênicas compatíveis",
                "Lista de alimentos permitidos e proibidos"
              ]}
              delay={0.3}
            />

            <BundleCard
              title="Bônus: Cetogênica + Jejum"
              description="A combinação mais poderosa para resultados rápidos. Aprenda a sincronizar dieta e jejum para potencializar a autofagia."
              icon={<Gift className="h-8 w-8" />}
              features={[
                "Como entrar em cetose rapidamente",
                "Macros ideais para jejum prolongado",
                "Suplementação estratégica",
                "Cardápios cetogênicos prontos"
              ]}
              delay={0.4}
              highlight
            />
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-stone-950 via-amber-950/10 to-stone-950">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-amber-500/20 bg-stone-900/50 backdrop-blur">
              <CardHeader className="text-center border-b border-stone-800 pb-8">
                <CardTitle className="text-4xl md:text-5xl font-serif mb-4 text-stone-100">
                  Protocolo Jejum Ancestral
                </CardTitle>
                <CardDescription className="text-lg text-stone-400">
                  E-book + Protocolos + Cardápios + Bônus Cetogênico
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center py-12">
                <div className="mb-8">
                  <div className="text-stone-500 text-lg mb-2 line-through">
                    De R$ 297,00
                  </div>
                  <div className="text-6xl md:text-7xl font-bold text-amber-500 mb-2">
                    R$ 97<span className="text-3xl">,90</span>
                  </div>
                  <div className="text-stone-400">
                    ou 12x de R$ 9,74
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <Button 
                    size="lg"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-6 text-xl rounded-full group"
                  >
                    Garantir Acesso Agora
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-stone-500 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Acesso imediato após a compra</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-stone-500 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Garantia de 7 dias</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-stone-500 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Pagamento 100% seguro</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-stone-800">
                  <p className="text-stone-400 mb-4">
                    Já é membro do Clã Ancestral?
                  </p>
                  <Button variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                    Acesse Gratuitamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-wrap justify-center gap-8 text-stone-600 text-sm"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Pagamento Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Dados Protegidos</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Satisfação Garantida</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-stone-950">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              Pronto para se libertar da{" "}
              <span className="text-amber-500">escravidão alimentar</span>?
            </h2>
            <p className="text-lg text-stone-400 mb-8">
              Junte-se a milhares de pessoas que já descobriram o poder do jejum ancestral
            </p>
            <Button 
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-8 py-6 text-lg rounded-full group"
            >
              Comece Sua Jornada Agora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Timeline Step Component
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

function TimelineStep({ 
  timeRange, 
  title, 
  subtitle, 
  description, 
  icon, 
  color, 
  highlight,
  delay 
}: TimelineStepProps) {
  const colorClasses = {
    red: {
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      text: "text-red-500",
      icon: "bg-red-500/20 text-red-500"
    },
    amber: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      icon: "bg-amber-500/20 text-amber-500"
    },
    green: {
      border: "border-green-500/30",
      bg: "bg-green-500/10",
      text: "text-green-500",
      icon: "bg-green-500/20 text-green-500"
    },
    emerald: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      icon: "bg-emerald-500/20 text-emerald-500"
    }
  }

  const styles = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className={`grid md:grid-cols-[200px_1fr] gap-6 md:gap-8 p-6 md:p-8 rounded-2xl border-2 ${styles.border} ${styles.bg} ${highlight ? 'ring-2 ring-amber-500/50' : ''}`}>
        <div className="flex md:flex-col items-center md:items-start gap-4">
          <div className={`p-4 rounded-xl ${styles.icon}`}>
            {icon}
          </div>
          <div>
            <div className={`text-3xl md:text-4xl font-bold ${styles.text} mb-1`}>
              {timeRange}
            </div>
            {highlight && (
              <Badge className="bg-amber-500 text-stone-950 border-none">
                Nobel 2016
              </Badge>
            )}
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

// Promise Card Component
interface PromiseCardProps {
  title: string
  description: string
  icon: React.ReactNode
  delay: number
}

function PromiseCard({ title, description, icon, delay }: PromiseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <Card className="border-amber-500/20 bg-stone-900/50 hover:bg-stone-900/70 transition-colors h-full">
        <CardHeader>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 w-fit mb-4">
            {icon}
          </div>
          <CardTitle className="text-2xl text-stone-100">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-stone-400">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Bundle Card Component
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
      <Card className={`border-amber-500/20 bg-stone-900/50 hover:bg-stone-900/70 transition-colors h-full ${highlight ? 'ring-2 ring-amber-500/50' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              {icon}
            </div>
            {highlight && (
              <Badge className="bg-amber-500 text-stone-950 border-none">
                Bônus
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl mb-3 text-stone-100">{title}</CardTitle>
          <CardDescription className="text-stone-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-stone-300">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}
