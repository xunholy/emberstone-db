#!/usr/bin/env -S tsx
/**
 * Build-time data dump.
 *
 * Connects to the cmangos world MariaDB read-only, projects the
 * fields the site renders, and writes JSON under src/data/generated/.
 * The Astro build then reads those files and statically renders every
 * detail page.
 *
 * Run via:
 *   MANGOS_DBHOST=... MANGOS_DBUSER=... MANGOS_DBPASS=... npm run dump-db
 *
 * Or under k8s — see kubernetes/apps/.../emberstone-db: the production
 * Deployment runs this as an initContainer against a read-only DB user,
 * writes to an emptyDir that the Astro `build` step then consumes.
 *
 * Intentionally tolerant: any individual table that fails to query
 * (e.g. an Emberstone-only table not present yet) is logged and
 * skipped — the build keeps going with whatever data we got.
 */

import { createConnection } from 'mysql2/promise';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const HOST = process.env.MANGOS_DBHOST ?? '127.0.0.1';
const PORT = Number(process.env.MANGOS_DBPORT ?? '3306');
const USER = process.env.MANGOS_DBUSER ?? '';
const PASS = process.env.MANGOS_DBPASS ?? '';
const DB   = process.env.MANGOS_WORLD_DBNAME ?? 'classicmangos';

const OUT_DIR = resolve(process.cwd(), 'src', 'data', 'generated');

