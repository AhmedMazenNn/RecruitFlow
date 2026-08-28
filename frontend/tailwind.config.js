/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--rf-canvas) / <alpha-value>)',
        surface: 'rgb(var(--rf-surface) / <alpha-value>)',
        subtle: 'rgb(var(--rf-subtle) / <alpha-value>)',
        elevated: 'rgb(var(--rf-elevated) / <alpha-value>)',
        border: 'rgb(var(--rf-border) / <alpha-value>)',
        strong: 'rgb(var(--rf-border-strong) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--rf-text) / <alpha-value>)',
          muted: 'rgb(var(--rf-text-muted) / <alpha-value>)',
          subtle: 'rgb(var(--rf-text-subtle) / <alpha-value>)',
          invert: 'rgb(var(--rf-text-invert) / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'rgb(var(--rf-brand) / <alpha-value>)',
          hover: 'rgb(var(--rf-brand-hover) / <alpha-value>)',
          soft: 'rgb(var(--rf-brand-soft) / <alpha-value>)',
          ring: 'rgb(var(--rf-brand-ring) / <alpha-value>)',
          fg: 'rgb(var(--rf-brand-fg) / <alpha-value>)',
          navy: 'rgb(var(--rf-navy) / <alpha-value>)',
          50: '#F0F2FF',
          100: '#E3E7FF',
          200: '#CBD2FE',
          300: '#A9B3FC',
          400: '#838BF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#332C9E',
          900: '#221E5E',
          950: '#14123A',
        },
        accent: {
          DEFAULT: 'rgb(var(--rf-accent) / <alpha-value>)',
          soft: 'rgb(var(--rf-accent-soft) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--rf-success) / <alpha-value>)',
          soft: 'rgb(var(--rf-success-soft) / <alpha-value>)',
          fg: 'rgb(var(--rf-success-fg) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--rf-warning) / <alpha-value>)',
          soft: 'rgb(var(--rf-warning-soft) / <alpha-value>)',
          fg: 'rgb(var(--rf-warning-fg) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--rf-danger) / <alpha-value>)',
          soft: 'rgb(var(--rf-danger-soft) / <alpha-value>)',
          fg: 'rgb(var(--rf-danger-fg) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--rf-info) / <alpha-value>)',
          soft: 'rgb(var(--rf-info-soft) / <alpha-value>)',
          fg: 'rgb(var(--rf-info-fg) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        xs: ['0.75rem', { lineHeight: '1.125rem' }],
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],
        base: ['0.875rem', { lineHeight: '1.375rem' }],
        md: ['0.9375rem', { lineHeight: '1.5rem' }],
        lg: ['1.0625rem', { lineHeight: '1.5rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.011em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.018em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.022em' }],
        '4xl': ['2.375rem', { lineHeight: '2.75rem', letterSpacing: '-0.028em' }],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.625rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(var(--rf-shadow) / 0.06)',
        sm: '0 1px 3px 0 rgb(var(--rf-shadow) / 0.08), 0 1px 2px -1px rgb(var(--rf-shadow) / 0.06)',
        md: '0 4px 12px -2px rgb(var(--rf-shadow) / 0.10), 0 2px 4px -2px rgb(var(--rf-shadow) / 0.06)',
        lg: '0 12px 32px -8px rgb(var(--rf-shadow) / 0.18), 0 4px 8px -4px rgb(var(--rf-shadow) / 0.08)',
        pop: '0 16px 48px -12px rgb(var(--rf-shadow) / 0.24)',
        drag: '0 20px 40px -12px rgb(var(--rf-shadow) / 0.30)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
