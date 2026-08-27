import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F0562E',
          dark: '#D8431E',
          light: '#FFF1E9'
        },
        ink: {
          DEFAULT: '#1A1A1A',
          muted: '#6B7280',
          faint: '#9CA3AF'
        },
        success: {
          DEFAULT: '#22C55E',
          bg: '#DCFCE7',
          text: '#15803D'
        },
        danger: {
          DEFAULT: '#EF4444',
          bg: '#FEE2E2',
          text: '#B91C1C'
        },
        warn: {
          DEFAULT: '#F59E0B',
          bg: '#FEF3C7',
          text: '#B45309'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        canvas: 'radial-gradient(ellipse at top, #FAFAFA 0%, #ECECEC 100%)'
      }
    }
  },
  plugins: []
};

export default config;
