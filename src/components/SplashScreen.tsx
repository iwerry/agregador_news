import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'pulse' | 'transform' | 'reveal'>('pulse');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('transform'), 700);
    const t2 = setTimeout(() => setPhase('reveal'), 1600);
    const t3 = setTimeout(() => onComplete(), 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="splash-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0f] text-white select-none overflow-hidden"
      >
        {/* Ambient Backlight Glow */}
        <motion.div
          animate={{
            scale: phase === 'pulse' ? [1, 1.3, 1] : 2,
            opacity: phase === 'reveal' ? 0.8 : 0.4
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-purple-700/20 via-purple-600/30 to-cyan-500/20 blur-3xl pointer-events-none"
        />

        {/* Core Transformation Element */}
        <div className="relative flex flex-col items-center justify-center">
          {phase === 'pulse' && (
            <motion.div
              key="pulsing-core"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 0.9, 1.1], opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="relative flex items-center justify-center"
            >
              {/* Radial ping wave 1 */}
              <motion.div
                animate={{ scale: [1, 2.4], opacity: [0.8, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute w-16 h-16 rounded-full border border-purple-500/60"
              />
              {/* Radial ping wave 2 */}
              <motion.div
                animate={{ scale: [1, 3.2], opacity: [0.6, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                className="absolute w-16 h-16 rounded-full border border-cyan-400/40"
              />
              {/* Glowing Core Dot */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 shadow-[0_0_35px_rgba(138,43,226,0.9)] ring-4 ring-purple-500/20" />
            </motion.div>
          )}

          {phase !== 'pulse' && (
            <motion.div
              key="capy-logo-reveal"
              initial={{ scale: 0.4, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 100 }}
              className="flex flex-col items-center"
            >
              {/* Capybara RSS Icon */}
              <div className="relative p-2">
                <img
                  src="/capy-symbol.svg"
                  alt="CapyNews Icon"
                  className="w-24 h-24 drop-shadow-[0_0_25px_rgba(138,43,226,0.7)]"
                />
              </div>

              {/* Brand Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-3 text-center"
              >
                <div className="text-4xl font-black tracking-tight font-['Poppins']">
                  Capy<span className="font-light text-purple-400">News</span>
                </div>
                <div className="mt-1 text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase">
                  Emancipação Cognitiva
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Telemetry Status Line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-900/40 bg-purple-950/20 text-[11px] font-mono text-purple-300/80"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SINCRONIZANDO 339 FEEDS GLOBAIS VIA RSS...</span>
          </motion.div>
        </div>

        {/* Skip button for fast accessibility */}
        <button
          onClick={onComplete}
          className="absolute bottom-6 right-8 text-xs font-mono text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
        >
          [ PULAR ANIMAÇÃO ↵ ]
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
