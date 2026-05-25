// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// Hybrid output: list/home/changelog/custom pages prerender at build
// time, but the long-tail entity detail pages (~32k of them) SSR on
// demand against the in-memory snapshot. Pre-rendering everything
// produces ~16 GB of HTML — Node SSR with Cloudflare in front gives
// the same "fast" UX without the disk footprint.
export default defineConfig({
  site: 'https://emberstone.owncloud.ai',
  base: '/db',
  trailingSlash: 'ignore',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap(),
  ],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  vite: {
    ssr: {
      noExternal: ['cmdk', 'lucide-react'],
    },
  },
});
