import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Gift, 
  ShoppingBag, 
  CheckCircle2, 
  PlusCircle, 
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DomainItem, CartItem } from '../types';
import { formatUsd } from '../utils/formatters';

interface MarketplaceSectionProps {
  domains: DomainItem[];
  onAddToCart: (item: CartItem) => void;
  cartItems: CartItem[];
  onOpenListDomainModal: () => void;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({
  domains,
  onAddToCart,
  cartItems,
  onOpenListDomainModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'short'>('popular');

  const categories = [
    { id: 'all', label: 'All Domains' },
    { id: 'ai', label: 'AI & Data' },
    { id: 'tech', label: 'Tech & SaaS' },
    { id: 'short', label: 'Short 3-4L' },
    { id: 'brandable', label: 'Brandable' },
    { id: 'creative', label: 'Creative Studio' },
  ];

  const filteredDomains = domains
    .filter((d) => !d.isAuction)
    .filter((d) => {
      if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
      if (searchFilter.trim() && !d.fullName.toLowerCase().includes(searchFilter.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.priceUsd - b.priceUsd;
      if (sortBy === 'priceDesc') return b.priceUsd - a.priceUsd;
      if (sortBy === 'short') return a.name.length - b.name.length;
      return b.views - a.views;
    });

  const isDomainInCart = (domainName: string) => cartItems.some((c) => c.domainName === domainName);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 22, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Top Banner & Title with SaaSTech Header Accent */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FFA800] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated SaaSTech Marketplace</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Acquire & Trade Hand-Crafted Web Real Estate
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            A hand-picked selection of high-equity brand assets with instant automated escrow ownership transfer and matching <span className="font-mono text-[#FFA800]">.big</span> twin domains.
          </p>
        </div>

        {/* Sell Domain CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenListDomainModal}
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/15 flex items-center justify-center gap-2 transition-colors self-start md:self-auto cursor-pointer shadow-lg"
        >
          <PlusCircle className="w-4 h-4 text-[#FFA800]" />
          <span>List Your Domain For Sale</span>
        </motion.button>
      </div>

      {/* Filter and Search Bar with SaaSTech Segmented Pill Controls */}
      <div className="bg-[#10121d] border border-white/[0.08] rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
        {/* Category Pills (functional filter buttons with kinetic transition) */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer relative ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] rounded-xl shadow-md shadow-[#FF5E36]/35 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Search input + Sort options */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search catalog..."
              className="w-full bg-[#0a0b11] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5E36]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0a0b11] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="short">Shortest Length</option>
            </select>
          </div>
        </div>
      </div>

      {/* Domain Cards Grid with AnimatePresence and Staggered Layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory + sortBy + searchFilter}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDomains.map((domain) => {
            const inCart = isDomainInCart(domain.fullName);

            return (
              <motion.div
                key={domain.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
                className="bg-[#10121d] border border-white/[0.08] hover:border-[#FF5E36]/40 rounded-2xl p-6 flex flex-col justify-between transition-colors duration-200 shadow-xl group relative overflow-hidden"
              >
                {/* Subtle accent hover glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5E36]/5 group-hover:bg-[#FF5E36]/15 rounded-full blur-2xl transition-all pointer-events-none" />

                <div>
                  {/* Meta header */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-mono tabular-nums">{domain.views} views</span>
                    </div>

                    {domain.freeBigPairIncluded && (
                      <span className="text-[11px] font-semibold text-[#FFA800] bg-[#FFA800]/10 border border-[#FFA800]/25 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Gift className="w-3 h-3 text-[#FFA800]" />
                        Free {domain.name}.big Included
                      </span>
                    )}
                  </div>

                  {/* Domain name */}
                  <h3 className="text-2xl font-black font-mono text-white tracking-wide group-hover:text-[#FFA800] transition-colors mb-2">
                    {domain.fullName}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {domain.description}
                  </p>
                </div>

                {/* Price and Cart Action */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xl font-black text-white font-mono tabular-nums">
                      {formatUsd(domain.priceUsd)}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Buyout or Lease-to-Own
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      if (!inCart) {
                        onAddToCart({
                          id: `market-${domain.fullName}`,
                          domainName: domain.fullName,
                          priceUsd: domain.priceUsd,
                          type: 'single',
                        });
                        if (domain.freeBigPairIncluded) {
                          onAddToCart({
                            id: `gift-${domain.name}.big`,
                            domainName: `${domain.name}.big`,
                            priceUsd: 0,
                            isFreeGift: true,
                            giftForDomain: domain.fullName,
                            type: 'single',
                          });
                        }
                      }
                    }}
                    disabled={inCart}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      inCart
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] hover:from-[#f0532b] hover:to-[#e67c00] text-white shadow-md shadow-[#FF5E36]/30'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>In Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Acquire Now</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
