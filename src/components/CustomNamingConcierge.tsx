import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  Plus, 
  Cpu, 
  Award,
  RefreshCw
} from 'lucide-react';
import { GeneratedIdea, CartItem } from '../types';
import { formatUsd } from '../utils/formatters';

interface CustomNamingConciergeProps {
  onAddToCart: (item: CartItem) => void;
  cartItems: CartItem[];
}

export const CustomNamingConcierge: React.FC<CustomNamingConciergeProps> = ({
  onAddToCart,
  cartItems,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('tech');
  const [tone, setTone] = useState<'modern' | 'luxury' | 'creative' | 'kinetic' | 'minimal'>('kinetic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [vipOrderPlaced, setVipOrderPlaced] = useState(false);

  const sampleIdeaDatabase: Record<string, GeneratedIdea[]> = {
    tech: [
      {
        name: 'NexusFlow',
        domainName: 'nexusflow.com',
        tld: '.com',
        meaning: 'Intersection of central nexus architecture and uninterrupted data streaming.',
        memorabilityScore: 94,
        isAvailable: true,
        estimatedValueUsd: 1850,
      },
      {
        name: 'Syntra',
        domainName: 'syntra.big',
        tld: '.big',
        meaning: 'Smart synthesis of computational pipelines into a single frictionless API.',
        memorabilityScore: 91,
        isAvailable: true,
        estimatedValueUsd: 780,
      },
      {
        name: 'MindForge',
        domainName: 'mindforge.ai',
        tld: '.ai',
        meaning: 'Foundry of generative cognitive models and intelligent automated reasoning.',
        memorabilityScore: 89,
        isAvailable: true,
        estimatedValueUsd: 1450,
      },
      {
        name: 'VortexAI',
        domainName: 'vortexai.com',
        tld: '.com',
        meaning: 'Dynamic swirling energy applied to ultra-fast inference and high-scale indexing.',
        memorabilityScore: 96,
        isAvailable: true,
        estimatedValueUsd: 2200,
      },
    ],
    creative: [
      {
        name: 'MotionFlux',
        domainName: 'motionflux.com',
        tld: '.com',
        meaning: 'Fluid, kinetic energy crafted for high-end animation studios and visual artists.',
        memorabilityScore: 95,
        isAvailable: true,
        estimatedValueUsd: 1800,
      },
      {
        name: 'PixelZen',
        domainName: 'pixelzen.big',
        tld: '.big',
        meaning: 'Harmonious pixel precision and calm aesthetic clarity for design agencies.',
        memorabilityScore: 88,
        isAvailable: true,
        estimatedValueUsd: 640,
      },
      {
        name: 'FormaCraft',
        domainName: 'formacraft.com',
        tld: '.com',
        meaning: 'Mastery in sculpting digital form, 3D interaction, and brand identity.',
        memorabilityScore: 92,
        isAvailable: true,
        estimatedValueUsd: 1250,
      },
    ],
    general: [
      {
        name: 'Vistara',
        domainName: 'vistara.big',
        tld: '.big',
        meaning: 'Boundless panoramic vision for modern consumer internet enterprises.',
        memorabilityScore: 93,
        isAvailable: true,
        estimatedValueUsd: 890,
      },
      {
        name: 'Kinetics',
        domainName: 'kinetics.big',
        tld: '.big',
        meaning: 'Momentum, agility, and relentless forward motion for modern commerce.',
        memorabilityScore: 97,
        isAvailable: true,
        estimatedValueUsd: 2400,
      },
    ],
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe your business model or project vision first.');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const selected = sampleIdeaDatabase[industry] || sampleIdeaDatabase.tech;
      const baseCustom: GeneratedIdea = {
        name: businessName ? `${businessName.replace(/\s+/g, '')}Hub` : 'NovaCore',
        domainName: `${(businessName || 'novacore').toLowerCase().replace(/[^a-z0-9]/g, '')}.big`,
        tld: '.big',
        meaning: `Engineered from your exact input: "${description.substring(0, 45)}..." with high phonetic harmony.`,
        memorabilityScore: 95,
        isAvailable: true,
        estimatedValueUsd: 850,
      };
      setIdeas([baseCustom, ...selected]);
      setIsGenerating(false);
    }, 1000);
  };

  const handlePlaceVipOrder = () => {
    setVipOrderPlaced(true);
  };

  const isDomainInCart = (domainName: string) => cartItems.some((c) => c.domainName === domainName);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF5E36]/10 border border-[#FF5E36]/30 text-[#FFA800] text-xs font-semibold mb-4">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>BIGOLEO SaaSTech Naming Concierge</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
          Describe Your Business. We Discover Your Golden Domain.
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Whether you are launching a stealth startup or executing a high-stakes corporate rebrand, enter your product thesis and target vibe. BIGOLEO algorithms uncover available, memorable domain names.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Form Container (5 cols) */}
        <div className="lg:col-span-5 bg-[#10121d] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xl h-fit">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#FFA800]" />
            <span>Brand Project Brief</span>
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Working Project Name (Optional):
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Kinetic Logistics, Lumina Studio"
                className="w-full bg-[#0a0b11] border border-white/12 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF5E36]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Describe What You Build & Key Differentiators: <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what you do (e.g. We are building a high-speed motion design automation engine for marketing teams that renders interactive 3D assets in seconds)..."
                className="w-full bg-[#0a0b11] border border-white/12 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-[#FF5E36] resize-none leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Industry Focus:
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-[#0a0b11] border border-white/12 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                >
                  <option value="tech">Software & AI Tech</option>
                  <option value="creative">Creative & Motion Design</option>
                  <option value="general">Commerce & Venture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Desired Brand Tone:
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full bg-[#0a0b11] border border-white/12 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                >
                  <option value="kinetic">Kinetic & High-Energy</option>
                  <option value="modern">Modern & Tech-Forward</option>
                  <option value="luxury">Luxury & Architectural</option>
                  <option value="minimal">Minimalist & Short</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#FF5E36]/30 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Brand Concepts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Available Brand Domains</span>
                </>
              )}
            </button>
          </form>

          {/* VIP Senior Board Box */}
          <div className="mt-6 pt-6 border-t border-white/[0.08]">
            <div className="p-4 rounded-2xl bg-[#FFA800]/10 border border-[#FFA800]/25">
              <div className="flex items-center gap-2 text-[#FFA800] font-bold text-xs mb-1">
                <Award className="w-4 h-4" />
                <span>Bespoke Senior Naming Committee Dossier</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                Want our senior creative brand directors and trademark strategists to host a 1-on-1 naming workshop with complete IP research?
              </p>
              {!vipOrderPlaced ? (
                <button
                  onClick={handlePlaceVipOrder}
                  className="w-full py-2 px-3 rounded-lg bg-[#FFA800] hover:bg-[#e69800] text-slate-950 font-black text-xs transition-colors cursor-pointer"
                >
                  Order Senior VIP Package
                </button>
              ) : (
                <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VIP brief received. A Senior Brand Director will contact you within 2 hours.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ideas Showcase (7 cols) */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Synthesized Concepts For Your Project</span>
              {ideas.length > 0 && (
                <span className="text-xs font-mono text-[#FFA800] bg-[#FFA800]/10 px-2 py-0.5 rounded">
                  {ideas.length} Available Assets
                </span>
              )}
            </h3>
          </div>

          {ideas.length === 0 ? (
            <div className="bg-[#10121d] border border-dashed border-white/12 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-500 mb-4">
                <Lightbulb className="w-7 h-7 text-[#FFA800]" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">No Brief Submitted Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
                Fill in a few sentences about your product vision on the left to activate BIGOLEO's naming engine.
              </p>
              <button
                onClick={() => {
                  setDescription('An AI-driven SaaS motion automation suite for fast scaling tech teams');
                  setIndustry('tech');
                  setTone('kinetic');
                }}
                className="text-xs text-[#FFA800] hover:underline font-medium cursor-pointer"
              >
                Auto-fill with sample SaaS brief
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea, index) => {
                const inCart = isDomainInCart(idea.domainName);

                return (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-[#10121d] border border-white/[0.08] hover:border-[#FF5E36]/40 transition-all shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                        <span className="text-xl font-black font-mono text-white tracking-wide">
                          {idea.domainName}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Available
                        </span>
                        <span className="text-xs font-mono text-[#FFA800] bg-[#FFA800]/10 px-2 py-0.5 rounded">
                          Recall: {idea.memorabilityScore}%
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                        {idea.meaning}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <button
                        onClick={() => {
                          if (!inCart) {
                            onAddToCart({
                              id: `naming-${idea.domainName}`,
                              domainName: idea.domainName,
                              priceUsd: idea.tld === '.com' ? 14.5 : 7.2,
                              type: 'single',
                            });
                            if (idea.tld === '.com') {
                              onAddToCart({
                                id: `gift-${idea.name.toLowerCase()}.big`,
                                domainName: `${idea.name.toLowerCase()}.big`,
                                priceUsd: 0,
                                isFreeGift: true,
                                giftForDomain: idea.domainName,
                                type: 'single',
                              });
                            }
                          }
                        }}
                        disabled={inCart}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          inCart
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-gradient-to-r from-[#FF5E36] to-[#FF8A00] hover:opacity-95 text-white shadow-md shadow-[#FF5E36]/30 active:scale-95'
                        }`}
                      >
                        {inCart ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>In Cart</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Claim Name</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
