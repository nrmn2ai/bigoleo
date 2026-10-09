export interface DomainItem {
  id: string;
  name: string;
  tld: string;
  fullName: string;
  priceUsd: number;
  category: 'ai' | 'tech' | 'creative' | 'brandable' | 'short' | 'fintech';
  description: string;
  isAuction?: boolean;
  auctionDetails?: {
    currentBidUsd: number;
    startingBidUsd: number;
    endsAt: number; // timestamp
    totalBids: number;
    highestBidder: string;
    minIncrementUsd: number;
  };
  views: number;
  featured?: boolean;
  freeBigPairIncluded?: boolean;
  status: 'available' | 'in_auction' | 'sold';
}

export interface NamingRequest {
  id: string;
  businessTitle: string;
  description: string;
  industry: string;
  tone: 'modern' | 'luxury' | 'playful' | 'minimal' | 'kinetic' | 'tech';
  budgetLevel: 'standard' | 'growth' | 'vip';
  submittedAt: number;
}

export interface GeneratedIdea {
  name: string;
  domainName: string;
  meaning: string;
  memorabilityScore: number;
  isAvailable: boolean;
  tld: string;
  estimatedValueUsd: number;
}

export interface ScrabbleLetter {
  id: string;
  char: string;
  points: number;
  isVowel: boolean;
}

export interface BoardEvaluationResult {
  score: number; // 0-100
  luckFactor: number; // multiplier
  verdictTitle: string;
  verdictDescription: string;
  cashOfferUsd: number;
  rarityLevel: 'Standard' | 'Rare' | 'Epic' | 'Mythic';
  rarityColor: string;
  acceptedByBigoleo: boolean;
}

export interface CartItem {
  id: string;
  domainName: string;
  priceUsd: number;
  isFreeGift?: boolean;
  giftForDomain?: string;
  type: 'single' | 'auction_deposit' | 'custom_naming';
}

