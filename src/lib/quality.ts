/**
 * Item rarity → colour, name, glow strength. Mirrors the Classic
 * client palette so item links and borders look authentic.
 */

export type Quality = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const QUALITY_NAME: Record<Quality, string> = {
  0: 'Poor',
  1: 'Common',
  2: 'Uncommon',
  3: 'Rare',
  4: 'Epic',
  5: 'Legendary',
  6: 'Artifact'
};

export const QUALITY_HEX: Record<Quality, string> = {
  0: '#9d9d9d',
  1: '#ffffff',
  2: '#1eff00',
  3: '#0070dd',
  4: '#a335ee',
  5: '#ff8000',
  6: '#e6cc80'
};

/** Tailwind text colour class for inline use. */
export function qualityTextClass(q: Quality | number): string {
  return {
    0: 'text-rarity-poor',
    1: 'text-rarity-common',
    2: 'text-rarity-uncommon',
    3: 'text-rarity-rare',
    4: 'text-rarity-epic',
    5: 'text-rarity-legendary',
    6: 'text-rarity-artifact'
  }[q as Quality] ?? 'text-rarity-common';
}

/** Inline style for rarity glow (border + box-shadow tint). */
export function qualityGlowStyle(q: Quality | number) {
  const hex = QUALITY_HEX[(q as Quality)] ?? QUALITY_HEX[1];
  return {
    borderColor: `${hex}40`,
    boxShadow: `0 0 24px -4px ${hex}55, inset 0 0 0 1px ${hex}25`
  } as const;
}
