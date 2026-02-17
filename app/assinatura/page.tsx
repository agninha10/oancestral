"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Shield, Zap, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckoutFormDialog } from "@/components/checkout/checkout-form-dialog";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AssinaturaPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<"monthly" | "yearly">("yearly");
  const [userData, setUserData] = useState({ name: "", email: "", cellphone: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

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
            cellphone: user.whatsapp || "",
          };
          console.log("[ASSINATURA] Loaded user data:", newUserData);
          setUserData(newUserData);
          setIsLoggedIn(true);
        } else {
          // Usuário não logado - valores vazios
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

  const handleCheckoutSubmit = async (formData: {
    name: string;
    email: string;
    cellphone: string;
    taxId: string;
    password?: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frequency: selectedFrequency,
          name: formData.name,
          email: formData.email,
          cellphone: formData.cellphone,
          taxId: formData.taxId,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao criar checkout");
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert("Erro ao processar pagamento. Tente novamente.");
      setLoading(false);
      setShowCheckoutForm(false);
    }
  };

  const benefits = [
    { icon: Check, text: "Acesso a todas as receitas Premium" },
    { icon: Crown, text: "Cursos e Masterclasses (Jejum, Treino)" },
    { icon: Shield, text: "Comunidade Exclusiva" },
    { icon: Sparkles, text: "Novos conteúdos toda semana" },
    { icon: Zap, text: "Suporte prioritário" },
  ];

  const faqs = [
    {
      question: "Tem fidelidade?",
      answer: "Não! No plano mensal você cancela quando quiser. No anual, você garante o melhor preço por 12 meses.",
    },
    {
      question: "Consigo cancelar fácil?",
      answer: "Sim! Você pode cancelar sua assinatura a qualquer momento através do painel de controle.",
    },
    {
      question: "Serve para iniciantes?",
      answer: "Com certeza! Nosso conteúdo é organizado do básico ao avançado, perfeito para quem está começando.",
    },
    {
      question: "Quais formas de pagamento?",
      answer: "Aceitamos PIX e Cartão de Crédito. Ambos são processados de forma 100% segura.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-stone-950 text-stone-200">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-stone-800 py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 to-transparent" />
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge className="mb-4 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
              Investimento na sua biologia
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-stone-50 md:text-6xl">
              Invista na sua <span className="text-amber-500">Biologia</span>
            </h1>
            <p className="mb-8 text-lg text-stone-400 md:text-xl">
              Acesse protocolos de treino, nutrição ancestral e a comunidade que vai mudar seu jogo.
            </p>

            {/* Toggle Mensal/Anual */}
            <div className="mb-12 flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!isAnnual ? "text-stone-200" : "text-stone-500"}`}>
                Mensal
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative h-8 w-14 rounded-full transition-colors ${
                  isAnnual ? "bg-amber-500" : "bg-stone-700"
                }`}
              >
                <motion.div
                  className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md"
                  animate={{ left: isAnnual ? "calc(100% - 28px)" : "4px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? "text-stone-200" : "text-stone-500"}`}>
                Anual
                <Badge className="ml-2 bg-green-500/10 text-green-500">Economize 45%</Badge>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* Card Mensal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card
                className={`relative h-full border-stone-800 bg-stone-900 transition-all ${
                  !isAnnual ? "scale-105 border-amber-500/50 shadow-xl shadow-amber-500/10" : ""
                }`}
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <CardTitle className="text-2xl text-stone-50">Plano Mensal</CardTitle>
                    {!isAnnual && (
                      <Badge className="bg-amber-500 text-stone-950 hover:bg-amber-600">Popular</Badge>
                    )}
                  </div>
                  <CardDescription className="text-stone-400">Flexibilidade total</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-b border-stone-800 pb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-stone-50">R$ 29</span>
                      <span className="text-stone-500">/mês</span>
                    </div>
                    <p className="mt-2 text-sm text-stone-500">Cancele quando quiser</p>
                  </div>

                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => {
                      const Icon = benefit.icon;
                      return (
                        <li key={index} className="flex items-start gap-3">
                          <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                          <span className="text-sm text-stone-300">{benefit.text}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <Button
                    onClick={() => handleCheckoutClick("monthly")}
                    disabled={loading}
                    className="w-full bg-stone-700 hover:bg-stone-600"
                  >
                    {loading ? "Processando..." : "Entrar para o Clã"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card Anual (Destaque) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                className={`relative h-full border-2 bg-stone-900 transition-all ${
                  isAnnual
                    ? "scale-105 border-amber-500 shadow-2xl shadow-amber-500/20"
                    : "border-stone-800"
                }`}
              >
                {isAnnual && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1 text-stone-950 shadow-lg">
                      Melhor Valor
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <CardTitle className="text-2xl text-amber-500">Plano Anual</CardTitle>
                    <Badge className="bg-green-500/10 text-green-500">-45%</Badge>
                  </div>
                  <CardDescription className="text-stone-400">Compromisso máximo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-b border-stone-800 pb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-amber-500">R$ 190</span>
                      <span className="text-stone-500">/ano</span>
                    </div>
                    <p className="mt-2 text-sm text-amber-500/80">
                      Equivale a R$ 15,83/mês (economize R$ 158/ano)
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => {
                      const Icon = benefit.icon;
                      return (
                        <li key={index} className="flex items-start gap-3">
                          <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                          <span className="text-sm text-stone-300">{benefit.text}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <Button
                    onClick={() => handleCheckoutClick("yearly")}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-600 hover:to-amber-700"
                  >
                    {loading ? "Processando..." : "Entrar para o Clã"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-stone-800 bg-stone-950/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            <h2 className="mb-12 text-center text-3xl font-bold text-stone-50">Perguntas Frequentes</h2>
            <div className="grid gap-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="border-stone-800 bg-stone-900">
                    <CardHeader>
                      <CardTitle className="text-lg text-stone-50">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-400">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="border-t border-stone-800 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-stone-50">Pronto para evoluir?</h2>
            <p className="mb-8 text-stone-400">
              Junte-se a centenas de pessoas transformando suas vidas através da nutrição ancestral.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                onClick={() => handleCheckoutClick(isAnnual ? "yearly" : "monthly")}
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-600 hover:to-amber-700"
              >
                {loading ? "Processando..." : "Começar Agora"}
              </Button>
              <Button asChild variant="outline" size="lg" className="border-stone-700 text-stone-300">
                <Link href="/sobre">Saber Mais</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      </main>

      <Footer />

      {/* Checkout Form Dialog */}
      <CheckoutFormDialog
        open={showCheckoutForm}
        onOpenChange={setShowCheckoutForm}
        defaultValues={userData}
        frequency={selectedFrequency}
        onSubmit={handleCheckoutSubmit}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
