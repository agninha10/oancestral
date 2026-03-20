"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Instagram,
  Send,
  CheckCircle2,
  User,
  MessageSquare,
  Tag,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"

const INSTAGRAM_URL = "https://www.instagram.com/souancestral/"

const subjects = [
  "Dúvida sobre jejum intermitente",
  "Suporte ao ebook",
  "Parceria / Colaboração",
  "Imprensa",
  "Outro assunto",
]

export default function ContatoPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erro ao enviar")
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao enviar mensagem. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Header />

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/15 via-stone-950 to-stone-950" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
              <Mail className="h-6 w-6 text-amber-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              Fale com a <span className="text-amber-500">Gente</span>
            </h1>
            <p className="text-lg text-stone-400 max-w-xl mx-auto">
              Tem uma dúvida, sugestão ou quer falar sobre o ebook? Responderemos o mais rápido possível.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_380px] gap-8 items-start">

          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-stone-900/50 border border-stone-800/60 rounded-2xl p-6 md:p-8">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-100">Mensagem enviada!</h2>
                    <p className="text-stone-400 max-w-sm">
                      Recebemos sua mensagem e responderemos em breve pelo e-mail informado.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 border-stone-700 text-stone-300 hover:bg-stone-800"
                      onClick={() => { setSuccess(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                    >
                      Enviar outra mensagem
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Nome */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                          <User className="h-3.5 w-3.5" /> Nome
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={set("name")}
                          placeholder="Seu nome"
                          className="w-full px-4 py-3 rounded-xl bg-stone-800/60 border border-stone-700/60 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                          <Mail className="h-3.5 w-3.5" /> E-mail
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={set("email")}
                          placeholder="seu@email.com"
                          className="w-full px-4 py-3 rounded-xl bg-stone-800/60 border border-stone-700/60 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                        />
                      </div>
                    </div>

                    {/* Assunto */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                        <Tag className="h-3.5 w-3.5" /> Assunto
                      </label>
                      <select
                        value={form.subject}
                        onChange={set("subject")}
                        className="w-full px-4 py-3 rounded-xl bg-stone-800/60 border border-stone-700/60 text-stone-100 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm appearance-none"
                      >
                        <option value="">Selecione um assunto...</option>
                        {subjects.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Mensagem */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                        <MessageSquare className="h-3.5 w-3.5" /> Mensagem
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={form.message}
                        onChange={set("message")}
                        placeholder="Escreva sua mensagem aqui..."
                        className="w-full px-4 py-3 rounded-xl bg-stone-800/60 border border-stone-700/60 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-6 text-base rounded-xl group"
                    >
                      {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Enviando...</>
                      ) : (
                        <><Send className="h-4 w-4 mr-2" /> Enviar Mensagem <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Sidebar direita */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Instagram */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/8 via-fuchsia-500/6 to-purple-500/8 hover:border-pink-500/40 hover:from-pink-500/12 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
                <Instagram className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-stone-100 mb-0.5">Instagram</p>
                <p className="text-sm text-stone-400 truncate">@oancestral.com.br</p>
                <p className="text-xs text-stone-500 mt-1">Conteúdo diário sobre jejum e ancestralidade</p>
              </div>
              <ArrowRight className="h-4 w-4 text-pink-400/60 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Tempo de resposta */}
            <div className="p-5 rounded-2xl border border-stone-800/60 bg-stone-900/40">
              <h3 className="font-semibold text-stone-200 mb-3">Tempo de resposta</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Suporte ao ebook</span>
                  <span className="text-green-400 font-medium">Até 24h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Parcerias</span>
                  <span className="text-amber-400 font-medium">2–3 dias</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Imprensa</span>
                  <span className="text-amber-400 font-medium">2–3 dias</span>
                </div>
              </div>
            </div>

            {/* FAQ rápido */}
            <div className="p-5 rounded-2xl border border-amber-500/15 bg-amber-500/5">
              <h3 className="font-semibold text-amber-400 mb-2 text-sm">Já tem o ebook?</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Para suporte com o download ou acesso, informe seu e-mail de compra na mensagem acima.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
