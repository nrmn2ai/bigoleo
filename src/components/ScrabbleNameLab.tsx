import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Shuffle, 
  RotateCcw, 
  CheckCircle, 
  Award, 
  Coins, 
  ShoppingBag, 
  Wand2, 
  Zap, 
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrabbleLetter, BoardEvaluationResult, CartItem } from '../types';
import { SCRABBLE_SCORES, textToScrabbleTiles } from '../data/scrabbleWords';
import { formatUsd } from '../utils/formatters';

interface ScrabbleNameLabProps {
  onAddToCart: (item: CartItem) => void;
  cartItems: CartItem[];
}

export const ScrabbleNameLab: React.FC<ScrabbleNameLabProps> = ({
  onAddToCart,
  cartItems,
}) => {
  // Base input text to supply the letter pool
  const [sourceWords, setSourceWords] = useState('delintm');
  const [selectedTld, setSelectedTld] = useState('.com');
  
  // Tiles split into Name Builder Row (top) and Letter Tile Rack (bottom)
  const [builderTiles, setBuilderTiles] = useState<ScrabbleLetter[]>([]);
  const [rackTiles, setRackTiles] = useState<ScrabbleLetter[]>([]);
  const [jokersAvailable, setJokersAvailable] = useState(2);

  // Appraisal & Buyout state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<BoardEvaluationResult | null>(null);
  const [showPayoutSuccess, setShowPayoutSuccess] = useState(false);

  // Initialize pool from source words
  const initLetterPool = (text: string) => {
    const rawTiles = textToScrabbleTiles(text);
    if (rawTiles.length >= 5) {
      setBuilderTiles(rawTiles.slice(0, 5));
      setRackTiles(rawTiles.slice(5));
    } else {
      setBuilderTiles(rawTiles);
      setRackTiles([]);
    }
    setEvaluationResult(null);
    setShowPayoutSuccess(false);
  };

  useEffect(() => {
    initLetterPool(sourceWords);
  }, []);

  // Formed word string from builder tiles
  const formedWord = useMemo(() => {
    return builderTiles.map((t) => t.char.toLowerCase()).join('');
  }, [builderTiles]);

  // Current letters score in the builder row
  const currentLettersScore = useMemo(() => {
    return builderTiles.reduce((acc, t) => acc + t.points, 0);
  }, [builderTiles]);

  // Total available letters in play
  const totalLettersCount = builderTiles.length + rackTiles.length;

  // Dynamic Brand Power calculation (0 to 100)
  const brandPower = useMemo(() => {
    if (formedWord.length === 0) return 0;
    const len = formedWord.length;
    let score = 40;
    if (len >= 4 && len <= 7) score += 25;
    else if (len >= 3 && len <= 8) score += 15;

    const vowels = formedWord.split('').filter((c) => ['a', 'e', 'i', 'o', 'u', 'y'].includes(c)).length;
    const vowelRatio = vowels / len;
    if (vowelRatio >= 0.3 && vowelRatio <= 0.6) score += 20;

    score += Math.min(15, currentLettersScore);
    return Math.min(98, Math.max(20, score));
  }, [formedWord, currentLettersScore]);

  // Brand Power quality badge
  const brandQualityLabel = useMemo(() => {
    if (brandPower >= 85) return 'Elite';
    if (brandPower >= 70) return 'Strong';
    if (brandPower >= 55) return 'Good';
    return 'Moderate';
  }, [brandPower]);

  // Dynamic suggestions generated from available characters
  const suggestedCombos = useMemo(() => {
    const allChars = [...builderTiles, ...rackTiles].map((t) => t.char.toLowerCase());
    const candidates = [
      'mindel', 'demint', 'delint', 'midel', 'deint', 
      'mintel', 'miel', 'minel', 'linted', 'tined', 'melt', 'denim'
    ];

    const filtered = candidates.filter((word) => {
      const charPool = [...allChars];
      return word.split('').every((ch) => {
        const idx = charPool.indexOf(ch);
        if (idx !== -1) {
          charPool.splice(idx, 1);
          return true;
        }
        return false;
      });
    });

    return filtered.length >= 4 
      ? filtered 
      : ['mindel', 'demint', 'delint', 'midel', 'deint', 'mintel', 'miel', 'minel'];
  }, [builderTiles, rackTiles]);

  // Move tile from Rack to Builder Row
  const handleTileClickToBuilder = (tile: ScrabbleLetter) => {
    setRackTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setBuilderTiles((prev) => [...prev, tile]);
    setEvaluationResult(null);
  };

  // Move tile from Builder Row back to Rack
  const handleTileClickToRack = (tile: ScrabbleLetter) => {
    setBuilderTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setRackTiles((prev) => [...prev, tile]);
    setEvaluationResult(null);
  };

  // Anagram / Shuffle the Builder Row letters
  const handleAnagramName = () => {
    if (builderTiles.length <= 1) return;
    const shuffled = [...builderTiles].sort(() => Math.random() - 0.5);
    setBuilderTiles(shuffled);
    setEvaluationResult(null);
  };

  // Shuffle the Rack tiles
  const handleShuffleRack = () => {
    const shuffled = [...rackTiles].sort(() => Math.random() - 0.5);
    setRackTiles(shuffled);
  };

  // Clear all builder tiles back to rack
  const handleClearAll = () => {
    setRackTiles((prev) => [...prev, ...builderTiles]);
    setBuilderTiles([]);
    setEvaluationResult(null);
  };

  // Add Wildcard / Joker tile
  const handleAddJoker = () => {
    if (jokersAvailable <= 0) {
      alert('No Wildcard Joker tiles remaining for this session.');
      return;
    }
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const randomVowel = vowels[Math.floor(Math.random() * vowels.length)];
    const newJokerTile: ScrabbleLetter = {
      id: `joker-${Date.now()}`,
      char: randomVowel,
      points: 0,
      isVowel: true,
    };
    setBuilderTiles((prev) => [...prev, newJokerTile]);
    setJokersAvailable((prev) => prev - 1);
  };

  // Click on a Suggested Combination to automatically assemble it
  const handleApplySuggestion = (word: string) => {
    const allAvailable = [...builderTiles, ...rackTiles];
    const newBuilder: ScrabbleLetter[] = [];
    const remainingPool = [...allAvailable];

    word.split('').forEach((ch) => {
      const foundIdx = remainingPool.findIndex((t) => t.char.toLowerCase() === ch.toLowerCase());
      if (foundIdx !== -1) {
        newBuilder.push(remainingPool[foundIdx]);
        remainingPool.splice(foundIdx, 1);
      } else {
        newBuilder.push({
          id: `suggest-${ch}-${Math.random().toString(36).substring(2, 6)}`,
          char: ch.toUpperCase(),
          points: SCRABBLE_SCORES[ch.toLowerCase()] || 1,
          isVowel: ['a', 'e', 'i', 'o', 'u'].includes(ch.toLowerCase()),
        });
      }
    });

    setBuilderTiles(newBuilder);
    setRackTiles(remainingPool);
    setEvaluationResult(null);
  };

  // Full Domain Candidate
  const currentDomainCandidate = `${formedWord || 'brand'}${selectedTld}`;
  const isAvailableMock = formedWord.length % 2 !== 0 || formedWord.length >= 5;

  // Senior Board Appraisal Submission
  const handleSubmitToSeniorBoard = () => {
    if (formedWord.length < 3) {
      alert('Please assemble at least 3 letters in the Name Builder row.');
      return;
    }

    setIsEvaluating(true);
    setEvaluationResult(null);
    setShowPayoutSuccess(false);

    setTimeout(() => {
      const luckMultiplier = +(1.3 + Math.random() * 2.7).toFixed(1);
      const baseValueUsd = Math.floor(currentLettersScore * 35 + brandPower * 12 + Math.random() * 300);
      const finalOfferUsd = Math.round((baseValueUsd * luckMultiplier) / 25) * 25 + 250;

      const score = Math.min(99, Math.floor(65 + (brandPower * 0.35)));

      let rarity: BoardEvaluationResult['rarityLevel'] = 'Standard';
      let rarityColor = 'text-slate-300';
      if (score >= 90) {
        rarity = 'Mythic';
        rarityColor = 'text-[#FFA800]';
      } else if (score >= 80) {
        rarity = 'Epic';
        rarityColor = 'text-[#FF5E36]';
      } else if (score >= 70) {
        rarity = 'Rare';
        rarityColor = 'text-cyan-400';
      }

      const result: BoardEvaluationResult = {
        score,
        luckFactor: luckMultiplier,
        verdictTitle: score > 75 ? 'BIGOLEO Board Loves This Name! 🔥' : 'Senior Board Cash Buyout Qualified',
        verdictDescription: `Phonetic synergy index of ${brandPower}%, Scrabble tile weight of ${currentLettersScore} pts, and your luck multiplier of ${luckMultiplier}x unlocks a premium buyout opportunity.`,
        cashOfferUsd: finalOfferUsd,
        rarityLevel: rarity,
        rarityColor,
        acceptedByBigoleo: true,
      };

      setEvaluationResult(result);
      setIsEvaluating(false);

      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 1200);
  };

  const handleAcceptBuyout = () => {
    setShowPayoutSuccess(true);
    try {
      confetti({
        particleCount: 110,
        spread: 95,
        origin: { y: 0.5 },
      });
    } catch (e) {}
  };

  const isDomainInCart = cartItems.some((c) => c.domainName === currentDomainCandidate);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header: 2. Arrange Letters & Forge Brand Name */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF5E36]/10 border border-[#FF5E36]/30 text-[#FFA800] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tactile Wordcraft & Anagram Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="text-[#FF5E36] font-mono">2.</span>
            <span>Arrange Letters & Build Brand Name</span>
          </h2>
        </div>

        {/* Change Root Words Input pill */}
        <div className="flex items-center gap-2 bg-[#10121d] border border-white/10 rounded-2xl p-1.5 pl-3">
          <span className="text-xs text-slate-400 font-medium">Root Letters:</span>
          <input
            type="text"
            value={sourceWords}
            onChange={(e) => setSourceWords(e.target.value)}
            className="bg-[#0a0b11] border border-white/10 rounded-xl px-3 py-1 text-white font-mono text-xs focus:outline-none focus:border-[#FF5E36] w-32"
          />
          <button
            onClick={() => initLetterPool(sourceWords)}
            className="px-3 py-1 bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] hover:opacity-95 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Reset Pool
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column (Metrics & Suggestions) + Right Column (Tactile Scrabble Board) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column (4 cols): Brand Power & Suggested Combinations */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Brand Power Card (matching screenshot top-left card with SaaSTech styling) */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#10121d] border border-white/[0.08] rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl sm:text-5xl font-black font-mono text-[#FFA800] tracking-tight">
                {brandPower}
              </span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Brand Power
              </span>
            </div>

            {/* Progress Bar with SaaSTech Flame Gradient */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-4 p-0.5">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#FF5E36] to-[#FFA800] rounded-full shadow-sm shadow-[#FF5E36]/50"
                initial={{ width: 0 }}
                animate={{ width: `${brandPower}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>

            {/* Bottom info row */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span className="font-mono">
                Letters Score: <strong className="text-white font-bold">{currentLettersScore}</strong>
              </span>
              <span className="font-semibold text-[#FFA800] bg-[#FFA800]/10 border border-[#FFA800]/25 px-2.5 py-0.5 rounded">
                {brandQualityLabel}
              </span>
            </div>
          </motion.div>

          {/* Card 2: Suggested Combinations (matching screenshot bottom-left card) */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#10121d] border border-white/[0.08] rounded-3xl p-6 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#FFA800]" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Suggested Combinations
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Click any word below to automatically assemble its letters into the Name Builder row; then adjust to your taste!
            </p>

            {/* Pill Chips for Combinations */}
            <div className="flex flex-wrap gap-2">
              {suggestedCombos.map((combo, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleApplySuggestion(combo)}
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#FF5E36]/20 border border-white/10 hover:border-[#FF5E36]/40 text-slate-200 hover:text-white font-mono text-xs font-medium transition-colors cursor-pointer shadow-sm"
                >
                  {combo}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (8 cols): The Master Scrabble Board (matching screenshot right dark board) */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-8 bg-gradient-to-b from-[#141626] to-[#0c0e17] border border-[#FF5E36]/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between"
        >
          {/* Subtle back illumination glow in flame orange */}
          <div className="absolute top-0 right-1/4 w-80 h-40 bg-[#FF5E36]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Top Row: Counter & Name Builder Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-400">
                {builderTiles.length} of {totalLettersCount} letters
              </span>
              <span className="text-xs font-bold text-[#FFA800] tracking-wider">
                Name Builder Row
              </span>
            </div>

            {/* Dashed Name Builder Enclosure with tactile cream Scrabble tiles */}
            <div className="border-2 border-dashed border-[#FFA800]/25 hover:border-[#FFA800]/50 rounded-2xl p-4 sm:p-5 min-h-[96px] bg-white/[0.02] flex flex-wrap items-center justify-center sm:justify-start gap-2.5 transition-colors mb-4">
              <AnimatePresence>
                {builderTiles.length === 0 ? (
                  <div className="text-xs text-slate-500 font-mono py-2 text-center w-full">
                    Click tiles from the rack below to place them here...
                  </div>
                ) : (
                  builderTiles.map((tile) => (
                    <motion.div
                      key={tile.id}
                      layout
                      initial={{ scale: 0.8, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0, y: -10 }}
                      whileHover={{ scale: 1.08, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTileClickToRack(tile)}
                      className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-gradient-to-b from-[#fffaf0] to-[#edd9b9] border border-[#d6be99] text-[#2d2315] shadow-lg shadow-black/40 flex flex-col justify-between p-1.5 sm:p-2 cursor-pointer select-none transition-shadow hover:shadow-[#FF5E36]/30"
                      title="Click to return to Letter Rack"
                    >
                      <div className="text-center font-black font-mono text-xl sm:text-2xl leading-none mt-1">
                        {tile.char}
                      </div>
                      <div className="text-right font-mono text-[9px] sm:text-[10px] font-bold text-[#8c7453] leading-none self-end">
                        {tile.points}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Domain Name Visual Display (matching dlenm.com with neon lime highlight from screenshot) */}
            <div className="mb-8 flex items-baseline gap-2">
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-wide">
                <span className="text-white">{formedWord || 'yourbrand'}</span>
                <span className="text-[#a3e635] drop-shadow-[0_0_12px_rgba(163,230,53,0.35)]">
                  {selectedTld}
                </span>
              </div>
              <div className="inline-flex rounded-lg bg-black/40 p-1 border border-white/10 ml-2">
                {['.com', '.big', '.io', '.ai'].map((tld) => (
                  <button
                    key={tld}
                    onClick={() => setSelectedTld(tld)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                      selectedTld === tld
                        ? 'bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tld}
                  </button>
                ))}
              </div>
            </div>

            {/* Middle Row: Letter Tile Rack Label */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 tracking-wider">
                Letter Tile Rack
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Click a tile to place in Builder
              </span>
            </div>

            {/* Letter Tile Rack Container */}
            <div className="min-h-[75px] flex flex-wrap items-center gap-2.5 mb-8">
              <AnimatePresence>
                {rackTiles.length === 0 ? (
                  <div className="text-xs text-slate-500 font-mono py-2">
                    All letters currently placed in Builder Row.
                  </div>
                ) : (
                  rackTiles.map((tile) => (
                    <motion.div
                      key={tile.id}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1.08, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTileClickToBuilder(tile)}
                      className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-gradient-to-b from-[#fffaf0] to-[#edd9b9] border border-[#d6be99] text-[#2d2315] shadow-lg shadow-black/40 flex flex-col justify-between p-1.5 sm:p-2 cursor-pointer select-none transition-shadow hover:shadow-[#FF5E36]/30"
                      title="Click to move up to Name Builder"
                    >
                      <div className="text-center font-black font-mono text-xl sm:text-2xl leading-none mt-1">
                        {tile.char}
                      </div>
                      <div className="text-right font-mono text-[9px] sm:text-[10px] font-bold text-[#8c7453] leading-none self-end">
                        {tile.points}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Action Toolbar (matching screenshot pill buttons) */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Shuffle Letters Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleShuffleRack}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#FFA800]" />
                <span>Shuffle Letters</span>
              </motion.button>

              {/* Anagram / Mashup Name Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAnagramName}
                className="px-4 py-2 rounded-xl bg-[#FF5E36]/20 hover:bg-[#FF5E36]/30 text-[#FF8A00] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#FF5E36]/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFA800]" />
                <span>Mashup Anagram</span>
              </motion.button>

              {/* Wildcard Joker Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddJoker}
                disabled={jokersAvailable <= 0}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-500/30 disabled:opacity-40"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Wildcard Joker ({jokersAvailable})</span>
              </motion.button>
            </div>

            {/* Clear All Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleClearAll}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-white/8 hover:border-rose-500/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Live Availability Action Bar & Senior Board Buyout Action */}
      <div className="bg-[#10121d] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-white">
              Domain Status for <span className="font-mono text-[#FFA800]">{currentDomainCandidate}</span>
            </span>
            {isAvailableMock ? (
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Available to Claim
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Active Valuation
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {selectedTld === '.com' 
              ? 'Includes free matching .big domain automatically at checkout!'
              : 'Direct registration with instant DNS and escrow protection.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Claim For Myself */}
          {isAvailableMock && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!isDomainInCart) {
                  onAddToCart({
                    id: `scrabble-${currentDomainCandidate}`,
                    domainName: currentDomainCandidate,
                    priceUsd: selectedTld === '.com' ? 14.5 : 7.2,
                    type: 'single',
                  });
                  if (selectedTld === '.com') {
                    onAddToCart({
                      id: `gift-${formedWord}.big`,
                      domainName: `${formedWord}.big`,
                      priceUsd: 0,
                      isFreeGift: true,
                      giftForDomain: currentDomainCandidate,
                      type: 'single',
                    });
                  }
                }
              }}
              disabled={isDomainInCart}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#FFA800]" />
              <span>{isDomainInCart ? 'In Bag' : 'Register for Myself'}</span>
            </motion.button>
          )}

          {/* Submit to Senior Board for Cash Buyout */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSubmitToSeniorBoard}
            disabled={isEvaluating || formedWord.length < 3}
            className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF5E36] via-[#FF7A30] to-[#FFA800] hover:opacity-95 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-[#FF5E36]/30 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>
              {isEvaluating ? 'Appraising Brand...' : 'Submit to Senior Board for Cash Buyout!'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Senior Board Appraisal Result Card */}
      <AnimatePresence>
        {evaluationResult && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gradient-to-b from-[#181a2b] to-[#0c0e17] border-2 border-[#FFA800]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFA800]/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFA800]/20 text-[#FFA800] border border-[#FFA800]/30 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Rarity: {evaluationResult.rarityLevel}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Synergy: {evaluationResult.score}/100
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Luck Multiplier: {evaluationResult.luckFactor}x
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {evaluationResult.verdictTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {evaluationResult.verdictDescription}
                </p>
              </div>

              {/* Cash Buyout Valuation Box */}
              <div className="p-4 rounded-2xl bg-[#FFA800]/10 border border-[#FFA800]/30 text-center md:text-right min-w-[220px]">
                <span className="text-xs text-[#FFA800] font-medium block">
                  BIGOLEO Cash Buyout Offer:
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#FFA800] font-mono tabular-nums my-1">
                  {formatUsd(evaluationResult.cashOfferUsd)}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Instant Escrow Wire
                </div>
              </div>
            </div>

            {/* Action options after evaluation */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-4 h-4 text-[#FFA800] shrink-0" />
                <span>
                  If accepted, BIGOLEO acquires the name from you directly and deposits funds into your escrow balance.
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!showPayoutSuccess ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleAcceptBuyout}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Coins className="w-4 h-4" />
                      <span>Accept Offer & Cash Out</span>
                    </motion.button>

                    <button
                      onClick={() => {
                        onAddToCart({
                          id: `keep-${currentDomainCandidate}`,
                          domainName: currentDomainCandidate,
                          priceUsd: selectedTld === '.com' ? 14.5 : 7.2,
                          type: 'single',
                        });
                        alert(`Domain ${currentDomainCandidate} added to your bag so you can retain complete private ownership!`);
                      }}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Keep & Register Myself
                    </button>
                  </>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>
                      Congratulations! BIGOLEO acquisition contract initiated. {formatUsd(evaluationResult.cashOfferUsd)} locked into your instant escrow balance!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
