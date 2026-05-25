/**
 * Lookup tables for cmangos enum values → human labels. Kept here so
 * the filter UI and the detail pages share one source of truth.
 *
 * IDs match the values stored in classicmangos.{quest,item,creature}_template
 * on Classic 1.12.1.
 */

// ── Item: Class (item_template.class) ─────────────────────────────
export const ITEM_CLASS: Record<number, string> = {
  0:  'Consumable',
  1:  'Container',
  2:  'Weapon',
  3:  'Gem',
  4:  'Armor',
  5:  'Reagent',
  6:  'Projectile',
  7:  'Trade goods',
  9:  'Recipe',
  11: 'Quiver',
  12: 'Quest item',
  13: 'Key',
  15: 'Misc'
};

// ── Item: InventoryType ───────────────────────────────────────────
export const INV_SLOT: Record<number, string> = {
  0:  'Non-equippable',
  1:  'Head',
  2:  'Neck',
  3:  'Shoulder',
  4:  'Shirt',
  5:  'Chest',
  6:  'Waist',
  7:  'Legs',
  8:  'Feet',
  9:  'Wrist',
  10: 'Hands',
  11: 'Finger',
  12: 'Trinket',
  13: 'One-Hand',
  14: 'Shield',
  15: 'Ranged',
  16: 'Cloak',
  17: 'Two-Hand',
  18: 'Bag',
  19: 'Tabard',
  20: 'Chest (robe)',
  21: 'Main hand',
  22: 'Off hand',
  23: 'Held in off-hand',
  24: 'Ammo',
  25: 'Thrown',
  26: 'Ranged (relic)',
  28: 'Relic'
};

// ── NPC: Rank (creature_template.Rank) ────────────────────────────
export const NPC_RANK: Record<number, string> = {
  0: 'Normal',
  1: 'Elite',
  2: 'Rare Elite',
  3: 'Boss',
  4: 'Rare'
};

// ── NPC: CreatureType ─────────────────────────────────────────────
export const NPC_TYPE: Record<number, string> = {
  0:  'None',
  1:  'Beast',
  2:  'Dragonkin',
  3:  'Demon',
  4:  'Elemental',
  5:  'Giant',
  6:  'Undead',
  7:  'Humanoid',
  8:  'Critter',
  9:  'Mechanical',
  10: 'Not specified',
  11: 'Totem'
};

// ── Quest: Type ───────────────────────────────────────────────────
export const QUEST_TYPE: Record<number, string> = {
  0:  'Standard',
  1:  'Group',
  41: 'PvP',
  62: 'Raid',
  81: 'Dungeon',
  82: 'World event',
  83: 'Legendary',
  84: 'Escort',
  85: 'Heroic',
  88: 'Raid (40)'
};

// ── Quest: faction-mask helpers ───────────────────────────────────
// requiredRaces is a bitmask of player races. ANY=0; Alliance-only
// races are 1,4,8,64 → 77; Horde-only races are 2,16,32,128 → 178.
// We classify masks as Alliance / Horde / Both based on which races
// they reach.
const ALLIANCE_MASK = 1 + 4 + 8 + 64;      // 77
const HORDE_MASK    = 2 + 16 + 32 + 128;   // 178
export function questFactionLabel(mask: number): 'alliance' | 'horde' | 'any' {
  if (!mask || mask === ALLIANCE_MASK + HORDE_MASK) return 'any';
  const hasAlliance = (mask & ALLIANCE_MASK) !== 0;
  const hasHorde    = (mask & HORDE_MASK)    !== 0;
  if (hasAlliance && !hasHorde) return 'alliance';
  if (hasHorde && !hasAlliance) return 'horde';
  return 'any';
}

// ── Quest: class-mask helpers ─────────────────────────────────────
export const CLASS_MASK: Record<number, string> = {
  1:    'Warrior',
  2:    'Paladin',
  4:    'Hunter',
  8:    'Rogue',
  16:   'Priest',
  64:   'Shaman',
  128:  'Mage',
  256:  'Warlock',
  1024: 'Druid'
};

// ── Level brackets (used by filter chips) ─────────────────────────
export const LEVEL_BRACKETS = [
  { label: '1–9',   min: 1,  max: 9 },
  { label: '10–19', min: 10, max: 19 },
  { label: '20–29', min: 20, max: 29 },
  { label: '30–39', min: 30, max: 39 },
  { label: '40–49', min: 40, max: 49 },
  { label: '50–59', min: 50, max: 59 },
  { label: '60+',   min: 60, max: 999 }
] as const;
