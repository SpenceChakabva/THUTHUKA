/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode via class strategy
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F5F0E8',
          warm: '#EDE7D9',
          deep: '#D4CBB8',
          dark: '#1e1e1e', // Dark mode equivalent
        },
        terracotta: {
          DEFAULT: '#C1440E',
          light: '#E8694A',
          pale: '#F5E2DA',
          darkpale: '#3A2016', // Dark mode pale equivalent
        },
        forest: {
          DEFAULT: '#1A3329',
          mid: '#2D5444',
          light: '#4A7C68',
          pale: '#EAF0ED',
          darkpale: '#1A2923', // Dark mode pale equivalent
        },
        amber: {
          DEFAULT: '#D4820A',
          pale: '#FDF3DC',
          darkpale: '#3F2C14',
        },
        sage: {
          DEFAULT: '#5A8A6F',
          pale: '#E8F3ED',
          darkpale: '#1E2C24',
        },
        clay: {
          red: '#9B2818',
          pale: '#FDECEA',
          darkpale: '#351B18',
        },
        text: {
          primary: '#1A3329',
          secondary: '#4A7C68',
          muted: '#8AA89B',
          inverse: '#F5F0E8',
          // Dark mode text
          dark: {
            primary: '#E5E7EB',
            secondary: '#9CA3AF',
            muted: '#6B7280',
          }
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['DM Mono', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(26,51,41,0.06), 0 1px 2px rgba(26,51,41,0.04)',
        md: '0 4px 12px rgba(26,51,41,0.08), 0 2px 4px rgba(26,51,41,0.04)',
        lg: '0 12px 32px rgba(26,51,41,0.10), 0 4px 8px rgba(26,51,41,0.06)',
        card: '0 2px 8px rgba(26,51,41,0.07)',
        float: '0 8px 24px rgba(26,51,41,0.12)',
        'dark-card': '0 2px 8px rgba(0,0,0,0.4)',
        'dark-float': '0 8px 24px rgba(0,0,0,0.6)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        instant: '80ms',
        fast: '150ms',
        normal: '240ms',
        slow: '380ms',
        reveal: '600ms',
      }
    },
  },
  plugins: [],
}
