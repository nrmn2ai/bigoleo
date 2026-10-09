import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartItems,
  onOpenCart,
  onOpenSearch,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#07080e]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark with SaaSTech Flame Mark */}
        <button
          onClick={() => setActiveTab('explore')}
          className="text-xl sm:text-2xl font-black tracking-tight text-white hover:text-[#FF7A50] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 group cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5E36] via-[#FF7A30] to-[#FFA800] flex items-center justify-center text-white text-xs font-black shadow-lg shadow-[#FF5E36]/35 group-hover:scale-105 transition-transform">
            B
          </span>
          <span className="font-extrabold tracking-wider font-['Space_Grotesk',sans-serif]">BIGOLEO</span>
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 cursor-pointer ${
              activeTab === 'explore'
                ? 'text-white border-b-2 border-[#FF5E36] font-semibold'
                : 'hover:text-white'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('auctions')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 cursor-pointer ${
              activeTab === 'auctions'
                ? 'text-white border-b-2 border-[#FF5E36] font-semibold'
                : 'hover:text-white'
            }`}
          >
            Live Auctions
          </button>
          <button
            onClick={() => setActiveTab('scrabble')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'scrabble'
                ? 'text-white border-b-2 border-[#FFA800] font-semibold'
                : 'hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFA800]" />
            Word Scrabble Lab
          </button>
          <button
            onClick={() => setActiveTab('custom-naming')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 cursor-pointer ${
              activeTab === 'custom-naming'
                ? 'text-white border-b-2 border-[#FF5E36] font-semibold'
                : 'hover:text-white'
            }`}
          >
            Custom Naming
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 cursor-pointer ${
              activeTab === 'promotions'
                ? 'text-white border-b-2 border-[#FF5E36] font-semibold'
                : 'hover:text-white'
            }`}
          >
            Bundles & Free .BIG
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Cart Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white bg-white/[0.03] transition-colors cursor-pointer"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF5E36] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0a0b11]">
                {cartItems.length}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSearch}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] hover:from-[#f0532b] hover:to-[#e67c00] rounded-xl shadow-lg shadow-[#FF5E36]/30 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            Register Domain
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex items-center justify-around py-2.5 px-3 border-t border-white/[0.08] bg-[#07080e]/95 backdrop-blur-xl overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('explore')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'explore' ? 'bg-[#FF5E36]/20 text-[#FF7A50] font-medium' : 'text-slate-400'
          }`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab('auctions')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'auctions' ? 'bg-[#FF5E36]/20 text-[#FF7A50] font-medium' : 'text-slate-400'
          }`}
        >
          Auctions
        </button>
        <button
          onClick={() => setActiveTab('scrabble')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1 cursor-pointer ${
            activeTab === 'scrabble' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400'
          }`}
        >
          Scrabble Lab
        </button>
        <button
          onClick={() => setActiveTab('custom-naming')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'custom-naming' ? 'bg-[#FF5E36]/20 text-[#FF7A50] font-medium' : 'text-slate-400'
          }`}
        >
          Custom Naming
        </button>
        <button
          onClick={() => setActiveTab('promotions')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
            activeTab === 'promotions' ? 'bg-[#FF5E36]/20 text-[#FF7A50] font-medium' : 'text-slate-400'
          }`}
        >
          Bundles
        </button>
      </div>
    </header>
  );
};
