/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral surfaces for the dark UI
        ink: {
          950: '#06070a',
          900: '#0b0d11',
          850: '#101318',
          800: '#151920',
          700: '#1d222b',
          600: '#2a303b',
          500: '#3a414e',
          400: '#5c6472',
          300: '#8a919e',
          200: '#b5bac4',
          100: '#dde0e6',
          50: '#f3f4f6',
        },
        // Signal accent (YouTube-adjacent red)
        brand: {
          50: '#fff1f1',
          100: '#ffdfdf',
          200: '#ffc5c5',
          300: '#ff9d9d',
          400: '#ff6464',
          500: '#ff3b3b',
          600: '#ed1c1c',
          700: '#c81414',
          800: '#a51515',
          900: '#881818',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,59,59,0.35), 0 8px 32px -8px rgba(255,59,59,0.45)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 32px -16px rgba(0,0,0,0.6)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        'grow-x': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        shimmer: 'shimmer 2.4s linear infinite',
        'grow-x': 'grow-x 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both',
      },
    },
  },
  plugins: [],
};
