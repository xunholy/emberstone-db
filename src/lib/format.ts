/**
 * Money / level / faction formatters. Kept pure (no DB, no I/O) so they
 * are safe to use in both Astro components and React islands.
 */

export type Coinage = { gold: number; silver: number; copper: number };

/** Split a copper-denominated integer into g/s/c, as Classic displays it. */
export function splitMoney(copper: number): Coinage {
  const g = Math.floor(copper / 10000);
  const s = Math.floor((copper % 10000) / 100);
  const c = copper % 100;
  return { gold: g, silver: s, copper: c };
}

/** Compact text form ("12g 34s 56c"). Hides zero-prefix segments. */
export function formatMoney(copper: number): string {
  if (!copper || copper < 0) return '—';
  const { gold, silver, copper: c } = splitMoney(copper);
  const parts: string[] = [];
  if (gold) parts.push(`${gold}g`);
  if (silver || (gold && c)) parts.push(`${silver}s`);
  if (c) parts.push(`${c}c`);
  return parts.length ? parts.join(' ') : '0c';
}

export function formatLevelRange(min: number, max: number): string {
  if (!max || max === min) return `Lv ${min || '?'}`;
  return `Lv ${min || '?'}–${max}`;
}

/** Classic FactionGroup mask: 1=alliance, 2=horde, 3=both. */
export type Faction = 'alliance' | 'horde' | 'neutral';
export function questFaction(mask: number | null | undefined): Faction {
  if (!mask || mask === 3) return 'neutral';
  if (mask & 1) return 'alliance';
  if (mask & 2) return 'horde';
  return 'neutral';
}

/** Slug for URL-safe entity names. */
export function slug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Compact number ("12.4k", "1.2M") for stats counters. */
export function compactNumber(n: number): string {
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}
