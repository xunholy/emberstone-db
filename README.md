# Emberstone Database

Classic WoW (1.12.1) reference site for the **Emberstone** realm — quests, items,
NPCs, spells, and the fork-specific systems that make our server what it is.

Lives at **https://emberstone.owncloud.ai/db**.

```
Stack:   Astro 5 (SSG) · React islands · Tailwind 3 · cmdk · mysql2
Brand:   bespoke palette inheriting from the existing emberstone portal
Theme:   dark, atmospheric, gold-on-near-black
Effects: canvas ember field, animated counters, scroll-revealed sections,
         pointer-tracked card sheen, typewriter hero subline
```

## What it is — and what it isn't

It **is** a Classic 1.12.1-only reference, scraped from our live world DB,
aware of every fork-specific patch we ship. Stock entries surface Wowhead
Classic tooltips inline; everything Emberstone-specific is rendered natively
from the source tree.

It **is not** TBC/Wrath/Retail (we run 1.12.1), an auction-house mirror, a
talent calculator, or a comments/forum. Those are out of scope by design —
the polish budget goes into the search, the home page, and the fork-aware
quest/NPC pages instead.

## Repository layout

```
src/
  pages/               # one route per URL — Astro file-based routing
    index.astro                <- the stunning home
    quests/[id].astro          <- detail (statically generated)
    custom/index.astro         <- Emberstone-only modules
    changelog.astro
  layouts/
    BaseLayout.astro           <- doc shell, head metadata, Wowhead widget
  components/
    layout/, search/, effects/, entities/, ui/, home/
  lib/
    cn.ts                      <- clsx + tailwind-merge
    format.ts                  <- money/level/faction helpers
    quality.ts                 <- WoW item-rarity colour map
    db/
      types.ts                 <- world-DB row shapes
      data.ts                  <- accessor (build-time JSON snapshot)
  data/
    sample-snapshot.json       <- fallback when no DB dump is present
    generated/                 <- DB dump output (gitignored)
  styles/
    globals.css                <- Tailwind layers + brand grain/scrollbar
scripts/
  dump-db.ts                   <- MariaDB → JSON, runs in initContainer
public/
  favicon.svg, manifest, robots
```

## Local development

```bash
npm install
npm run dev                    # http://0.0.0.0:4321/db
```

The dev server uses the committed `src/data/sample-snapshot.json` so you
don't need a DB connection to iterate on UI. For real data, run the dump
first:

```bash
MANGOS_DBHOST=127.0.0.1 \
MANGOS_DBPORT=3306 \
MANGOS_DBUSER=db_browser \
MANGOS_DBPASS=*** \
MANGOS_WORLD_DBNAME=classicmangos \
  npm run dump-db
```

This writes `src/data/generated/{snapshot,quests,items,npcs,spells}.json`.
Subsequent `npm run build` picks them up automatically.

## Production build

The `Dockerfile` is a four-stage build: `deps → dump → build → runtime`.
The `dump` stage runs `dump-db` if MariaDB credentials are passed as build
args, otherwise falls back to the sample snapshot. The runtime stage is a
tiny nginx serving the static output under `/db/`.

```bash
docker build \
  --build-arg MANGOS_DBHOST=mariadb.svc \
  --build-arg MANGOS_DBUSER=db_browser \
  --build-arg MANGOS_DBPASS=*** \
  -t emberstone-db:local .

docker run --rm -p 8080:8080 emberstone-db:local
# open http://localhost:8080/db/
```

## Deployment

Lives in our `k8s-gitops` repo under
`kubernetes/apps/base/game-servers/emberstone-db/`. Flux pulls the latest
image on every push to `main`; the existing `emberstone-portal` HTTPRoute
adds a path rule `/db/* → emberstone-db.game-servers.svc` so the new app
shares the hostname.

A read-only MariaDB user (`db_browser`) is provisioned with `SELECT` on
`classicmangos` only — never on the realm or characters DBs.

## Brand & design system

The palette inherits from the existing portal's vanilla theme
(`gold #C9A84C`, `gold_bright #E8D48B`, `gold_dark #8B6B1A`) but moves
to a deeper, near-black background (`#0a0805`) for a more atmospheric
feel. Typography pairs **Geist Sans** for UI with **EB Garamond** for
the long-form headings — restraint over fantasy display fonts.

All effects honour `prefers-reduced-motion`. The ember canvas pauses
when the tab is hidden. The whole site degrades gracefully without JS
(static HTML for every entity page; search is the only feature that
requires JS).

## Licence

MIT for the site code. World of Warcraft is a trademark of Blizzard
Entertainment — this project exists for education and private-server
experimentation. No commercial use.
