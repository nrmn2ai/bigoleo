import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  Trash2, 
  Gift, 
  ShieldCheck, 
  CheckCircle2, 
  Percent
} from 'lucide-react';
import { CartItem } from '../types';
import { formatUsd } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  // Paid items
  const paidItems = cartItems.filter((i) => !i.isFreeGift);
  const freeItems = cartItems.filter((i) => i.isFreeGift);

  const subtotalUsd = paidItems.reduce((acc, i) => acc + i.priceUsd, 0);

  // Bundle discount logic: 2-4 items => 15%, 5+ items => 25%
  let discountPercent = 0;
  if (paidItems.length >= 5) {
    discountPercent = 25;
  } else if (paidItems.length >= 2) {
    discountPercent = 15;
  }

  const discountAmountUsd = Math.round(((subtotalUsd * discountPercent) / 100) * 100) / 100;
  const finalTotalUsd = Math.max(0, subtotalUsd - discountAmountUsd);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {}
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e101a] border-l border-white/10 shadow-2xl flex flex-col justify-between p-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">BIGOLEO Order Bag</h3>
                <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                  {cartItems.length} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            {checkoutComplete ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-white mb-2">Order Confirmed!</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto mb-6">
                  Escrow tracking contract generated. All purchased domains and matching free .big twin assets have been assigned to your profile.
                </p>
                <button
                  onClick={() => {
                    onClearCart();
                    setCheckoutComplete(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] text-slate-500 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Your bag is empty</p>
                <p className="text-xs text-slate-500 mt-1">
                  Search for a domain, create one in the Scrabble Lab, or bid on live auctions to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                {/* Active discount tag indicator */}
                {discountPercent > 0 && (
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>
                      Multi-asset bundle discount ({discountPercent}%) automatically applied!
                    </span>
                  </div>
                )}

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      item.isFreeGift
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : 'bg-white/[0.03] border-white/6'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.isFreeGift ? (
                        <Gift className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                      )}

                      <div>
                        <div className="font-mono text-sm font-bold text-white">
                          {item.domainName}
                        </div>
                        {item.isFreeGift ? (
                          <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                            <span>Exclusive BIGOLEO Twin Gift</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 font-mono">
                            {formatUsd(item.priceUsd)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.isFreeGift ? (
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          $0.00 (FREE)
                        </span>
                      ) : (
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {!checkoutComplete && cartItems.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-200">{formatUsd(subtotalUsd)}</span>
                </div>
                {discountAmountUsd > 0 && (
                  <div className="flex justify-between text-purple-400 font-medium">
                    <span>Bundle Discount ({discountPercent}%):</span>
                    <span className="font-mono">-{formatUsd(discountAmountUsd)}</span>
                  </div>
                )}
                {freeItems.length > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Twin .BIG Gift Savings:</span>
                    <span className="font-mono">100% Free ({freeItems.length} items)</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/5">
                  <span>Total Amount Due:</span>
                  <span className="font-mono text-base text-indigo-300">{formatUsd(finalTotalUsd)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isCheckingOut ? 'Securing Escrow Contract...' : 'Complete Escrow Checkout'}
                </span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Backed by BIGOLEO 72-Hour Registry Escrow Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
