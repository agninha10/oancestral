'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type FilterOption = {
    value: string;
    label: string;
};

type FilterBarProps = {
    options: FilterOption[];
    activeFilter: string;
    onFilterChange: (value: string) => void;
    label?: string;
};

export function FilterBar({ options, activeFilter, onFilterChange, label = 'Filtrar por' }: FilterBarProps) {
    return (
        <div className="w-full">
            {label && (
                <p className="text-sm font-semibold text-neutral-400 mb-3 uppercase tracking-wider">
                    {label}
                </p>
            )}

            <div className="relative">
                {/* Gradient fade on edges for mobile scroll */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none lg:hidden" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none lg:hidden" />

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide lg:flex-wrap">
                    {options.map((option) => (
                        <motion.button
                            key={option.value}
                            onClick={() => onFilterChange(option.value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm
                transition-all duration-200
                ${activeFilter === option.value
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-orange-500/50 hover:text-white'
                                }
              `}
                        >
                            {option.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}
