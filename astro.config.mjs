// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Pure static output — every page prerenders at build time from the
// committed JSON snapshot (or a real DB dump if MARIADB creds are
// passed to `npm run dump-db` before `npm run build`). No runtime
// Node server needed; nginx serves dist/ directly.
export default defineConfig({
  site: 'https://emberstone.owncloud.ai',
  base: '/db',
  trailingSlash: 'never',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap(),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  vite: {
    ssr: {
      noExternal: ['cmdk', 'lucide-react'],
    },
  },
});
