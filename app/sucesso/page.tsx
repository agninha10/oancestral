"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-stone-800 bg-stone-900 text-center">
            <CardHeader className="space-y-6 pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </motion.div>
              <div>
                <CardTitle className="mb-2 text-3xl text-stone-50">
                  Bem-vindo ao Clã Ancestral!
                </CardTitle>
                <CardDescription className="text-base text-stone-400">
                  Seu pagamento está sendo processado
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
                <h3 className="mb-3 text-lg font-semibold text-amber-500">O que acontece agora?</h3>
                <ul className="space-y-3 text-left text-sm text-stone-300">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-500">
                      1
                    </span>
                    <span>
                      <strong className="text-stone-200">Pagamento via PIX:</strong> Você será liberado em
                      até 5 minutos após a confirmação.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-500">
                      2
                    </span>
                    <span>
                      <strong className="text-stone-200">Pagamento via Cartão:</strong> A aprovação é
                      instantânea na maioria dos casos.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-500">
                      3
                    </span>
                    <span>
                      Assim que confirmarmos o pagamento, você receberá um <strong className="text-stone-200">e-mail</strong> com
                      instruções de acesso.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-500">
                      4
                    </span>
                    <span>
                      Todo o conteúdo Premium estará disponível no seu <strong className="text-stone-200">Dashboard</strong>.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-600 hover:to-amber-700"
                >
                  <Link href="/dashboard">
                    Ir para o Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-stone-700 text-stone-300 hover:bg-stone-800"
                >
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Voltar ao Início
                  </Link>
                </Button>
              </div>

              <div className="border-t border-stone-800 pt-6 text-center text-sm text-stone-500">
                <p>
                  Precisa de ajuda?{" "}
                  <Link href="/contato" className="text-amber-500 hover:text-amber-400">
                    Entre em contato
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
