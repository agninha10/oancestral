'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type TOCItem = {
    id: string;
    title: string;
    level: number;
};

type TableOfContentsProps = {
    items: TOCItem[];
    className?: string;
};

export function TableOfContents({ items, className = '' }: TableOfContentsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeId, setActiveId] = useState<string>('');

    const handleClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveId(id);
            setIsOpen(false); // Close on mobile after clicking
        }
    };

    return (
        <>
            {/* Mobile: Accordion */}
            <div className={`lg:hidden ${className}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-semibold hover:border-orange-500/50 transition-colors"
                >
                    <span>Índice do Conteúdo</span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <nav className="mt-2 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                                <ul className="space-y-2">
                                    {items.map((item) => (
                                        <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                                            <button
                                                onClick={() => handleClick(item.id)}
                                                className={`
                          text-left w-full text-sm py-1.5 px-2 rounded-lg transition-colors
                          ${activeId === item.id
                                                        ? 'text-orange-500 font-semibold'
                                                        : 'text-neutral-400 hover:text-white'
                                                    }
                        `}
                                            >
                                                {item.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Desktop: Floating sidebar */}
            <div className={`hidden lg:block ${className}`}>
                <div className="sticky top-24">
                    <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                            Neste Artigo
                        </h3>
                        <nav>
                            <ul className="space-y-2">
                                {items.map((item) => (
                                    <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                                        <button
                                            onClick={() => handleClick(item.id)}
                                            className={`
                        text-left w-full text-sm py-1.5 px-2 rounded-lg transition-all
                        ${activeId === item.id
                                                    ? 'text-orange-500 font-semibold bg-orange-500/10 border-l-2 border-orange-500'
                                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                                                }
                      `}
                                        >
                                            {item.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}
