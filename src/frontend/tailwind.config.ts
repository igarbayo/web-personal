import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FBFAF7',
        foreground: '#1C1E26',
        muted: '#63697A',
        accent: '#2743C0',
        border: '#E3E2DB',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-stix)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      // STIX tiene menor altura-x que Inter: subimos ~6% los tamaños de lectura
      // (xs–3xl). Los títulos grandes (4xl/5xl/6xl) se dejan sin tocar.
      fontSize: {
        xs: ['0.8rem', { lineHeight: '1rem' }],
        sm: ['0.925rem', { lineHeight: '1.25rem' }],
        base: ['1.0625rem', { lineHeight: '1.5rem' }],
        lg: ['1.1875rem', { lineHeight: '1.75rem' }],
        xl: ['1.3125rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.575rem', { lineHeight: '2rem' }],
        '3xl': ['1.95rem', { lineHeight: '2.25rem' }],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1s step-start infinite',
      },
    },
  },
  plugins: [],
}
export default config
