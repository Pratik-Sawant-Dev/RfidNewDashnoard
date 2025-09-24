/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#c7ddff',
          300: '#a5c4ff',
          400: '#829eff',
          500: '#3674B5',
          600: '#2d5ea3',
          700: '#244a91',
          800: '#1b377f',
          900: '#12236d',
        },
        secondary: {
          50: '#f3f8fd',
          100: '#e7f1fb',
          200: '#cfe3f7',
          300: '#a7ccf0',
          400: '#7bb2e7',
          500: '#578FCA',
          600: '#4a7bb8',
          700: '#3d67a6',
          800: '#305394',
          900: '#233f82',
        },
        accent: {
          50: '#fefdf6',
          100: '#fdfced',
          200: '#fbf8db',
          300: '#f8f2c0',
          400: '#f7eba2',
          500: '#F5F0CD',
          600: '#e8e0a5',
          700: '#dbd07d',
          800: '#cec055',
          900: '#c1b02d',
        },
        gold: {
          50: '#fffdf0',
          100: '#fffbe1',
          200: '#fff7c3',
          300: '#fff2a5',
          400: '#ffed87',
          500: '#FADA7A',
          600: '#e8c662',
          700: '#d6b24a',
          800: '#c49e32',
          900: '#b28a1a',
        }
      },
      fontFamily: {
        'elegant': ['Playfair Display', 'serif'],
        'modern': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      }
    },
  },
  plugins: [],
}
