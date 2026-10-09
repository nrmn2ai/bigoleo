/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DomainSearchBar } from './components/DomainSearchBar';
import { MarketplaceSection } from './components/MarketplaceSection';
import { AuctionsSection } from './components/AuctionsSection';
import { ScrabbleNameLab } from './components/ScrabbleNameLab';
import { CustomNamingConcierge } from './components/CustomNamingConcierge';
import { PromotionsSection } from './components/PromotionsSection';
import { CartDrawer } from './components/CartDrawer';
import { ListDomainModal } from './components/ListDomainModal';
import { Footer } from './components/Footer';
import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';
import { PartnerMarquee, HowItWorksSection, FaqSection, CtaBanner } from './components/SaasTechSections';
import { INITIAL_DOMAINS } from './data/domains';
import { DomainItem, CartItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [domains, setDomains] = useState<DomainItem[]>(INITIAL_DOMAINS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isListDomainModalOpen, setIsListDomainModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add item to cart with duplicate prevention
  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      if (prev.some((item) => item.domainName === newItem.domainName)) {
        return prev;
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => {
      const target = prev.find((i) => i.id === id);
      // If user removes a paid .com domain, also remove its free .big gift
      if (target && !target.isFreeGift) {
        return prev.filter(
          (i) => i.id !== id && i.giftForDomain !== target.domainName
        );
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Add new domain listed by user
  const handleAddNewDomain = (domain: DomainItem) => {
    setDomains((prev) => [domain, ...prev]);
  };

  // Handle placing bids in live auctions
  const handlePlaceBid = (
    domainId: string,
    newBidUsd: number,
    bidderName: string
  ) => {
    setDomains((prev) =>
      prev.map((d) => {
        if (d.id === domainId && d.auctionDetails) {
          return {
            ...d,
            auctionDetails: {
              ...d.auctionDetails,
              currentBidUsd: newBidUsd,
              totalBids: d.auctionDetails.totalBids + 1,
              highestBidder: bidderName,
            },
          };
        }
        return d;
      })
    );
  };

  const handleSearchTrigger = (term: string) => {
    setSearchQuery(term);
    const searchElement = document.getElementById('search-checker-section');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07080e] relative text-[#f1f5f9] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FF5E36]/30 selection:text-white">
      {/* Smooth Brand-Related Ambient Kinetic Atmosphere */}
      <BackgroundAtmosphere />

      {/* Main Foreground Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 3-Zone Top Navigation Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cartItems={cartItems}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => {
            const el = document.getElementById('search-checker-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

      <main>
        {/* Kinetic Hero Section */}
        <HeroSection
          onSearchDomain={handleSearchTrigger}
          onNavigateTab={setActiveTab}
        />

        {/* SaaSTech Partner Marquee Ticker */}
        <PartnerMarquee />

        {/* Instant Domain Search & Availability Checker */}
        <section id="search-checker-section" className="scroll-mt-24 px-4 sm:px-6">
          <DomainSearchBar
            initialSearch={searchQuery}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
          />
        </section>

        {/* Dynamic Viewport Sections with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'explore' && (
              <MarketplaceSection
                domains={domains}
                onAddToCart={handleAddToCart}
                cartItems={cartItems}
                onOpenListDomainModal={() => setIsListDomainModalOpen(true)}
              />
            )}

            {activeTab === 'auctions' && (
              <AuctionsSection
                domains={domains}
                onPlaceBid={handlePlaceBid}
              />
            )}

            {activeTab === 'scrabble' && (
              <ScrabbleNameLab
                onAddToCart={handleAddToCart}
                cartItems={cartItems}
              />
            )}

            {activeTab === 'custom-naming' && (
              <CustomNamingConcierge
                onAddToCart={handleAddToCart}
                cartItems={cartItems}
              />
            )}

            {activeTab === 'promotions' && (
              <PromotionsSection
                onAddToCart={handleAddToCart}
                cartItems={cartItems}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* SaaSTech Workflow: How It Works */}
        <HowItWorksSection onNavigateTab={setActiveTab} />

        {/* SaaSTech Interactive Accordion FAQ */}
        <FaqSection />

        {/* High-Converting Bottom CTA Banner */}
        <CtaBanner
          onNavigateTab={setActiveTab}
          onOpenSearch={() => {
            const el = document.getElementById('search-checker-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* List Domain Modal */}
      <ListDomainModal
        isOpen={isListDomainModalOpen}
        onClose={() => setIsListDomainModalOpen(false)}
        onAddDomain={handleAddNewDomain}
      />

      {/* Quiet Footer */}
      <Footer onNavigateTab={setActiveTab} />
      </div>
    </div>
  );
}
