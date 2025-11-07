/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'flevo': {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#111937',
          950: '#0a0d1f',
        },
        'accent': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#f6ad55',
          500: '#ff8f00',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        'gold': {
          400: '#f9bc18',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'float-down': 'floatDown 8s linear infinite',
        'float-down-delayed': 'floatDown 8s linear infinite 2s',
        'float-down-slow': 'floatDown 12s linear infinite 4s',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        floatDown: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0' },
          '5%': { opacity: '0.6' },
          '95%': { opacity: '0.6' },
          '100%': { transform: 'translateY(calc(100vh + 100px)) rotate(360deg)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}