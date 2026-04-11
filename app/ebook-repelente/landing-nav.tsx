'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Playfair_Display } from 'next/font/google'
import { Menu, X, Leaf, Home, BookOpen, ShoppingBag, ChevronRight } from 'lucide-react'

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['700'],
    variable: '--font-playfair-nav',
    display: 'swap',
})

const CHECKOUT_URL = 'https://pay.kiwify.com.br/6ZxOdTr'

const NAV_LINKS = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/receitas', label: 'Receitas', icon: ShoppingBag },
]

export function LandingNav() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    return (
        <>
            <nav
                className={`${playfair.variable} fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/70 shadow-lg shadow-black/40'
                        : 'bg-transparent'
                }`}
                aria-label="Menu principal"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16 sm:h-18">
                    <Link
                        href="/"
                        className="font-[family-name:var(--font-playfair-nav)] text-xl sm:text-2xl font-bold text-white hover:text-amber-400 transition-colors flex-shrink-0"
                    >
                        O <span className="text-amber-500">Ancestral</span>
                    </Link>

                    <ul className="hidden md:flex items-center gap-1" role="list">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 text-sm font-medium transition-all"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href={CHECKOUT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 text-sm font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-amber-900/40"
                        >
                            <Leaf className="w-4 h-4" aria-hidden="true" />
                            Comprar — R$ 29
                        </a>
                    </div>

                    <button
                        onClick={() => setMobileOpen(true)}
                        aria-label="Abrir menu"
                        aria-expanded={mobileOpen}
                        className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <div
                className={`fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col bg-zinc-950 border-l border-zinc-800/80 shadow-2xl md:hidden transition-transform duration-300 ease-in-out ${
                    mobileOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navegação"
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
                    <span className="text-xl font-bold text-white">
                        O <span className="text-amber-500">Ancestral</span>
                    </span>
                    <button
                        onClick={() => setMobileOpen(false)}
                        aria-label="Fechar menu"
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="group flex items-center gap-3 px-3 py-3.5 rounded-xl text-zinc-400 hover:bg-zinc-800/60 hover:text-white transition-all"
                        >
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-amber-950/60 group-hover:text-amber-400 flex items-center justify-center flex-shrink-0 transition-colors">
                                <link.icon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-[15px] flex-1">{link.label}</span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all" />
                        </Link>
                    ))}
                </nav>

                <div className="px-4 pb-8 pt-3 border-t border-zinc-800/60">
                    <a
                        href={CHECKOUT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="cta-amber-glow flex items-center justify-center gap-3 w-full bg-amber-600 hover:bg-amber-500 text-zinc-950 text-base font-bold uppercase tracking-wider py-4 rounded-xl transition-colors"
                    >
                        <Leaf className="w-5 h-5" aria-hidden="true" />
                        Comprar Agora — R$ 29
                    </a>
                    <p className="text-center text-zinc-600 text-xs mt-3">
                        Acesso imediato · Garantia 7 dias
                    </p>
                </div>
            </div>
        </>
    )
}
