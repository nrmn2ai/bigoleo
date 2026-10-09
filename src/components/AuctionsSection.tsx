import React, { useState, useEffect } from 'react';
import { Timer, Gavel, ShieldCheck, Heart, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DomainItem } from '../types';
import { formatUsd, formatCountdown } from '../utils/formatters';

interface AuctionsSectionProps {
  domains: DomainItem[];
  onPlaceBid: (domainId: string, newBidUsd: number, bidderName: string) => void;
}

export const AuctionsSection: React.FC<AuctionsSectionProps> = ({
  domains,
  onPlaceBid,
}) => {
  const [now, setNow] = useState(Date.now());
  const [activeBidDomain, setActiveBidDomain] = useState<DomainItem | null>(null);
  const [customBidAmount, setCustomBidAmount] = useState<number>(0);
  const [bidderNickname, setBidderNickname] = useState('your_bidder_handle');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);

  // Clock tick for auctions
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const auctionDomains = domains.filter((d) => d.isAuction && d.auctionDetails);

  const toggleWatchlist = (id: string) => {
    if (watchlist.includes(id)) {
      setWatchlist(watchlist.filter((w) => w !== id));
    } else {
      setWatchlist([...watchlist, id]);
    }
  };

  const handleOpenBidModal = (domain: DomainItem) => {
    if (!domain.auctionDetails) return;
    const minNext = domain.auctionDetails.currentBidUsd + domain.auctionDetails.minIncrementUsd;
    setActiveBidDomain(domain);
    setCustomBidAmount(minNext);
    setBidError(null);
    setBidSuccess(null);
  };

  const handleConfirmBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBidDomain || !activeBidDomain.auctionDetails) return;
    if (customBidAmount <= activeBidDomain.auctionDetails.currentBidUsd) {
      setBidError(`Your bid must be at least ${formatUsd(activeBidDomain.auctionDetails.currentBidUsd + activeBidDomain.auctionDetails.minIncrementUsd)}.`);
      return;
    }

    onPlaceBid(activeBidDomain.id, customBidAmount, bidderNickname || 'anonymous_bidder');
    setBidSuccess(`Success! Your bid of ${formatUsd(customBidAmount)} on ${activeBidDomain.fullName} is now leading.`);
    setTimeout(() => {
      setActiveBidDomain(null);
      setBidSuccess(null);
    }, 1600);
  };

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FFA800] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5E36] animate-ping" />
            <span>SaaSTech Live Bidding Pavilion</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Curated High-Value Domain Auctions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Ultra-rare 3-letter, synthetic media, and category-defining brand assets with instant automated escrow closing.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/5">
          <ShieldCheck className="w-4 h-4 text-[#FFA800]" />
          <span>Automated registry push & 100% escrow money-back protection</span>
        </div>
      </div>

      {/* Grid of Auction Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {auctionDomains.map((domain) => {
          if (!domain.auctionDetails) return null;
          const remainingMs = Math.max(0, domain.auctionDetails.endsAt - now);
          const countdown = formatCountdown(remainingMs);
          const isWatched = watchlist.includes(domain.id);

          return (
            <motion.div
              key={domain.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-[#10121d] border border-white/[0.08] hover:border-[#FF5E36]/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl group"
            >
              <div>
                {/* Top: Watchlist & Countdown */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF5E36]/10 border border-[#FF5E36]/25 text-[#FFA800] text-xs font-mono font-bold">
                    <Timer className="w-3.5 h-3.5 text-[#FF5E36]" />
                    <span>{countdown.hours}:{countdown.minutes}:{countdown.seconds}</span>
                  </div>

                  <button
                    onClick={() => toggleWatchlist(domain.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                    title="Add to Watchlist"
                  >
                    <Heart className={`w-4 h-4 ${isWatched ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Domain name */}
                <div className="mb-3">
                  <h3 className="text-xl font-black font-mono text-white tracking-wide group-hover:text-[#FFA800] transition-colors">
                    {domain.fullName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                {/* Highest bidder info */}
                <div className="py-2.5 px-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs mb-4">
                  <span className="text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>Leading Bidder:</span>
                  </span>
                  <span className="text-white font-mono font-medium">
                    {domain.auctionDetails.highestBidder}
                  </span>
                </div>
              </div>

              {/* Bottom: Current Bid & Bid Button */}
              <div className="pt-3 border-t border-white/[0.08]">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-xs text-slate-400">Current Bid:</span>
                  <div className="text-right">
                    <span className="text-base font-black text-white font-mono tabular-nums block">
                      {formatUsd(domain.auctionDetails.currentBidUsd)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {domain.auctionDetails.totalBids} bids placed
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleOpenBidModal(domain)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5E36]/20 to-[#FFA800]/20 hover:from-[#FF5E36] hover:to-[#FFA800] text-[#FFA800] hover:text-slate-950 border border-[#FF5E36]/30 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Gavel className="w-4 h-4" />
                  <span>Place Bid</span>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Place Bid Modal */}
      <AnimatePresence>
        {activeBidDomain && activeBidDomain.auctionDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#121524] border border-[#FF5E36]/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono text-[#FFA800] uppercase tracking-wider">Live Auction</span>
                  <h3 className="text-xl font-black font-mono text-white">
                    {activeBidDomain.fullName}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveBidDomain(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {bidSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <p className="text-white font-bold text-sm">{bidSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleConfirmBid} className="space-y-4">
                  {bidError && (
                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{bidError}</span>
                    </div>
                  )}

                  <div className="bg-white/[0.03] p-3 rounded-xl border border-white/8 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Current Leading Bid:</span>
                    <span className="text-white font-mono font-bold">
                      {formatUsd(activeBidDomain.auctionDetails.currentBidUsd)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Bidder Pseudonym / Handle:
                    </label>
                    <input
                      type="text"
                      value={bidderNickname}
                      onChange={(e) => setBidderNickname(e.target.value)}
                      className="w-full bg-[#0a0b11] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF5E36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Your New Bid (USD):
                    </label>
                    <input
                      type="number"
                      step={activeBidDomain.auctionDetails.minIncrementUsd}
                      value={customBidAmount}
                      onChange={(e) => {
                        setCustomBidAmount(Number(e.target.value));
                        setBidError(null);
                      }}
                      className="w-full bg-[#0a0b11] border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono text-base focus:outline-none focus:border-[#FF5E36]"
                    />
                  </div>

                  {/* Quick Bid Increment Buttons */}
                  <div className="flex gap-2">
                    {[
                      activeBidDomain.auctionDetails.minIncrementUsd,
                      activeBidDomain.auctionDetails.minIncrementUsd * 2,
                      activeBidDomain.auctionDetails.minIncrementUsd * 5,
                    ].map((inc, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => {
                          setCustomBidAmount((prev) => prev + inc);
                          setBidError(null);
                        }}
                        className="flex-1 py-1.5 px-2 bg-white/5 hover:bg-[#FF5E36]/20 text-slate-300 hover:text-[#FFA800] border border-white/10 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                      >
                        +${inc}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveBidDomain(null)}
                      className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#FF5E36]/30 transition-all cursor-pointer"
                    >
                      Confirm & Place Bid
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
