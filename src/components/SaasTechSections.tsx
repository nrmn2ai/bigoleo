import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Gift, 
  ArrowRight, 
  ChevronDown, 
  Zap, 
  Search, 
  Coins, 
  CheckCircle2,
  Users
} from 'lucide-react';

interface SaasTechSectionsProps {
  onNavigateTab: (tab: string) => void;
  onOpenSearch: () => void;
}

export const PartnerMarquee: React.FC = () => {
  const partners = [
    'ICANN ACCREDITED',
    'STRIPE ESCROW',
    'CLOUDFLARE DNS',
    'VERISIGN REGISTRY',
    'Y COMBINATOR ALUMNI',
    'VERCEL EDGE',
    'AWS ROUTE 53',
    'TECHSTARS PORTFOLIO'
  ];

  return (
    <div className="border-y border-white/[0.06] bg-black/20 backdrop-blur-md py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 text-center">
        <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">
          Trusted by founders & digital creators across 40+ countries
        </span>
      </div>
      <div className="relative w-full flex overflow-x-hidden">
        <div className="flex gap-10 whitespace-nowrap animate-none sm:animate-marquee py-2 justify-center items-center w-full flex-wrap sm:flex-nowrap">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-400/80 hover:text-white transition-colors tracking-wider px-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E36]" />
              <span>{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HowItWorksSection: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const steps = [
    {
      step: '01',
      title: 'Discover, Bid, or Invent',
      description:
        'Browse curated domain names, compete in live countdown auctions, order custom business names, or create viral brand handles on tactile tiles in our Scrabble Tile Lab.',
      badge: 'Step 1: Ideation & Selection',
      icon: Search,
      actionText: 'Explore Marketplace',
      tab: 'explore',
    },
    {
      step: '02',
      title: 'Instant Escrow & Valuation',
      description:
        'Every transaction is backed by automated 100% escrow protection. When playing Scrabble, submit your coined name to BIGOLEO Senior Appraisal Board for instant cash buyout offers.',
      badge: 'Step 2: Valuation & Escrow',
      icon: ShieldCheck,
      actionText: 'Try Scrabble Lab',
      tab: 'scrabble',
    },
    {
      step: '03',
      title: 'Registry Push + Free .BIG Twin',
      description:
        'Complete your acquisition in seconds with zero broker paperwork. Registering any .com automatically pushes the matching premium .big twin domain to your account for 100% free.',
      badge: 'Step 3: Transfer & Ownership',
      icon: Gift,
      actionText: 'View Bundle Offers',
      tab: 'promotions',
    },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF5E36]/10 border border-[#FF5E36]/25 text-[#FFA800] text-xs font-semibold mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>SaaSTech Operating Model</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
          How BIGOLEO Powers Next-Gen Web Real Estate
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          From brainstorming phonetic brand names with Scrabble tiles to instant automated escrow transfers, here is how you build your digital empire.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-[#10121d] border border-white/[0.08] hover:border-[#FF5E36]/40 rounded-3xl p-7 flex flex-col justify-between shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#FF5E36]/5 group-hover:bg-[#FF5E36]/15 rounded-full blur-2xl transition-all pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black font-mono text-white/30 group-hover:text-[#FFA800] transition-colors">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#FFA800] group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-[#FFA800] uppercase tracking-wider block mb-2">
                  {item.badge}
                </span>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFA800] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() => onNavigateTab(item.tab)}
                className="pt-4 border-t border-white/[0.08] text-xs font-semibold text-[#FF5E36] group-hover:text-[#FFA800] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does the Free .BIG Twin Domain offer work?',
      answer:
        'Whenever you register or purchase any .com domain on BIGOLEO (e.g. yourstartup.com), the identical name under our high-performance .big extension (yourstartup.big) is automatically attached to your cart for $0.00. Both domains share synchronized DNS routing and single-dashboard management.',
    },
    {
      question: 'How do I sell my coined word to BIGOLEO in the Scrabble Tile Lab?',
      answer:
        'Inside our tactile Word Scrabble Lab, you rearrange letters to form catchy, brandable words. Clicking "Submit to Bigoleo Senior Appraisal Board" analyzes the name for phonetic balance, length, and memorability, and pairs it with your user luck multiplier. If BIGOLEO approves the name, we present an immediate cash buyout offer (up to $900+). You can accept with one click to receive instant credit or register it yourself!',
    },
    {
      question: 'What are the volume and Family Pack discounts?',
      answer:
        'When purchasing multiple domains, discounts apply automatically at checkout: 2 to 4 domains receive 15% off, and 5 or more domains receive 25% off. Our Family Pack Builder lets you customize up to 5 domains sharing a common surname (e.g. alex-miller.big) at a flat 35% discount ($4.68/domain instead of $7.20).',
    },
    {
      question: 'How does the Live Auction and Escrow protocol operate?',
      answer:
        'All live auction bids are locked into our automated escrow smart vault. If you win the countdown auction, ownership credentials and DNS keys are pushed directly to your account with zero broker interaction. If outbid, held funds are immediately unlocked.',
    },
    {
      question: 'Can I list my own domains for sale on the marketplace?',
      answer:
        'Yes! Click "List Your Domain For Sale" in the Marketplace tab. You set your asking price and description. BIGOLEO charges an industry-low 3% escrow fee only upon a completed sale, with transparent net payout calculations displayed upfront.',
    },
  ];

  return (
    <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#FFA800]" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 text-sm">
          Everything you need to know about BIGOLEO domain trading, Scrabble buyouts, and bundle perks.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-[#10121d] border border-white/[0.08] rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
              >
                <span className="font-bold text-white text-sm sm:text-base">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#FFA800]' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/[0.04]">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const CtaBanner: React.FC<{ onNavigateTab: (tab: string) => void; onOpenSearch: () => void }> = ({
  onNavigateTab,
  onOpenSearch,
}) => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden bg-gradient-to-br from-[#16192d] via-[#10121e] to-[#0c0e17] border border-[#FF5E36]/30 shadow-2xl text-center">
        {/* SaaSTech glowing radiant orbs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#FF5E36]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#FFA800]/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5E36]/10 border border-[#FF5E36]/30 text-xs font-mono text-[#FFA800] mb-6">
            <Gift className="w-3.5 h-3.5" />
            <span>Limited Promotion: Free .BIG Domain with Every .COM Registration</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Claim Your Brand's Digital Real Estate Today on BIGOLEO
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Join thousands of visionary founders. Trade high-equity domains, bid in countdown auctions, or play the Scrabble Word Lab to get an instant buyout offer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenSearch}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] hover:from-[#f0532b] hover:to-[#e67c00] text-white font-bold text-sm shadow-xl shadow-[#FF5E36]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Instant Domain Search</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigateTab('scrabble')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#FFA800]" />
              <span>Launch Scrabble Lab</span>
            </motion.button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Escrow Protection
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Instant Registry Push
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Free .BIG Twin Included
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
