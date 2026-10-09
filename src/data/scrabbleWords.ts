import { ScrabbleLetter } from '../types';

export const SCRABBLE_SCORES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8,
  k: 5, l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1,
  u: 1, v: 4, w: 4, x: 8, y: 4, z: 10,
};

export const SAMPLE_PRESETS = [
  { word1: 'hyper', word2: 'flow', category: 'Motion & SaaS' },
  { word1: 'nova', word2: 'mind', category: 'AI Intelligence' },
  { word1: 'zen', word2: 'pulse', category: 'Fintech & Calm' },
  { word1: 'craft', word2: 'byte', category: 'Design Engine' },
  { word1: 'kinetic', word2: 'lab', category: 'Creative Tech' },
  { word1: 'vortex', word2: 'hub', category: 'Spatial & 3D' },
];

export const COMMON_AFFIXES = [
  { text: 'ify', type: 'suffix' },
  { text: 'io', type: 'suffix' },
  { text: 'ly', type: 'suffix' },
  { text: 'ex', type: 'suffix' },
  { text: 'lab', type: 'suffix' },
  { text: 'go', type: 'suffix' },
  { text: 'pro', type: 'suffix' },
  { text: 'hub', type: 'suffix' },
  { text: 'sync', type: 'suffix' },
  { text: 'neo', type: 'prefix' },
];

export function textToScrabbleTiles(text: string): ScrabbleLetter[] {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean.split('').map((char, index) => {
    const isVowel = ['a', 'e', 'i', 'o', 'u', 'y'].includes(char);
    const points = SCRABBLE_SCORES[char] || 1;
    return {
      id: `${char}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      char: char.toUpperCase(),
      points,
      isVowel,
    };
  });
}

