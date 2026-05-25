import * as React from 'react';
import { Command } from 'cmdk';
import type { SearchEntry, EntityKind } from '~/lib/db/types';
import { cn } from '~/lib/cn';
import {
  ScrollText, Sword, User, Sparkles, MapPin, Flame, ExternalLink
} from 'lucide-react';

interface Props {
  entries: SearchEntry[];
  base: string;
}

const KIND_ICON: Record<EntityKind, React.FC<{ className?: string }>> = {
  quest: ScrollText,
  item:  Sword,
  npc:   User,
  spell: Sparkles,
  zone:  MapPin
};

const KIND_LABEL: Record<EntityKind, string> = {
  quest: 'Quests',
  item:  'Items',
  npc:   'NPCs',
  spell: 'Spells',
  zone:  'Zones'
};

export function CommandPalette({ entries, base }: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  // Open via custom event from the trigger button or global Cmd-K handler.
  React.useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('emberstone:open-search', onOpen);
    return () => window.removeEventListener('emberstone:open-search', onOpen);
  }, []);

  // Esc closes; reset query when closed
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setQuery(''), 200);
      return () => clearTimeout(t);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Group entries by kind, cap each section so the list doesn't explode
  // on a generic query. Sort within each group by Emberstone-custom
  // first (so our own content surfaces preferentially), then level.
  const grouped = React.useMemo(() => {
    const order: EntityKind[] = ['quest', 'item', 'npc', 'spell', 'zone'];
    const map = new Map<EntityKind, SearchEntry[]>();
    for (const k of order) map.set(k, []);
    for (const e of entries) {
      const arr = map.get(e.kind);
      if (arr) arr.push(e);
    }
    return order
      .map((k) => ({
        kind: k,
        rows: (map.get(k) ?? [])
          .sort((a, b) => {
            if (a.emberstoneCustom !== b.emberstoneCustom)
              return a.emberstoneCustom ? -1 : 1;
            return (a.level ?? 0) - (b.level ?? 0);
          })
          .slice(0, 8) // cmdk handles filtering; cap per group for visual cleanliness
      }))
      .filter((g) => g.rows.length);
  }, [entries]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-start pt-[12vh] sm:pt-[18vh] px-4
                     bg-bg/85 backdrop-blur-xl animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="w-full max-w-2xl rounded-xl border border-ember-900/60 bg-bg-surface
                       shadow-2xl shadow-black/60 overflow-hidden
                       animate-fade-up"
            role="dialog"
            aria-label="Search Emberstone Database"
          >
            <Command
              shouldFilter
              label="Search"
              className="flex flex-col"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-ash-800">
                <svg className="h-4 w-4 text-ember-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="7"/>
                  <path d="m21 21-4.3-4.3" strokeLinecap="round"/>
                </svg>
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search quests, items, NPCs, spells…"
                  className="flex-1 bg-transparent text-base text-ash-50 placeholder:text-ash-500 outline-none"
                />
                <span className="text-[10px] text-ash-500 hidden sm:inline">esc to close</span>
              </div>

              <Command.List className="max-h-[55vh] overflow-y-auto px-2 py-2">
                <Command.Empty className="px-3 py-8 text-center text-sm text-ash-400">
                  <Flame className="h-5 w-5 mx-auto mb-2 text-ember-700" />
                  No matches. Try a different keyword — search covers names and subtitles.
                </Command.Empty>

                {grouped.map((g) => {
                  const Icon = KIND_ICON[g.kind];
                  return (
                    <Command.Group
                      key={g.kind}
                      heading={
                        <span className="flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-widest text-ash-500">
                          <Icon className="h-3 w-3" />
                          {KIND_LABEL[g.kind]}
                        </span>
                      }
                    >
                      {g.rows.map((row) => (
                        <Command.Item
                          key={`${g.kind}-${row.id}`}
                          value={`${row.name} ${row.meta ?? ''} ${row.kind} ${row.id}`}
                          onSelect={() => {
                            setOpen(false);
                            window.location.href = `${base}/${pluralize(row.kind)}/${row.id}`;
                          }}
                          className={cn(
                            'flex items-center justify-between gap-3 px-3 py-2 rounded-md cursor-pointer',
                            'aria-selected:bg-ember-900/40 aria-selected:text-ember-50',
                            'data-[selected=true]:bg-ember-900/40 data-[selected=true]:text-ember-50'
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="truncate text-ash-100">{row.name}</span>
                              {row.emberstoneCustom && (
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-ember-300">
                                  <Flame className="h-2.5 w-2.5" /> Emberstone
                                </span>
                              )}
                            </div>
                            {row.meta && (
                              <div className="text-xs text-ash-500 truncate">{row.meta}</div>
                            )}
                          </div>
                          <span className="text-[10px] text-ash-500 font-mono">#{row.id}</span>
                          <ExternalLink className="h-3 w-3 text-ash-600" />
                        </Command.Item>
                      ))}
                    </Command.Group>
                  );
                })}
              </Command.List>

              <div className="flex items-center justify-between gap-3 px-4 py-2 border-t border-ash-800 text-[10px] text-ash-500">
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 rounded bg-bg-inset border border-ash-700 font-mono">↑↓</kbd>
                  navigate
                  <kbd className="px-1.5 py-0.5 rounded bg-bg-inset border border-ash-700 font-mono">↵</kbd>
                  open
                </span>
                <span className="hidden sm:inline">
                  {entries.length.toLocaleString()} entries indexed
                </span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}

function pluralize(kind: EntityKind): string {
  switch (kind) {
    case 'quest': return 'quests';
    case 'item':  return 'items';
    case 'npc':   return 'npcs';
    case 'spell': return 'spells';
    case 'zone':  return 'zones';
  }
}
