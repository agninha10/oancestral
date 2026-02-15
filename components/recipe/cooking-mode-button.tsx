'use client';

import { useState } from 'react';
import { ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

export function CookingModeButton() {
    const [isActive, setIsActive] = useState(false);
    const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

    const toggleCookingMode = async () => {
        if (!isActive) {
            // Activate cooking mode
            try {
                // Try to use Wake Lock API if available
                if ('wakeLock' in navigator) {
                    const lock = await (navigator as any).wakeLock.request('screen');
                    setWakeLock(lock);
                }
                setIsActive(true);
            } catch (err) {
                // Fallback: just set the state (CSS will prevent screen dimming on some devices)
                console.log('Wake Lock not supported, using fallback');
                setIsActive(true);
            }
        } else {
            // Deactivate cooking mode
            if (wakeLock) {
                await wakeLock.release();
                setWakeLock(null);
            }
            setIsActive(false);
        }
    };

    return (
        <motion.button
            onClick={toggleCookingMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
        fixed bottom-6 right-6 z-40
        flex items-center gap-2 px-5 py-3 rounded-full
        font-semibold shadow-lg
        transition-all duration-300
        ${isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/50'
                    : 'bg-neutral-900 text-neutral-300 border border-neutral-700 hover:border-orange-500/50'
                }
      `}
        >
            <ChefHat className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">
                {isActive ? 'Modo Cozinhar Ativo' : 'Modo Cozinhar'}
            </span>
        </motion.button>
    );
}
