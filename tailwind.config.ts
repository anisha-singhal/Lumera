import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Lumera Brand Colors - Simplified Aliases (Mobile-First)
        lumera: {
          ivory: '#F6F1EB',      // Primary Background
          burgundy: '#800020',    // Burgundy 815 - Primary brand burgundy
          gold: '#C9A24D',        // Champagne Gold - Accents
          beige: '#E7DED4',       // Velvet Beige - Card backgrounds
          charcoal: '#1C1C1C',    // Charcoal Black - Text
        },
        // Full Lumera Brand Colors - Extended Palette
        burgundy: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d2d9',
          300: '#f4adb9',
          400: '#ec7d93',
          500: '#df5070',
          600: '#cb2d55',
          700: '#ab2145',
          800: '#6e1629',
          815: '#800020', // Burgundy 815 - Primary brand burgundy
          840: '#70001C', // Burgundy 840 - Footer background
          900: '#4A0404', // Burgundy 900 - Bold accent
          950: '#420a18',
        },
        champagne: {
          50: '#fdfcf9',
          100: '#faf8f0',
          200: '#f5f0e1',
          300: '#ede4c9',
          400: '#e2d4a7',
          500: '#C9A24D', // Champagne Gold (Primary Accent)
          600: '#c4a85f',
          700: '#a8894a',
          800: '#8a6f40',
          900: '#725c37',
          950: '#3e301c',
        },
        ivory: {
          50: '#fefdfb',
          100: '#F6F1EB', // Soft Ivory (Primary Background)
          200: '#f3ede0',
          300: '#ebe0cc',
          400: '#deccab',
          500: '#d1b88a',
          600: '#c19f6b',
          700: '#a6845a',
          800: '#886c4d',
          900: '#705941',
          950: '#3b2e21',
        },
        velvet: {
          50: '#fefbf8',
          100: '#fdf8f3',
          200: '#faf3e8',
          300: '#E7DED4', // Velvet Beige
          400: '#d4b5a0',
          500: '#c1a08e',
          600: '#b08a78',
          700: '#9d6f62',
          800: '#7a564e',
          900: '#5a3d39',
          950: '#3b271f',
        },
        charcoal: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1F2937',
          900: '#1C1C1C', // Charcoal Black (Primary Text)
          950: '#111827',
        },
        warmgray: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#ebe8e3',
          300: '#dcd6ce',
          400: '#c9beb3',
          500: '#b8a89a',
          600: '#9d8d7f',
          700: '#7a6d63',
          800: '#6E6E6E', // Warm Grey (Secondary Text)
          900: '#4a4139',
          950: '#2a251f',
        },
      },
      // Mobile-first minimum touch target
      minHeight: {
        'touch': '48px',
      },
      fontFamily: {
        // Luxury serif fonts for headings
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        display: ['Cormorant Garamond', 'serif'],
        // Clean sans-serif for body
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'heading-xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '0.01em' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body-md': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      letterSpacing: {
        'luxury': '0.15em',
        'wide-luxury': '0.25em',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(128, 0, 32, 0.2)' }, /* Burgundy 815 */
          '100%': { boxShadow: '0 0 20px rgba(128, 0, 32, 0.4)' }, /* Burgundy 815 */
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-luxury': 'linear-gradient(135deg, #F6F1EB 0%, #E7DED4 50%, #F6F1EB 100%)',
        'gradient-burgundy': 'linear-gradient(135deg, #800020 0%, #ab2145 50%, #800020 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(201, 162, 77, 0.1) 50%, transparent 100%)',
      },
      boxShadow: {
        'luxury': '0 4px 20px rgba(128, 0, 32, 0.08)', /* Burgundy 815 */
        'luxury-lg': '0 8px 40px rgba(128, 0, 32, 0.12)', /* Burgundy 815 */
        'luxury-xl': '0 12px 60px rgba(128, 0, 32, 0.16)', /* Burgundy 815 */
        'gold': '0 4px 20px rgba(201, 162, 77, 0.15)',
        'inner-luxury': 'inset 0 2px 10px rgba(128, 0, 32, 0.05)', /* Burgundy 815 */
      },
      borderRadius: {
        'luxury': '2px',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'luxury-out': 'cubic-bezier(0.0, 0, 0.2, 1)',
        'luxury-in': 'cubic-bezier(0.4, 0, 1, 1)',
      },
    },
  },
  plugins: [],
}

export default config
