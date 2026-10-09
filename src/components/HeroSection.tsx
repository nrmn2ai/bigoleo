import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Gift, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onSearchDomain: (term: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchDomain,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearchDomain(searchTerm.trim());
    }
  };

  const sampleKeywords = ['zova', 'flowgen', 'lumina', 'motionflux', 'synthetix', 'hyper'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.25 + i * 0.1,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-white/[0.08]">
      {/* Background SaaSTech flame orange & amber kinetic ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[620px] pointer-events-none opacity-55">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.35, 0.45, 0.35],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 left-1/4 w-[480px] h-[480px] bg-[#FF5E36]/25 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.25, 0.35, 0.25],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute top-12 right-1/4 w-[420px] h-[420px] bg-[#FFA800]/20 rounded-full blur-[150px]"
        />
        <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[720px] h-72 bg-purple-600/10 rounded-full blur-[130px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        {/* Top Promotional Highlight Tag (SaaSTech style) */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FF5E36]/10 border border-[#FF5E36]/30 text-xs sm:text-sm text-slate-200 shadow-inner backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#FF5E36] animate-pulse" />
            <span>
              Special Drop: Register any{' '}
              <span className="font-mono font-bold text-white">.com</span> and receive the
              matching <span className="font-mono font-bold text-[#FFA800]">.big</span> for{' '}
              <span className="text-[#FFA800] font-bold">100% FREE</span>!
            </span>
            <Gift className="w-3.5 h-3.5 text-[#FFA800] ml-1" />
          </motion.div>
        </motion.div>

        {/* Hero Title & Subtitle with SaaSTech Sunset Typography */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6"
          >
            The Ultimate SaaS Domain Exchange &
            <span className="bg-gradient-to-r from-[#FF5E36] via-[#FFA800] to-[#FFD000] bg-clip-text text-transparent block mt-2">
              Brand Identity Engine
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            Trade high-value web real estate, bid in real-time verified auctions, craft viral brand
            words in our Scrabble Tile Lab with instant cash buyout offers from BIGOLEO, and scale your
            brand portfolio.
          </motion.p>
        </div>

        {/* Dominant Focal Search Input with SaaSTech Orange Rim */}
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto mb-10">
          <form
            onSubmit={handleSearchSubmit}
            className="p-2 sm:p-2.5 rounded-2xl bg-[#11131e]/85 border border-white/12 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:border-[#FF5E36]/60 focus-within:ring-2 focus-within:ring-[#FF5E36]/25"
          >
            <div className="flex items-center gap-3 w-full px-4 py-2 sm:py-1">
              <Search className="w-5 h-5 text-[#FF5E36] shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search domain availability or brand idea (e.g. novaflow.com, rayan)..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none font-medium font-sans"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full sm:w-auto px-7 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] hover:from-[#f0532b] hover:to-[#e67c00] rounded-xl shadow-lg shadow-[#FF5E36]/30 transition-all whitespace-nowrap flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Instant Check</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Quick search suggestions */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
            <span className="text-slate-500">Trending drops:</span>
            {sampleKeywords.map((kw) => (
              <motion.button
                key={kw}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm(kw);
                  onSearchDomain(kw);
                }}
                className="px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] hover:text-[#FFA800] border border-white/5 transition-colors font-mono cursor-pointer"
              >
                {kw}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* 3 Interactive Mode Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Card 1: Scrabble Name Game */}
          <motion.div
            custom={0}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
            onClick={() => onNavigateTab('scrabble')}
            className="group p-6 rounded-2xl bg-gradient-to-b from-[#131524] to-[#0c0e17] border border-white/8 hover:border-[#FFA800]/50 transition-colors cursor-pointer relative overflow-hidden shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFA800]/10 border border-[#FFA800]/25 flex items-center justify-center text-[#FFA800] group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-[#FFA800] bg-[#FFA800]/10 px-2 py-0.5 rounded">
                Tactile Lab
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FFA800] transition-colors">
              Word Scrabble & Cash Buyout
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Shuffle and combine root words on interactive Scrabble tiles. If BIGOLEO loves your coined brand name, we will buy it from you on the spot with instant cash!
            </p>
            <div className="text-xs font-semibold text-[#FFA800] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
              <span>Enter Scrabble Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Card 2: Custom AI Naming */}
          <motion.div
            custom={1}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
            onClick={() => onNavigateTab('custom-naming')}
            className="group p-6 rounded-2xl bg-gradient-to-b from-[#131524] to-[#0c0e17] border border-white/8 hover:border-[#FF5E36]/50 transition-colors cursor-pointer relative overflow-hidden shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF5E36]/10 border border-[#FF5E36]/25 flex items-center justify-center text-[#FF5E36] group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-[#FF7A50] bg-[#FF5E36]/10 px-2 py-0.5 rounded">
                Custom Order
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF7A50] transition-colors">
              Tailored Brand Naming Concierge
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Describe your project, audience, and vision. BIGOLEO's naming engine synthesizes available, high-prestige domains customized specifically for your business.
            </p>
            <div className="text-xs font-semibold text-[#FF5E36] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
              <span>Order Custom Name</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Card 3: Live Auctions & Escrow */}
          <motion.div
            custom={2}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
            onClick={() => onNavigateTab('auctions')}
            className="group p-6 rounded-2xl bg-gradient-to-b from-[#131524] to-[#0c0e17] border border-white/8 hover:border-[#FF5E36]/40 transition-colors cursor-pointer relative overflow-hidden shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF5E36]/10 border border-[#FF5E36]/25 flex items-center justify-center text-[#FF7A50] group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-[#FFA800] bg-[#FFA800]/10 px-2 py-0.5 rounded">
                Escrow Backed
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FFA800] transition-colors">
              High-Velocity Live Auctions
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Compete in real-time countdown auctions for 3-letter, single-syllable, and category-defining assets with automated escrow and guaranteed delivery.
            </p>
            <div className="text-xs font-semibold text-[#FF7A50] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
              <span>Explore Live Bidding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        </div>

        {/* Quantified Proof Row with SaaSTech Highlights */}
        <motion.div
          variants={itemVariants}
          className="mt-14 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto"
        >
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              +12,400
            </div>
            <div className="text-xs text-slate-400 mt-1">Escrow Transfers Completed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FFA800] font-mono tabular-nums">
              $0 FREE
            </div>
            <div className="text-xs text-slate-400 mt-1">.BIG Twin Domain with every .COM</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              35% OFF
            </div>
            <div className="text-xs text-slate-400 mt-1">Family & Bundle Pack Savings</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FF5E36] font-mono tabular-nums">
              Instant
            </div>
            <div className="text-xs text-slate-400 mt-1">Bigoleo Cash Buyout Offers</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
