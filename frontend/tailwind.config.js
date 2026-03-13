/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // Slate 900
        foreground: '#f8fafc', // Slate 50
        surface: {
          low: '#020617', // Slate 950
          default: '#1e293b', // Slate 800
          high: '#334155', // Slate 700
        },
        primary: {
          light: '#60a5fa',
          DEFAULT: '#2563eb', // Professional blue
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#64748b', // Slate 500
          dark: '#475569', // Slate 600
        },
        accent: {
          blue: '#3b82f6',
          indigo: '#6366f1',
          emerald: '#10b981',
        },
        border: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'sans-serif'], // Professional apps often use the same font for both
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-in-fast': 'slideIn 0.15s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'progress-scan': 'progressScan 2s linear infinite',
        'scan-y': 'scanY 4s linear infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 15px rgba(34, 197, 94, 0.8))' },
        },
        progressScan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scanY: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        }
      }
    },
  },
  plugins: [],
}
