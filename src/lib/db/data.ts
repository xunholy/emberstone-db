/**
 * Read-only data accessor. Reads from src/data/generated/*.json, which
 * are committed as empty stubs and overwritten at build time by the
 * dump-db script when MariaDB credentials are available. When the
 * stubs are still empty, we fall back to the bundled sample snapshot
 * so the site renders consistently in local dev / CI without DB
 * access.
 */

import type { Snapshot, Quest, Item, Npc, Spell, SearchEntry } from './types';

import generatedSnap   from '~/data/generated/snapshot.json' with { type: 'json' };
import generatedQuests from '~/data/generated/quests.json'   with { type: 'json' };
import generatedItems  from '~/data/generated/items.json'    with { type: 'json' };
import generatedNpcs   from '~/data/generated/npcs.json'     with { type: 'json' };
import generatedSpells from '~/data/generated/spells.json'   with { type: 'json' };

import sample from '~/data/sample-snapshot.json' with { type: 'json' };

const sampleSnap = sample as unknown as Snapshot & {
  quests?: Quest[]; items?: Item[]; npcs?: Npc[]; spells?: Spell[];
};

const generated = generatedSnap as unknown as Snapshot;

// If the generated snapshot is still the empty stub (no entries
// indexed), fall back to the sample. Real builds with a DB dump
// always populate `index`, so this gate is exact.
export const snapshot: Snapshot =
  (generated.index?.length ?? 0) > 0 ? generated : (sampleSnap as Snapshot);

const quests: Quest[] = (generatedQuests as Quest[]).length > 0
  ? (generatedQuests as Quest[])
  : (sampleSnap.quests ?? []);
const items: Item[] = (generatedItems as Item[]).length > 0
  ? (generatedItems as Item[])
  : (sampleSnap.items ?? []);
const npcs: Npc[] = (generatedNpcs as Npc[]).length > 0
  ? (generatedNpcs as Npc[])
  : (sampleSnap.npcs ?? []);
const spells: Spell[] = (generatedSpells as Spell[]).length > 0
  ? (generatedSpells as Spell[])
  : (sampleSnap.spells ?? []);

export function getSnapshot(): Snapshot { return snapshot; }

export function getQuest(entry: number): Quest | undefined {
  return quests.find(q => q.entry === entry);
}
export function getItem(entry: number): Item | undefined {
  return items.find(i => i.entry === entry);
}
export function getNpc(entry: number): Npc | undefined {
  return npcs.find(n => n.entry === entry);
}
export function getSpell(id: number): Spell | undefined {
  return spells.find(s => s.id === id);
}

export function listQuests(): Quest[] { return quests; }
export function listItems(): Item[] { return items; }
export function listNpcs(): Npc[] { return npcs; }
export function listSpells(): Spell[] { return spells; }

export function searchIndex(): SearchEntry[] {
  return snapshot.index ?? [];
}