async function main() {
  if (!USER) {
    console.error('[dump-db] MANGOS_DBUSER unset — refusing to connect anonymously.');
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`[dump-db] connecting to ${USER}@${HOST}:${PORT}/${DB}`);
  const conn = await createConnection({
    host: HOST, port: PORT, user: USER, password: PASS, database: DB,
    namedPlaceholders: true, dateStrings: true
  });

  const quests = await safeQuery<{ entry: number; title: string; minLevel: number }>(conn,
    // Vanilla cmangos doesn't have CompletedText (TBC+) or a stored RewXP
    // (XP is computed client-side from QuestLevel + RewMoneyMaxLevel) —
    // surfacing RewMoneyMaxLevel here lets the detail page display the
    // intended money reward at max level.
    `SELECT entry, Title AS title, Objectives AS objectives, Details AS details,
            OfferRewardText AS offerRewardText, RequestItemsText AS requestItemsText,
            EndText AS endText, '' AS completedText,
            MinLevel AS minLevel, QuestLevel AS questLevel, Type AS type,
            RequiredRaces AS requiredRaces, RequiredClasses AS requiredClasses,
            RequiredSkill AS requiredSkill, RequiredSkillValue AS requiredSkillValue,
            RewOrReqMoney AS rewOrReqMoney, RewMoneyMaxLevel AS rewXP,
            RewSpell AS rewSpell, RewSpellCast AS rewSpellCast,
            RewItemId1 AS rewItemId1, RewItemCount1 AS rewItemCount1,
            RewItemId2 AS rewItemId2, RewItemCount2 AS rewItemCount2,
            RewItemId3 AS rewItemId3, RewItemCount3 AS rewItemCount3,
            RewItemId4 AS rewItemId4, RewItemCount4 AS rewItemCount4,
            RewChoiceItemId1 AS rewChoiceItemId1, RewChoiceItemCount1 AS rewChoiceItemCount1,
            RewChoiceItemId2 AS rewChoiceItemId2, RewChoiceItemCount2 AS rewChoiceItemCount2,
            RewChoiceItemId3 AS rewChoiceItemId3, RewChoiceItemCount3 AS rewChoiceItemCount3,
            RewChoiceItemId4 AS rewChoiceItemId4, RewChoiceItemCount4 AS rewChoiceItemCount4,
            RewChoiceItemId5 AS rewChoiceItemId5, RewChoiceItemCount5 AS rewChoiceItemCount5,
            RewChoiceItemId6 AS rewChoiceItemId6, RewChoiceItemCount6 AS rewChoiceItemCount6,
            PrevQuestId AS prevQuestId, NextQuestId AS nextQuestId, NextQuestInChain AS nextQuestInChain,
            ZoneOrSort AS zoneOrSort
       FROM quest_template`, 'quest_template');

  const items = await safeQuery<{ entry: number; name: string; requiredLevel: number }>(conn,
    `SELECT entry, name, displayid AS displayId, Quality AS quality,
            ItemLevel AS itemLevel, RequiredLevel AS requiredLevel,
            class, subclass, InventoryType AS inventoryType, Flags AS flags,
            BuyPrice AS buyPrice, SellPrice AS sellPrice, stackable, description
       FROM item_template`, 'item_template');

  const npcs = await safeQuery<{ entry: number; name: string; subname: string | null; minLevel: number }>(conn,
    // cmangos vanilla creature_template uses PascalCase column names
    // and a single `Faction` column (no Alliance/Horde split — that's
    // TBC). `type` in our projection maps to CreatureType.
    `SELECT Entry AS entry, Name AS name, SubName AS subname,
            MinLevel AS minLevel, MaxLevel AS maxLevel,
            Faction AS faction, Rank AS rank, CreatureType AS type,
            ScriptName AS scriptName
       FROM creature_template`, 'creature_template');

  const spells: unknown[] = []; // spell_template lives in DBC, intentionally skipped here

  // Relations — collapse the link tables into CSV strings so the
  // committed JSON stays one row per entity rather than exploding
  // into a separate join table.
  const startersRows = await safeQuery<{ quest: number; id: number }>(conn,
    'SELECT quest, id FROM creature_questrelation', 'creature_questrelation');
  const enderRows    = await safeQuery<{ quest: number; id: number }>(conn,
    'SELECT quest, id FROM creature_involvedrelation', 'creature_involvedrelation');

  const startersByQuest = new Map<number, number[]>();
  const enderByQuest    = new Map<number, number[]>();
  const startsByCreature = new Map<number, number[]>();
  const endsByCreature   = new Map<number, number[]>();
  for (const r of startersRows) {
    (startersByQuest.get(r.quest) ?? startersByQuest.set(r.quest, []).get(r.quest)!).push(r.id);
    (startsByCreature.get(r.id) ?? startsByCreature.set(r.id, []).get(r.id)!).push(r.quest);
  }
  for (const r of enderRows) {
    (enderByQuest.get(r.quest) ?? enderByQuest.set(r.quest, []).get(r.quest)!).push(r.id);
    (endsByCreature.get(r.id)  ?? endsByCreature.set(r.id, []).get(r.id)!).push(r.quest);
  }

  type Quest = typeof quests[number] & { startedBy?: string; finishedBy?: string };
  type Npc   = typeof npcs[number]   & { startsQuests?: string; endsQuests?: string };

  const questsEnriched = (quests as Quest[]).map(q => ({
    ...q,
    startedBy:  (startersByQuest.get(q.entry) ?? []).join(','),
    finishedBy: (enderByQuest.get(q.entry)    ?? []).join(',')
  }));
  const npcsEnriched = (npcs as Npc[]).map(n => ({
    ...n,
    startsQuests: (startsByCreature.get(n.entry) ?? []).join(','),
    endsQuests:   (endsByCreature.get(n.entry)   ?? []).join(',')
  }));

  // Build a flat search index — fast load, fast match. Mark Emberstone
  // custom entries (entry/id in our known custom range >= 190000 for
  // NPCs, custom item flags, etc.) so the UI can highlight them.
  const idx = [
    ...questsEnriched.map(q => ({ kind: 'quest', id: q.entry, name: q.title, level: q.minLevel })),
    ...items.map(i => ({ kind: 'item', id: i.entry, name: i.name, level: i.requiredLevel })),
    ...npcsEnriched.map(n => ({
      kind: 'npc', id: n.entry, name: n.name,
      meta: n.subname || undefined,
      level: n.minLevel,
      emberstoneCustom: n.entry >= 190000 && n.entry < 200000
    }))
  ];

  const snapshot = {
    generatedAt: new Date().toISOString(),
    counts: {
      quests: questsEnriched.length,
      items: items.length,
      npcs: npcsEnriched.length,
      spells: spells.length,
      emberstoneCustomQuests: 0,
      emberstoneCustomItems: items.filter(i => i.entry >= 190000 && i.entry < 200000).length,
      emberstoneCustomNpcs: npcsEnriched.filter(n => n.entry >= 190000 && n.entry < 200000).length
    },
    index: idx
  };

  await Promise.all([
    writeFile(resolve(OUT_DIR, 'snapshot.json'), JSON.stringify(snapshot)),
    writeFile(resolve(OUT_DIR, 'quests.json'), JSON.stringify(questsEnriched)),
    writeFile(resolve(OUT_DIR, 'items.json'), JSON.stringify(items)),
    writeFile(resolve(OUT_DIR, 'npcs.json'), JSON.stringify(npcsEnriched)),
    writeFile(resolve(OUT_DIR, 'spells.json'), JSON.stringify(spells))
  ]);

  await conn.end();
  console.log(`[dump-db] wrote ${quests.length} quests / ${items.length} items / ${npcs.length} npcs to ${OUT_DIR}`);
}

async function safeQuery<T = Record<string, unknown>>(conn: import('mysql2/promise').Connection, sql: string, label: string): Promise<T[]> {
  try {
    const [rows] = await conn.query(sql);
    return rows as T[];
  } catch (err) {
    console.warn(`[dump-db] skipping ${label}: ${(err as Error).message}`);
    return [];
  }
}

main().catch((err) => {
  console.error('[dump-db] fatal:', err);
  process.exit(1);
});
