import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sun, Palette } from 'lucide-react';

export type AmbientTheme = 'solar' | 'emerald' | 'nebula' | 'obsidian';

interface BackgroundAtmosphereProps {
  currentTheme?: AmbientTheme;
  onThemeChange?: (theme: AmbientTheme) => void;
}

export const BackgroundAtmosphere: React.FC<BackgroundAtmosphereProps> = ({
  currentTheme = 'solar',
  onThemeChange,
}) => {
  const [activeTheme, setActiveTheme] = useState<AmbientTheme>(currentTheme);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  const handleSelectTheme = (theme: AmbientTheme) => {
    setActiveTheme(theme);
    if (onThemeChange) onThemeChange(theme);
  };

  // Color configurations related to BIGOLEO
  const themeGradients = {
    // 1. Solar Flame: Signature BIGOLEO Sunset Flame & Amber
    solar: {
      radialBase: 'radial-gradient(circle at 50% 0%, #16192e 0%, #0d0f1c 45%, #07080e 100%)',
      orb1: 'from-[#FF5E36]/30 via-[#FF7A30]/20 to-transparent',
      orb2: 'from-[#FFA800]/22 via-[#FF5E36]/15 to-transparent',
      orb3: 'from-indigo-600/22 via-purple-700/15 to-transparent',
      label: 'Solar Flame (Brand)',
      accentDot: 'bg-[#FF5E36]',
    },
    // 2. Cyber Emerald: ICANN & Escrow Verified Security
    emerald: {
      radialBase: 'radial-gradient(circle at 50% 0%, #0b1e19 0%, #091412 45%, #060908 100%)',
      orb1: 'from-[#10b981]/28 via-[#059669]/18 to-transparent',
      orb2: 'from-[#84cc16]/20 via-[#10b981]/12 to-transparent',
      orb3: 'from-teal-600/20 via-cyan-700/15 to-transparent',
      label: 'Cyber Escrow',
      accentDot: 'bg-emerald-400',
    },
    // 3. Deep Nebula: High-Equity Creative Studio & AI Lab
    nebula: {
      radialBase: 'radial-gradient(circle at 50% 0%, #171530 0%, #0e0d1f 45%, #070710 100%)',
      orb1: 'from-[#8b5cf6]/30 via-[#6366f1]/20 to-transparent',
      orb2: 'from-[#ec4899]/18 via-[#8b5cf6]/14 to-transparent',
      orb3: 'from-blue-600/20 via-indigo-700/15 to-transparent',
      label: 'Creative Nebula',
      accentDot: 'bg-purple-400',
    },
    // 4. Obsidian Minimal: High-Contrast Stealth Tech
    obsidian: {
      radialBase: 'radial-gradient(circle at 50% 0%, #14161f 0%, #0b0c13 50%, #06070a 100%)',
      orb1: 'from-white/10 via-white/5 to-transparent',
      orb2: 'from-slate-400/8 via-white/4 to-transparent',
      orb3: 'from-slate-600/10 via-transparent to-transparent',
      label: 'Obsidian Stealth',
      accentDot: 'bg-slate-400',
    },
  };

  const currentCfg = themeGradients[activeTheme];

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-700">
        {/* 1. Deep Oceanic/Obsidian Radial Base Canvas */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{ background: currentCfg.radialBase }}
        />

        {/* 2. Architectural Fine Technical Grid */}
        <div className="absolute inset-0 bg-tech-grid opacity-60" />

        {/* 3. Smooth Kinetic Ambient Orbs */}
        {/* Top Dominant Flare */}
        <motion.div
          animate={{
            scale: [1, 1.08, 0.98, 1],
            x: [0, 20, -15, 0],
            y: [0, -10, 8, 0],
            opacity: [0.38, 0.48, 0.35, 0.38],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[760px] h-[540px] rounded-full bg-gradient-to-br ${currentCfg.orb1} blur-[160px] transition-all duration-700`}
        />

        {/* Mid-Right Warmth */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            x: [0, -25, 18, 0],
            opacity: [0.25, 0.36, 0.25],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className={`absolute top-[35%] -right-24 w-[620px] h-[620px] rounded-full bg-gradient-to-bl ${currentCfg.orb2} blur-[170px] transition-all duration-700`}
        />

        {/* Counter-Balance Lower Left Orb */}
        <motion.div
          animate={{
            scale: [0.96, 1.06, 0.96],
            y: [0, -20, 0],
            opacity: [0.22, 0.3, 0.22],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className={`absolute top-[65%] -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tr ${currentCfg.orb3} blur-[180px] transition-all duration-700`}
        />

        {/* Footer Horizon Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[320px] rounded-full bg-[#FF5E36]/8 blur-[160px]" />

        {/* 4. Fine Noise Texture to smooth out digital color banding */}
        <div className="absolute inset-0 bg-noise-overlay opacity-30 mix-blend-overlay" />
      </div>

      {/* Discreet Ambient Mood Control Pill (Floating at bottom-left) */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
            className="px-3 py-2 rounded-full bg-[#10121d]/85 hover:bg-[#161928] border border-white/10 hover:border-[#FF5E36]/40 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2 shadow-2xl backdrop-blur-xl transition-all cursor-pointer"
            title="Switch Background Ambient Mood"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${currentCfg.accentDot} animate-pulse`} />
            <span className="hidden sm:inline font-sans text-[11px] font-semibold text-slate-300">
              Mood: {currentCfg.label}
            </span>
            <Palette className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </motion.button>

          <AnimatePresence>
            {isThemePickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-12 left-0 w-52 p-2 rounded-2xl bg-[#121524] border border-white/15 shadow-2xl backdrop-blur-2xl space-y-1"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/8 mb-1">
                  Ambient Atmosphere
                </div>
                {(Object.keys(themeGradients) as AmbientTheme[]).map((themeKey) => {
                  const item = themeGradients[themeKey];
                  const isSelected = activeTheme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => {
                        handleSelectTheme(themeKey);
                        setIsThemePickerOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-white/10 text-white font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.accentDot}`} />
                        <span>{item.label}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-[#FFA800]">Active</span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
