import React, { useState } from 'react';
import { Gift, Users, Layers, Percent, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../types';
import { formatUsd } from '../utils/formatters';

interface PromotionsSectionProps {
  onAddToCart: (item: CartItem) => void;
  cartItems: CartItem[];
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  onAddToCart,
  cartItems,
}) => {
  const [familyLastName, setFamilyLastName] = useState('miller');
  const [familyMembers, setFamilyMembers] = useState(['alex', 'sarah', 'leo']);
  const [newMember, setNewMember] = useState('');
  const [bundleSuccess, setBundleSuccess] = useState(false);

  const handleAddMember = () => {
    if (newMember.trim() && familyMembers.length < 5) {
      setFamilyMembers([...familyMembers, newMember.trim().toLowerCase().replace(/[^a-z0-9]/g, '')]);
      setNewMember('');
    }
  };

  const handleRemoveMember = (idx: number) => {
    if (familyMembers.length <= 1) return;
    setFamilyMembers(familyMembers.filter((_, i) => i !== idx));
  };

  const handleAddFamilyBundleToCart = () => {
    // Normal price per .big is $7.20, with 35% family discount it's $4.68
    familyMembers.forEach((member) => {
      const full = `${member}-${familyLastName}.big`;
      onAddToCart({
        id: `family-${full}`,
        domainName: full,
        priceUsd: 4.68,
        type: 'single',
      });
    });
    setBundleSuccess(true);
    setTimeout(() => {
      setBundleSuccess(false);
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
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
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF5E36]/10 border border-[#FF5E36]/25 text-[#FFA800] text-xs font-semibold mb-4">
          <Percent className="w-3.5 h-3.5" />
          <span>Exclusive BIGOLEO Promotions & Multi-Asset Discounts</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
          Scale Your Portfolio, Empower Your Family, Claim Free Assets
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          BIGOLEO makes digital identity accessible. From our signature Twin Drop to compounding multi-asset portfolio discounts.
        </p>
      </div>

      {/* 3 Main Promotional Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
      >
        {/* Promo 1: Twin .COM + Free .BIG */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className="p-7 rounded-3xl bg-gradient-to-b from-[#121626] to-[#0c0e17] border border-[#FF5E36]/30 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5E36]/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FF5E36]/10 border border-[#FF5E36]/20 flex items-center justify-center text-[#FFA800] mb-6">
              <Gift className="w-6 h-6 text-[#FFA800]" />
            </div>

            <span className="text-xs font-mono text-[#FF7A50] font-bold block mb-1">
              Permanent BIGOLEO Guarantee
            </span>
            <h3 className="text-2xl font-black text-white mb-3">
              Buy <span className="font-mono text-white">.COM</span> = Free <span className="font-mono text-[#FFA800]">.BIG</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              With every global .com domain registration or marketplace purchase, receive the identical name under our premier .big extension 100% free with instant DNS synchronization.
            </p>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Example: yourbrand.com</span>
                <span className="font-mono font-bold text-white">$14.50</span>
              </div>
              <div className="flex items-center justify-between text-[#FFA800] font-bold">
                <span>+ Twin Gift: yourbrand.big</span>
                <span className="font-mono">$0.00 (FREE)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/8">
            <span className="text-xs text-slate-500 block text-center font-mono">
              Automatically paired in checkout when registering any .com
            </span>
          </div>
        </motion.div>

        {/* Promo 2: Tiered Multi-Domain Discounts */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className="p-7 rounded-3xl bg-gradient-to-b from-[#121626] to-[#0c0e17] border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 mb-6">
              <Layers className="w-6 h-6 text-[#FFA800]" />
            </div>

            <span className="text-xs font-mono text-[#FFA800] font-bold block mb-1">
              Volume Acquisition Savings
            </span>
            <h3 className="text-2xl font-black text-white mb-3">
              Up to 25% Off Bundles
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              Buying multiple domains for your brand defensive moat, subsidiary products, or holding group? Discounts apply automatically in your cart.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/6 flex items-center justify-between text-xs">
                <span className="text-slate-300">2 to 4 Domains in cart:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF5E36]/15 text-[#FFA800] font-bold font-mono">
                  15% OFF Subtotal
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/6 flex items-center justify-between text-xs">
                <span className="text-slate-300">5+ Domains in cart:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold font-mono">
                  25% OFF Subtotal
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/8">
            <span className="text-xs text-slate-500 block text-center font-mono">
              Auto-calculated at checkout with transparent breakdown
            </span>
          </div>
        </motion.div>

        {/* Promo 3: Family & Team Ecosystem */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className="p-7 rounded-3xl bg-gradient-to-b from-[#121626] to-[#0c0e17] border border-[#FFA800]/30 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA800]/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFA800]/10 border border-[#FFA800]/25 flex items-center justify-center text-[#FFA800] mb-6">
              <Users className="w-6 h-6 text-[#FFA800]" />
            </div>

            <span className="text-xs font-mono text-[#FFA800] font-bold block mb-1">
              Family & Close Circle Pack
            </span>
            <h3 className="text-2xl font-black text-white mb-3">
              35% Off Family Sets
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              Give every family member their permanent digital home (e.g. alex-miller.big, sarah-miller.big) under one linked portfolio with a huge 35% discount.
            </p>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 line-through">
                <span>Standard individual price</span>
                <span>$7.20 / domain</span>
              </div>
              <div className="flex items-center justify-between text-[#FFA800] font-bold text-sm">
                <span>Family Pack Price</span>
                <span>$4.68 / domain</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/8">
            <span className="text-xs text-slate-500 block text-center font-mono">
              Configure below in our interactive Family Pack Builder
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Interactive Family Pack Builder Tool */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#10121d] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.08]">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FFA800]" />
              <span>Interactive Family Domain Pack Builder</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Customize family member first names with your shared surname to generate linked .big web spaces.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Bundle Price (35% OFF):</span>
            <span className="text-xl sm:text-2xl font-black text-[#FFA800] font-mono tabular-nums">
              {formatUsd(familyMembers.length * 4.68)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Family Surname:
            </label>
            <input
              type="text"
              value={familyLastName}
              onChange={(e) => setFamilyLastName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
              placeholder="e.g. miller, reynolds, adams"
              className="w-full bg-[#08090e] border border-white/12 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#FF5E36]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Add Family Member First Name:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
                placeholder="e.g. emma, josh, olivia"
                className="flex-1 bg-[#08090e] border border-white/12 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#FF5E36]"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleAddMember}
                className="px-5 py-2.5 bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Add
              </motion.button>
            </div>
          </div>
        </div>

        {/* Member tags preview */}
        <div className="mb-6">
          <span className="text-xs text-slate-400 block mb-2">
            Domains included in this family bundle ({familyMembers.length} domains):
          </span>
          <div className="flex flex-wrap gap-2">
            {familyMembers.map((member, idx) => (
              <div
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-[#FFA800]/30 text-white text-xs font-mono flex items-center gap-2"
              >
                <span>{member}-{familyLastName}.big</span>
                {familyMembers.length > 1 && (
                  <button
                    onClick={() => handleRemoveMember(idx)}
                    className="text-slate-400 hover:text-rose-400 text-sm font-bold ml-1 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
          <div className="text-xs text-slate-400 font-mono">
            {familyMembers.length} domains • $4.68/each • Instant Escrow Provisioning
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <AnimatePresence>
              {bundleSuccess && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-emerald-400 flex items-center gap-1 font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleAddFamilyBundleToCart}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] hover:from-[#f0532b] hover:to-[#e67c00] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#FF5E36]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4" />
              <span>Add Family Pack to Cart (35% Off)</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
