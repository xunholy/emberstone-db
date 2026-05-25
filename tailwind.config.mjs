/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,tsx,ts,jsx,js,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Palette ─────────────────────────────────────────────────────
      // Mirrors the live Emberstone portal so /db feels like the same
      // product. Gold accents come from config.php's vanilla theme
      // (gold #C9A84C, gold_bright #E8D48B, gold_dark #8B6B1A). Surface
      // tones are a deeper near-black than the existing portal to give
      // the new app a more modern, atmospheric feel — we keep the gold
      // identity but ditch the Bootstrap-era greys.
      colors: {
        bg: {
          DEFAULT: '#0a0805',      // page background — almost ink, faint warm tint
          surface: '#13100a',      // cards, panels
          raised: '#1c1610',       // hover/active surfaces
          inset: '#06050a'         // recessed elements (search, input)
        },
        ember: {
          50: '#fbf7e8',
          100: '#f6ecc7',
          200: '#ecd989',
          300: '#e3c44d',
          400: '#d6ad2e',
          500: '#c9a84c',           // <- primary brand gold
          600: '#a8861a',
          700: '#8b6b1a',
          800: '#6b5212',
          900: '#3d2e07'
        },
        ash: {
          50: '#fafaf9',
          100: '#f0eee9',
          200: '#dcd8cf',
          300: '#bcb6a8',
          400: '#928a77',
          500: '#6b6453',
          600: '#4d4738',
          700: '#3a352a',
          800: '#26221b',
          900: '#161310'
        },
        // WoW item rarity colours — used both for borders/glows on
        // detail pages and for text colouring in lists.
        rarity: {
          poor:      '#9d9d9d',
          common:    '#ffffff',
          uncommon:  '#1eff00',
          rare:      '#0070dd',
          epic:      '#a335ee',
          legendary: '#ff8000',
          artifact:  '#e6cc80'
        },
        // Faction tints, used sparingly for quest/NPC chips.
        faction: {
          alliance: '#3b82f6',
          horde:    '#dc2626',
          neutral:  '#a8a29e'
        }
      },
      // ── Typography ──────────────────────────────────────────────────
      fontFamily: {
        sans: ['"Geist Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        mono: ['"Geist Mono"', 'JetBrains Mono', 'ui-monospace', 'monospace']
      },
      letterSpacing: {
        tightest: '-0.04em'
      },
      // ── Effects ─────────────────────────────────────────────────────
      boxShadow: {
        glow:        '0 0 24px -4px rgba(201, 168, 76, 0.45)',
        'glow-lg':   '0 0 48px -6px rgba(201, 168, 76, 0.55)',
        'inset-edge': 'inset 0 0 0 1px rgba(201, 168, 76, 0.12)',
        soft:        '0 1px 0 0 rgba(201, 168, 76, 0.04), 0 8px 24px -12px rgba(0,0,0,0.6)'
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #e8d48b 0%, #c9a84c 45%, #8b6b1a 100%)',
        'gold-radial':   'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.18) 0%, transparent 60%)',
        'ember-grid':    "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
        'hero-spotlight': 'radial-gradient(ellipse at top, rgba(201,168,76,0.22) 0%, rgba(10,8,5,0) 60%)'
      },
      backgroundSize: {
        grid: '48px 48px'
      },
      // ── Animation ───────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 16px -4px rgba(201, 168, 76, 0.25)' },
          '50%':      { boxShadow: '0 0 32px -2px rgba(201, 168, 76, 0.55)' }
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' }
        },
        'caret-blink': {
          '0%, 70%, 100%': { opacity: '1' },
          '20%, 50%':      { opacity: '0' }
        }
      },
      animation: {
        'fade-up':     'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-up-late':'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both',
        'fade-in':     'fade-in 0.8s ease-out both',
        'pulse-glow':  'pulse-glow 3.2s ease-in-out infinite',
        'shimmer':     'shimmer 3s linear infinite',
        'float':       'float 6s ease-in-out infinite',
        'caret-blink': 'caret-blink 1.1s linear infinite'
      },
      transitionTimingFunction: {
        'out-expo':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)'
      }
    }
  },
  plugins: []
};
