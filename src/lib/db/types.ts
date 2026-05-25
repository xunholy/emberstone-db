/**
 * Shape-only types matching the cmangos world DB schema (Classic 1.12.1
 * tables). Field names mirror DB columns for traceability — these are
 * also the shape the build-time data dump (scripts/dump-db.ts) writes
 * to JSON and the runtime queries return.
 */

export interface Quest {
  entry: number;
  title: string;
  /** Quest objective text shown in the log. */
  objectives: string;
  /** Body text shown when accepting the quest. */
  details: string;
  /** Text NPC says on quest completion (`Texts.fOffer`). */
  offerRewardText: string;
  /** Text NPC says when the quest is still incomplete. */
  requestItemsText: string;
  endText: string;
  /** End-of-quest summary shown on the completion popup. */
  completedText: string;
  minLevel: number;
  questLevel: number;
  type: number;
  /** Bitmask: 1=Alliance, 2=Horde, 3=both. */
  requiredRaces: number;
  requiredClasses: number;
  requiredSkill: number;
  requiredSkillValue: number;
  rewOrReqMoney: number;
  rewXP: number;
  rewSpell: number;
  rewSpellCast: number;
  rewItemId1: number; rewItemCount1: number;
  rewItemId2: number; rewItemCount2: number;
  rewItemId3: number; rewItemCount3: number;
  rewItemId4: number; rewItemCount4: number;
  rewChoiceItemId1: number; rewChoiceItemCount1: number;
  rewChoiceItemId2: number; rewChoiceItemCount2: number;
  rewChoiceItemId3: number; rewChoiceItemCount3: number;
  rewChoiceItemId4: number; rewChoiceItemCount4: number;
  rewChoiceItemId5: number; rewChoiceItemCount5: number;
  rewChoiceItemId6: number; rewChoiceItemCount6: number;
  prevQuestId: number;
  nextQuestId: number;
  nextQuestInChain: number;
  /** Comma-separated entry list of NPCs that offer this quest. */
  startedBy: string;
  /** Comma-separated entry list of NPCs that turn this quest in. */
  finishedBy: string;
  zoneOrSort: number;
  /** True if this entry was scraped from Emberstone's fork, not stock cmangos. */
  emberstoneCustom?: boolean;
}

export interface Item {
  entry: number;
  name: string;
  displayId: number;
  quality: number;
  itemLevel: number;
  requiredLevel: number;
  class: number;
  subclass: number;
  inventoryType: number;
  flags: number;
  buyPrice: number;
  sellPrice: number;
  stackable: number;
  description: string;
  spells?: { id: number; trigger: number; charges: number }[];
  /** Comma-separated NPC entries dropping this item. */
  droppedBy?: string;
  emberstoneCustom?: boolean;
}

export interface Npc {
  entry: number;
  name: string;
  subname: string;
  minLevel: number;
  maxLevel: number;
  faction: number;
  rank: number;
  type: number;
  /** Comma-separated quests offered. */
  startsQuests?: string;
  /** Comma-separated quests turned in. */
  endsQuests?: string;
  scriptName?: string;
  emberstoneCustom?: boolean;
}

export interface Spell {
  id: number;
  name: string;
  description: string;
  level: number;
  classMask: number;
  rangeIndex: number;
  schoolMask: number;
}

export interface ServerStatus {
  online: boolean;
  players: number;
  uptimeSec: number;
  realmName: string;
  realmlist: string;
  latestPatch: { sha: string; subject: string; ts: string } | null;
}

/** Aggregate "what we know" snapshot used by the home page + search index. */
export interface Snapshot {
  generatedAt: string;
  counts: {
    quests: number;
    items: number;
    npcs: number;
    spells: number;
    emberstoneCustomQuests: number;
    emberstoneCustomItems: number;
    emberstoneCustomNpcs: number;
  };
  // Light-weight indexes for the Cmd-K search. Full records load on
  // navigation to a detail page.
  index: SearchEntry[];
}

export type EntityKind = 'quest' | 'item' | 'npc' | 'spell' | 'zone';

export interface SearchEntry {
  kind: EntityKind;
  id: number;
  name: string;
  /** Sub-label (e.g. NPC subname, item rarity word). */
  meta?: string;
  /** Optional level/min-level used as a secondary sort hint. */
  level?: number;
  emberstoneCustom?: boolean;
}
