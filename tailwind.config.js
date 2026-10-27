/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Glacier theme
        glacier: {
          bg: '#04111F',
          surface: '#071828',
          accent: '#6EE7F9',
          blue: '#2B7FFF',
          ice: '#EAF8FF',
          warning: '#FF6B5A',
        },
        // Deforestation theme
        forest: {
          bg: '#07140C',
          surface: '#0D1F10',
          accent: '#22C55E',
          moss: '#7BAE5A',
          bark: '#6B4226',
          ember: '#FF8A1F',
        },
        // Carbon & Emissions theme
        carbon: {
          bg: '#0B0B10',
          surface: '#12121A',
          accent: '#FFB020',
          magenta: '#FF2E88',
          violet: '#7C5CFF',
          smog: '#5B6B8C',
        },
        // Solutions theme
        solutions: {
          dawn: '#FFD36E',
          sky: '#7DD3FC',
          green: '#34D399',
          white: '#FFFFFF',
        },
      },
      backdropBlur: {
        'glass': '32px',
        'glass-lg': '40px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'counter': 'counter 1.5s ease-out forwards',
        'frost-clear': 'frostClear 1.2s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px var(--accent)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 40px var(--accent)' },
        },
        frostClear: {
          '0%': { backdropFilter: 'blur(40px) brightness(1.5)', opacity: '0.9' },
          '100%': { backdropFilter: 'blur(0px) brightness(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-hover': '0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)',
        'accent-glow': '0 0 24px var(--accent)',
        'accent-glow-lg': '0 0 48px var(--accent)',
      },
    },
  },
  plugins: [],
}
