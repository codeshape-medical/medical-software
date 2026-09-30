/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A1330', // deepest sidebar bg
          900: '#0D1B3F', // sidebar bg
          800: '#122452', // sidebar hover / card header
          700: '#1B3168', // active nav item
          600: '#24408A', // borders on navy
        },
        brand: {
          blue: '#2F6FED',   // primary action blue
          teal: '#0E9B8A',
          green: '#16A34A',
          orange: '#F59E0B',
          red: '#DC2626',
          purple: '#7C3AED',
          pink: '#DB2777',
        },
        surface: {
          bg: '#F3F5FA',     // main content background
          card: '#FFFFFF',
          border: '#E5E9F2',
          muted: '#8792A8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.04)',
      },
      borderRadius: {
        xl2: '14px',
      }
    },
  },
  plugins: [],
}
