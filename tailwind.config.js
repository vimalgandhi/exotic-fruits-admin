/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F3F8',
          100: '#D9E1EB',
          200: '#B5CADB',
          300: '#7FA6C6',
          400: '#4F7BB3',
          500: '#2D5399',
          600: '#1A2B4B',
          700: '#152240',
          800: '#0F1935',
          900: '#0A1028',
        },
        gold: {
          50: '#FFFBF0',
          100: '#FEF5E7',
          200: '#FDD9A3',
          300: '#F9C880',
          400: '#D9A84C',
          500: '#C9A84C',
          600: '#B89A3E',
          700: '#9D7F2A',
          800: '#7A6417',
          900: '#4A3B0A',
        },
        error: {
          50: '#FEE2E2',
          100: '#FCA5A5',
          500: '#DC2626',
          600: '#B91C1C',
          700: '#991B1B',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#16A34A',
          600: '#15803D',
          700: '#166534',
        },
      },
    },
  },
  plugins: [],
}
