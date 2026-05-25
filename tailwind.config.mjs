/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,tsx,ts,jsx,js,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Palette ─────────────────────────────────────────────────────
      // 1:1 with the live portal's CSS custom properties from
      // /template/kaelthas/css/style.css. This keeps both apps visually
      // identical so /db looks like part of the same product.
      colors: {
        bg: {
          DEFAULT: '#04060C',      // --bg-void
          deep:    '#080C18',      // --bg-deep
          surface: '#0D1220',      // --bg-card-solid
          card:    'rgba(255,255,255,0.03)',  // --bg-card
          raised:  'rgba(255,255,255,0.055)', // --bg-card-hover
          inset:   'rgba(0,0,0,0.35)'         // --bg-input
        },
        ash: {
          50:  '#F0F1F5',          // --text-bright
          100: '#D0D4DE',          // --text
          200: '#a8aec1',
          300: '#8B90A8',          // --text-dim
          400: '#5d6377',
          500: '#3f4356',
          600: '#272a39',
          700: '#1a1c28',
          800: '#10131b',
          900: '#080a0f'
        },
        ember: {
          50:  '#fbf7e8',
          100: '#f6ecc7',
          200: '#ecd989',
          300: '#e3c44d',
          400: '#d6ad2e',
          500: '#C9A84C',           // --gold
          600: '#A08A4E',           // --gold-muted
          700: '#8B6B1A',           // --gold-dark
          800: '#6b5212',
          900: '#3d2e07',
          bright: '#E8D48B'         // --gold-bright
        },
        // Secondary indigo accent — the portal layers this faintly
        // behind the gold for atmospheric depth.
        rune: {
          500: '#1E3A8A',           // matches --gold-glow's indigo cousin
          glow: 'rgba(30, 58, 138, 0.06)'
        },
        // WoW item rarity colours.
        rarity: {
          poor:      '#9d9d9d',
          common:    '#ffffff',
          uncommon:  '#1eff00',
          rare:      '#0070dd',
          epic:      '#a335ee',
          legendary: '#ff8000',
          artifact:  '#e6cc80'
        },
        faction: {
          alliance: '#3b82f6',
          horde:    '#dc2626',
          neutral:  '#a8a29e'
        }
      },
      // ── Typography ──────────────────────────────────────────────────
      // Cinzel (heading) + Inter (body) mirror the portal exactly.
      // Loaded via globals.css @import from Google Fonts to match the
      // portal's CDN setup.
      fontFamily: {
        sans:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        heading: ['Cinzel', 'Georgia', 'serif'],
        serif:   ['Cinzel', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      letterSpacing: {
        tightest: '-0.04em',
        ember:    '0.015em'
      },
      // ── Effects ─────────────────────────────────────────────────────
      boxShadow: {
        glow:        '0 0 24px -4px rgba(201, 168, 76, 0.45)',
        'glow-lg':   '0 0 48px -6px rgba(201, 168, 76, 0.55)',
        'inset-edge': 'inset 0 0 0 1px rgba(201, 168, 76, 0.12)',
        soft:        '0 1px 0 0 rgba(201, 168, 76, 0.04), 0 8px 24px -12px rgba(0,0,0,0.6)'
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #E8D48B 0%, #C9A84C 45%, #8B6B1A 100%)',
        'gold-radial':    'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.18) 0%, transparent 60%)',
        'ember-grid':     "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
        // Same dual-gradient pattern the portal uses for its bg-glow.
        'hero-spotlight': 'radial-gradient(ellipse 800px 600px at 25% 20%, rgba(201,168,76,0.04) 0%, transparent 70%), radial-gradient(ellipse 600px 800px at 75% 80%, rgba(30,58,138,0.06) 0%, transparent 70%), radial-gradient(circle at 50% -5%, rgba(232,212,139,0.18) 0%, transparent 50%)'
      },
      backgroundSize: {
        grid: '48px 48px'
      },
      // ── Animation ───────────────────────────────────────────────────
      keyframes: {
        'fade-up':     { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in':     { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'pulse-glow':  { '0%,100%': { boxShadow: '0 0 16px -4px rgba(201, 168, 76, 0.25)' }, '50%': { boxShadow: '0 0 32px -2px rgba(201, 168, 76, 0.55)' } },
        'shimmer':     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'float':       { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        'caret-blink': { '0%,70%,100%': { opacity: '1' }, '20%,50%': { opacity: '0' } }
      },
      animation: {
        'fade-up':      'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-up-late': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both',
        'fade-in':      'fade-in 0.8s ease-out both',
        'pulse-glow':   'pulse-glow 3.2s ease-in-out infinite',
        'shimmer':      'shimmer 3s linear infinite',
        'float':        'float 6s ease-in-out infinite',
        'caret-blink':  'caret-blink 1.1s linear infinite'
      },
      transitionTimingFunction: {
        'out-expo':    'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)'
      }
    }
  },
  plugins: []
};
