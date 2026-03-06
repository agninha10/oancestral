"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  Instagram,
  Flame,
  BookOpen,
  Beef,
  GraduationCap,
  Home,
  Info,
  Mail,
  ChevronRight,
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserNav } from "@/components/layout/user-nav"

const INSTAGRAM_URL = "https://www.instagram.com/oancestral.com.br/"

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/receitas", label: "Receitas", icon: Beef },
  { href: "/cursos", label: "Cursos", icon: GraduationCap },
  { href: "/jejum", label: "Jejum", icon: Flame },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/sobre", label: "Sobre", icon: Info },
  { href: "/contato", label: "Contato", icon: Mail },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-border/50 bg-background/95 backdrop-blur-md shadow-sm"
            : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* ── LOGO ── */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif text-xl font-bold text-primary tracking-tight">
                O Ancestral
              </span>
            </Link>

            {/* ── DESKTOP NAV (centro absoluto) ── */}
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5">
              {navItems.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? "text-primary"
                        : "text-foreground/65 hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-primary/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* ── DESKTOP ACTIONS ── */}
            <div className="hidden md:flex items-center gap-1.5 ml-auto flex-shrink-0">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram O Ancestral"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-foreground/50 hover:text-pink-500 hover:bg-pink-500/10 transition-all"
              >
                <Instagram className="h-[17px] w-[17px]" />
              </a>
              <ThemeToggle />
              <UserNav showDashboardButton />
            </div>

            {/* ── MOBILE ACTIONS ── */}
            <div className="flex md:hidden items-center gap-1">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menu"
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-accent/60 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[300px] flex flex-col bg-stone-950 border-l border-stone-800/70 shadow-2xl"
            >
              {/* Header do painel */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800/60">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <span className="font-serif text-xl font-bold text-amber-500">
                    O Ancestral
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fechar menu"
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Itens de navegação */}
              <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
                {navItems.map((item, i) => {
                  const active = pathname === item.href
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 + 0.06 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                          active
                            ? "bg-amber-500/12 text-amber-400"
                            : "text-stone-400 hover:bg-stone-800/50 hover:text-stone-100"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            active
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-stone-800/80 text-stone-500 group-hover:bg-amber-500/10 group-hover:text-amber-500/80"
                          }`}
                        >
                          <item.icon className="h-[15px] w-[15px]" />
                        </div>
                        <span className="font-medium text-[14.5px] flex-1 leading-none">
                          {item.label}
                        </span>
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-all ${
                            active
                              ? "text-amber-500/80 opacity-100"
                              : "opacity-0 -translate-x-1 group-hover:opacity-30 group-hover:translate-x-0"
                          }`}
                        />
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Instagram */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="px-4 py-3"
              >
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-pink-500/20 bg-gradient-to-r from-pink-500/8 via-fuchsia-500/8 to-purple-500/8 hover:border-pink-500/35 hover:from-pink-500/12 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/20">
                    <Instagram className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-stone-200 leading-none mb-0.5">
                      Siga no Instagram
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">
                      @oancestral.com.br
                    </p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-pink-400/50 flex-shrink-0" />
                </a>
              </motion.div>

              {/* UserNav */}
              <div className="px-4 pb-5 pt-3 border-t border-stone-800/60">
                <UserNav isMobile />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
