import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, PlusCircle, ShieldCheck } from 'lucide-react';
import { DomainItem } from '../types';
import { formatUsd } from '../utils/formatters';

interface ListDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDomain: (domain: DomainItem) => void;
}

export const ListDomainModal: React.FC<ListDomainModalProps> = ({
  isOpen,
  onClose,
  onAddDomain,
}) => {
  const [domainName, setDomainName] = useState('');
  const [priceUsd, setPriceUsd] = useState<number>(1200);
  const [category, setCategory] = useState<DomainItem['category']>('tech');
  const [description, setDescription] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const escrowFeeRate = 0.03; // 3%
  const feeUsd = Math.round(priceUsd * escrowFeeRate);
  const netEarningsUsd = priceUsd - feeUsd;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim()) {
      setErrorMessage('Please enter a valid domain name.');
      return;
    }

    const clean = domainName.trim().toLowerCase().replace(/https?:\/\//, '').replace(/\/.*$/, '');
    const parts = clean.split('.');
    const ext = parts.length > 1 ? `.${parts[parts.length - 1]}` : '.com';
    const main = parts[0] || 'domain';

    const newDomain: DomainItem = {
      id: `user-${Date.now()}`,
      name: main,
      tld: ext,
      fullName: clean,
      priceUsd,
      category,
      description: description || 'Verified user listing with full BIGOLEO escrow protection.',
      views: 1,
      freeBigPairIncluded: ext === '.com',
      status: 'available',
    };

    onAddDomain(newDomain);
    setSuccessMessage(`Domain ${clean} successfully listed on BIGOLEO Marketplace!`);
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
      setDomainName('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#121524] border border-[#FF5E36]/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-[#FFA800] uppercase tracking-wider">Direct Marketplace Listing</span>
            <h3 className="text-xl font-black text-white">
              List Your Domain on BIGOLEO
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {successMessage ? (
          <div className="py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Listing Active!</h4>
            <p className="text-slate-400 text-xs">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Domain Name: <span className="text-[#FF5E36]">*</span>
              </label>
              <input
                type="text"
                value={domainName}
                onChange={(e) => {
                  setDomainName(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="e.g. brandflux.com or nextflow.io"
                className="w-full bg-[#08090e] border border-white/12 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#FF5E36]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Asking Price (USD):
                </label>
                <input
                  type="number"
                  step={50}
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(Number(e.target.value))}
                  className="w-full bg-[#08090e] border border-white/12 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#FF5E36]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#08090e] border border-white/12 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none"
                >
                  <option value="tech">Tech & SaaS</option>
                  <option value="ai">AI & Robotics</option>
                  <option value="short">Short 3-4L</option>
                  <option value="brandable">Brandable</option>
                  <option value="creative">Creative Studio</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Listing Description & Domain Pedigree:
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Highly memorable 5-letter domain with clean history, perfect for next-gen motion design tools..."
                className="w-full bg-[#08090e] border border-white/12 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#FF5E36] resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Seller Contact Email:
              </label>
              <input
                type="email"
                value={sellerEmail}
                onChange={(e) => setSellerEmail(e.target.value)}
                placeholder="founder@example.com"
                className="w-full bg-[#08090e] border border-white/12 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none"
              />
            </div>

            {/* Transparent Escrow Calculator */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/8 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>BIGOLEO Escrow Fee (3%):</span>
                <span className="font-mono text-slate-300">{formatUsd(feeUsd)}</span>
              </div>
              <div className="flex justify-between text-[#FFA800] font-bold pt-1 border-t border-white/5">
                <span>Your Net Payout:</span>
                <span className="font-mono text-sm">{formatUsd(netEarningsUsd)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#FF5E36]/30 transition-all cursor-pointer"
              >
                Publish Listing
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
