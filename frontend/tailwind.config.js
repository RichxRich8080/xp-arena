/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0f1a',
        primary: {
          blue: '#1e3a8a',
        },
        neon: {
          green: '#22c55e',
          cyan: '#06b6d4',
        },
        text: {
          default: '#e5e7eb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Outfit', 'sans-serif'], // Added custom gaming fonts
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
