/**
 * URL-driven filter/sort/search helpers shared by all list pages.
 * Pure functions — no DOM, no IO — so they typecheck the same on the
 * server-side route and could be unit-tested without a runtime.
 *
 * Pattern: each list page parses Astro.url.searchParams via parseListQuery,
 * runs the appropriate filter+sort on the in-memory snapshot, then
 * renders. Filter chips render URLs that toggle the relevant param
 * via toggleParam / setParam (preserving everything else).
 */

export type SortDir = 'asc' | 'desc';

export interface ListQuery {
  q: string;
  page: number;
  sort: string;        // free-form, page-specific (e.g. 'ilvl-desc')
  filters: Record<string, string>;
}

export function parseListQuery(url: URL): ListQuery {
  const params = url.searchParams;
  const filters: Record<string, string> = {};
  for (const [k, v] of params.entries()) {
    if (k === 'page' || k === 'sort' || k === 'q') continue;
    if (v) filters[k] = v;
  }
  return {
    q: (params.get('q') ?? '').trim(),
    page: Math.max(1, Number(params.get('page') ?? '1')),
    sort: params.get('sort') ?? '',
    filters
  };
}

/** Returns a URL string with one param set / overridden. */
export function setParam(url: URL, key: string, value: string | undefined): string {
  const u = new URL(url.toString());
  if (value == null || value === '') u.searchParams.delete(key);
  else u.searchParams.set(key, value);
  // Always reset to page 1 when any filter / sort / search changes.
  if (key !== 'page') u.searchParams.delete('page');
  return u.pathname + (u.searchParams.toString() ? '?' + u.searchParams.toString() : '');
}

/** Toggle a value on a param. If the key already has this value, drop it.
 *  Useful for single-select chip groups (faction / quality / rank). */
export function toggleParam(url: URL, key: string, value: string): string {
  const current = url.searchParams.get(key);
  return setParam(url, key, current === value ? undefined : value);
}

/** Strip all filters but keep search + sort. */
export function clearFilters(url: URL): string {
  const u = new URL(url.toString());
  for (const k of Array.from(u.searchParams.keys())) {
    if (k !== 'q' && k !== 'sort') u.searchParams.delete(k);
  }
  return u.pathname + (u.searchParams.toString() ? '?' + u.searchParams.toString() : '');
}

/** Case-insensitive includes — primary search predicate. */
export function matches(haystack: string | null | undefined, needle: string): boolean {
  if (!needle) return true;
  if (!haystack) return false;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

/** Paginate an already-filtered array. */
export function paginate<T>(rows: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const clamped = Math.min(Math.max(1, page), totalPages);
  const start = (clamped - 1) * perPage;
  return {
    page: clamped,
    totalPages,
    rows: rows.slice(start, start + perPage),
    total: rows.length
  };
}
