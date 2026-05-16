/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#2D3436',
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        youtube: {
          red: '#FF0000',
          'red-dark': '#CC0000',
          'red-light': '#FF4444',
        },
        
        slate: {
          50: 'rgb(248 250 252)',
          100: 'rgb(241 245 249)',
          200: 'rgb(226 232 240)',
          300: 'rgb(203 213 225)',
          400: 'rgb(148 163 184)',
          500: 'rgb(100 116 139)',
          600: 'rgb(71 85 105)',
          700: 'rgb(51 65 85)',
          800: 'rgb(30 41 59)',
          900: 'rgb(15 23 42)',
        },
        blue: {
          500: 'rgb(59 130 246)', // shows blue-500
        },
        purple: {
          600: 'rgb(147 51 234)', // gradient uses purple
        }
      },
      fontFamily: {
        // Keep Inter for general use
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        // Add Spline Sans for NLP page
        'display': ['Spline Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Add rounded-32
        '32': '32px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      spacing: {
        // Add specific spacing if needed
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.4), 0 4px 10px -5px rgba(0, 0, 0, 0.2)',
        'medium': '0 20px 40px -15px rgba(0, 0, 0, 0.4)',
        'glow-red': '0 0 30px rgba(220, 38, 38, 0.3)',
        'glow-red-sm': '0 0 15px rgba(220, 38, 38, 0.2)',
      },
      backgroundImage: {
        // Add gradients
        'gradient-youtube': 'linear-gradient(135deg, #FF0000, #CC0000)',
        'gradient-blue-purple': 'linear-gradient(135deg, #405DE6, #833AB4)',
        'gradient-light': 'linear-gradient(135deg, rgba(64, 93, 230, 0.1), rgba(131, 58, 180, 0.1))',
      },
      backgroundColor: {
        'off-white': '#0f1623',
        'slate-bg': '#080b12',
        'background-light': '#080b12',
        'dark-card': '#0f1623',
        'dark-surface': '#131c2e',
      },
      padding: {
        '10': '2.5rem',
      }
    },
  },
  plugins: [],
}