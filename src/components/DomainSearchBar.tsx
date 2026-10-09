import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Gift, Plus, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatUsd } from '../utils/formatters';
import { CartItem } from '../types';

interface DomainSearchBarProps {
  initialSearch?: string;
  onAddToCart: (item: CartItem) => void;
  cartItems: CartItem[];
}

interface TldCheckResult {
  tld: string;
  fullName: string;
  available: boolean;
  priceUsd: number;
  freeBigBonus?: boolean;
}

export const DomainSearchBar: React.FC<DomainSearchBarProps> = ({
  initialSearch = '',
  onAddToCart,
  cartItems,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeQuery, setActiveQuery] = useState(initialSearch || 'kinetic');
  const [isSearching, setIsSearching] = useState(false);
  const [brokerDomain, setBrokerDomain] = useState<string | null>(null);
  const [brokerOfferPlaced, setBrokerOfferPlaced] = useState<string | null>(null);

  useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
      setActiveQuery(initialSearch);
    }
  }, [initialSearch]);

  const cleanName = (activeQuery.split('.')[0] || 'brand').toLowerCase().replace(/[^a-z0-9-]/g, '');

  const results: TldCheckResult[] = [
    {
      tld: '.com',
      fullName: `${cleanName}.com`,
      available: cleanName.length % 2 === 0,
      priceUsd: 14.5,
      freeBigBonus: true,
    },
    {
      tld: '.big',
      fullName: `${cleanName}.big`,
      available: true,
      priceUsd: 7.2,
      freeBigBonus: false,
    },
    {
      tld: '.ai',
      fullName: `${cleanName}.ai`,
      available: cleanName.length > 4,
      priceUsd: 79.0,
      freeBigBonus: false,
    },
    {
      tld: '.io',
      fullName: `${cleanName}.io`,
      available: false,
      priceUsd: 42.0,
      freeBigBonus: false,
    },
    {
      tld: '.co',
      fullName: `${cleanName}.co`,
      available: true,
      priceUsd: 26.0,
      freeBigBonus: false,
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setActiveQuery(searchTerm.trim());
      setIsSearching(false);
    }, 250);
  };

  const isDomainInCart = (name: string) => cartItems.some((c) => c.domainName === name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#10121d] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl max-w-5xl mx-auto my-8"
    >
      {/* Title & Twin Promotion Notice with SaaSTech accents */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <span>Instant WHOIS & Multi-TLD Registration</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FF5E36]/10 text-[#FF7A50] border border-[#FF5E36]/25">
              Live Engine
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Check real-time availability across global registries. Every <span className="font-mono text-white font-semibold">.com</span> purchase automatically unlocks the matching <span className="font-mono text-[#FFA800] font-bold">.big</span> asset for free.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FF5E36]/15 to-[#FFA800]/10 border border-[#FF5E36]/25 flex items-center gap-3">
          <Gift className="w-5 h-5 text-[#FFA800] shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-white block">BIGOLEO Twin Drop</span>
            <span className="text-slate-400">Buy 1 .com = Get 1 .big Free</span>
          </div>
        </div>
      </div>

      {/* Broker Notice Banner if active */}
      <AnimatePresence>
        {brokerOfferPlaced && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between"
          >
            <span>{brokerOfferPlaced}</span>
            <button onClick={() => setBrokerOfferPlaced(null)} className="text-emerald-400 font-bold ml-2">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex items-center gap-2 bg-[#0a0b11] border border-white/15 rounded-2xl p-2 focus-within:border-[#FF5E36] transition-colors">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type your target root word or name (e.g. quantum, kinetic)..."
            className="flex-1 bg-transparent px-4 py-2 text-white placeholder-slate-500 text-sm focus:outline-none font-mono"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={isSearching}
            className="px-6 py-2.5 bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] hover:from-[#f0532b] hover:to-[#e67c00] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#FF5E36]/30 disabled:opacity-50 cursor-pointer"
          >
            {isSearching ? 'Verifying...' : 'Check Availability'}
          </motion.button>
        </div>
      </form>

      {/* Results List */}
      <div className="space-y-3">
        {results.map((item) => {
          const inCart = isDomainInCart(item.fullName);

          return (
            <motion.div
              key={item.tld}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                item.freeBigBonus
                  ? 'bg-gradient-to-r from-[#FF5E36]/10 to-[#FFA800]/5 border-[#FF5E36]/30 hover:border-[#FF5E36]/50'
                  : 'bg-white/[0.02] border-white/6 hover:border-white/12'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.available ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-base sm:text-lg font-bold text-white tracking-wide">
                      {item.fullName}
                    </span>
                    {item.freeBigBonus && (
                      <span className="text-[11px] font-semibold text-[#FFA800] bg-[#FFA800]/15 border border-[#FFA800]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Includes free {cleanName}.big ($0)
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {item.available ? (
                      <span className="text-emerald-400 font-medium">Available for instant registration</span>
                    ) : (
                      <span className="text-slate-500">Registered (Private broker acquisition eligible)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="text-right">
                  <div className="text-base sm:text-lg font-extrabold text-white font-mono tabular-nums">
                    {formatUsd(item.priceUsd)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    per year
                  </div>
                </div>

                {item.available ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      if (!inCart) {
                        onAddToCart({
                          id: `reg-${item.fullName}`,
                          domainName: item.fullName,
                          priceUsd: item.priceUsd,
                          type: 'single',
                        });
                        if (item.freeBigBonus) {
                          onAddToCart({
                            id: `gift-${cleanName}.big`,
                            domainName: `${cleanName}.big`,
                            priceUsd: 0,
                            isFreeGift: true,
                            giftForDomain: item.fullName,
                            type: 'single',
                          });
                        }
                      }
                    }}
                    disabled={inCart}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      inCart
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>In Cart</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Register</span>
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setBrokerOfferPlaced(`Broker inquiry initiated for ${item.fullName}. Our Senior Desk will contact the registrar holder via escrow.`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-[#FFA800] bg-[#FFA800]/10 border border-[#FFA800]/25 hover:bg-[#FFA800]/20 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Inquire Broker</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
