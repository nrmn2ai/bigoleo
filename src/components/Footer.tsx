import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080e]/90 backdrop-blur-xl py-14 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                B
              </span>
              <span className="text-lg font-extrabold text-white tracking-wider font-['Space_Grotesk',sans-serif]">
                BIGOLEO
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              The unified domain exchange, live bidding pavilion, tactile word-coining lab with instant cash buyout offers, and bespoke enterprise identity concierge.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verifiable Escrow Protocol Active</span>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('explore')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Curated Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('auctions')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Live Auction Pavilion
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('scrabble')}
                  className="hover:text-white transition-colors cursor-pointer text-amber-300"
                >
                  Word Scrabble & Buyout Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('custom-naming')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Custom Brand Naming
                </button>
              </li>
            </ul>
          </div>

          {/* Offers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Offers & Incentives
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('promotions')}
                  className="hover:text-white transition-colors cursor-pointer text-indigo-300"
                >
                  Free .BIG Twin with Every .COM
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('promotions')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Family & Team 35% Discount Pack
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('promotions')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tiered 15% - 25% Portfolio Discounts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('scrabble')}
                  className="hover:text-white transition-colors cursor-pointer text-amber-400"
                >
                  Instant Cash Buyout Appraisals
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Registry Standards
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Every ownership transfer is secured via accredited global ICANN registrar protocols with zero broker friction and 72-hour escrow guarantee.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              24/7 Desk: hello@bigoleo.com
            </div>
          </div>
        </div>

        {/* Quiet copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 BIGOLEO Systems Inc. All brand assets and trademark protocols reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with kinetic motion & precision craft</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-1" />
            <span>for digital founders worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
