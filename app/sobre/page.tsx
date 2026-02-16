"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Flame, Beef, Mountain, Dumbbell } from "lucide-react";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1.2 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 font-serif leading-tight"
              style={{ fontFamily: "var(--font-crimson)" }}
              {...fadeInUp}
            >
              Não é sobre voltar ao passado.
              <br />É sobre sobreviver ao futuro.
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              O Ancestral é o resgate da sua biologia original em um mundo
              artificial.
            </motion.p>
          </div>
        </section>

        {/* O Diagnóstico - Texto Esquerda, Imagem Direita */}
        <section className="py-24 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <h2
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 font-serif"
                  style={{ fontFamily: "var(--font-crimson)" }}
                >
                  O Diagnóstico
                </h2>
                <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed space-y-6">
                  <p>
                    Olhe ao seu redor. Estamos mais confortáveis do que nunca,
                    mas também mais doentes, mais fracos e mais ansiosos.
                    Trocamos o sol pela luz azul. Trocamos a carne pelo óleo
                    vegetal. Trocamos o movimento pelo sedentarismo.
                  </p>
                  <p>
                    Esquecemos que somos animais biológicos, moldados por
                    milhões de anos de evolução. O mundo moderno declarou guerra
                    à nossa biologia, e nós estamos aqui para declarar a paz.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative h-[400px] lg:h-[600px] rounded-lg overflow-hidden bg-muted"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-stone-900/40">
                  <Mountain className="w-24 h-24 text-muted-foreground/30" />
                </div>
                {/* Placeholder para imagem de natureza/montanhas */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* A Nossa Filosofia - Texto Direita, Imagem Esquerda */}
        <section className="py-24 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                className="relative h-[400px] lg:h-[600px] rounded-lg overflow-hidden bg-muted order-2 lg:order-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-900/30 to-red-900/30">
                  <Flame className="w-24 h-24 text-muted-foreground/30" />
                </div>
                {/* Placeholder para imagem de fogo/fogueira */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>

              <motion.div
                className="order-1 lg:order-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <h2
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 font-serif"
                  style={{ fontFamily: "var(--font-crimson)" }}
                >
                  A Nossa Filosofia
                </h2>
                <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed space-y-6">
                  <p>
                    Nossa missão é simples, mas revolucionária: resgatar a
                    sabedoria que manteve nossos ancestrais fortes por milênios.
                  </p>
                  <p>
                    Não inventamos nada. Apenas redescobrimos o que foi
                    esquecido. Acreditamos na nutrição densa que constrói dentes
                    fortes e mentes afiadas. Acreditamos no jejum que limpa. No
                    treino que forja. Na mente que governa as emoções.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Os 4 Pilares - Grid */}
        <section className="py-32 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-20 text-center font-serif"
              style={{ fontFamily: "var(--font-crimson)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Os 4 Pilares do Clã
            </motion.h2>

            <motion.div
              className="grid md:grid-cols-2 gap-16 lg:gap-20"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {/* Pilar 1 */}
              <motion.div
                className="text-center space-y-6"
                variants={fadeInUp}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Beef className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-bold font-serif"
                  style={{ fontFamily: "var(--font-crimson)" }}
                >
                  Nutrição Real
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Comida que seus avós reconheceriam. Gordura animal, proteínas
                  nobres, zero processados. O combustível que seu DNA espera
                  receber.
                </p>
              </motion.div>

              {/* Pilar 2 */}
              <motion.div
                className="text-center space-y-6"
                variants={fadeInUp}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-bold font-serif"
                  style={{ fontFamily: "var(--font-crimson)" }}
                >
                  Corpo Antifrágil
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Nascemos para o movimento. Treinos que constroem força
                  funcional, mobilidade e resistência para a vida real, não
                  apenas estética.
                </p>
              </motion.div>

              {/* Pilar 3 */}
              <motion.div
                className="text-center space-y-6"
                variants={fadeInUp}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                  </div>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-bold font-serif"
                  style={{ fontFamily: "var(--font-crimson)" }}
                >
                  Mente Estoica
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Domínio emocional e clareza mental. Usamos a sabedoria antiga
                  para enfrentar o caos moderno com serenidade e propósito.
                </p>
              </motion.div>

              {/* Pilar 4 */}
              <motion.div
                className="text-center space-y-6"
                variants={fadeInUp}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>
                  </div>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-bold font-serif"
                  style={{ fontFamily: "var(--font-crimson)" }}
                >
                  Legado & Família
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Saúde não é um fim em si mesma. É o meio para proteger quem
                  amamos e construir algo que dure mais que nós.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-32 px-4 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6"
                style={{ fontFamily: "var(--font-crimson)" }}
              >
                A porta está aberta.
                <br />
                Mas a caminhada é sua.
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12">
                Junte-se à Alcateia
              </p>
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="text-lg px-12 py-6 h-auto font-semibold rounded-full hover:scale-105 transition-transform"
                >
                  Começar Minha Jornada
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
