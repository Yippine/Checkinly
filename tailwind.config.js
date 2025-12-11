/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ant Design Pro Color System
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff', // Primary Blue
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
        },
        // Secondary Palette: Geek Blue
        secondary: {
          50: '#f0f5ff',
          100: '#d6e4ff',
          200: '#adc6ff',
          300: '#85a5ff',
          400: '#597ef7',
          500: '#2f54eb',
          600: '#1d39c4',
          700: '#10239e',
          800: '#061178',
          900: '#030852',
        },
        // Success Palette: Polar Green
        success: {
          50: '#f6ffed',
          100: '#d9f7be',
          200: '#b7eb8f',
          300: '#95de64',
          400: '#73d13d',
          500: '#52c41a',
          600: '#389e0d',
          700: '#237804',
          800: '#135200',
          900: '#092b00',
          DEFAULT: '#52c41a',
          light: '#95de64',
          dark: '#389e0d',
        },
        // Warning Palette: Sunset Orange
        warning: {
          50: '#fffbe6',
          100: '#fff1b8',
          200: '#ffe58f',
          300: '#ffd666',
          400: '#ffc53d',
          500: '#faad14',
          600: '#d48806',
          700: '#ad6800',
          800: '#874d00',
          900: '#613400',
          DEFAULT: '#faad14',
          light: '#ffc53d',
          dark: '#d48806',
        },
        // Error Palette: Dust Red
        error: {
          50: '#fff1f0',
          100: '#ffccc7',
          200: '#ffa39e',
          300: '#ff7875',
          400: '#ff4d4f',
          500: '#f5222d',
          600: '#cf1322',
          700: '#a8071a',
          800: '#820014',
          900: '#5c0011',
          DEFAULT: '#f5222d',
          light: '#ff4d4f',
          dark: '#cf1322',
        },
        // Neutral Palette: Gray Scale
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e8e8e8',
          300: '#d9d9d9',
          400: '#bfbfbf',
          500: '#8c8c8c',
          600: '#595959',
          700: '#434343',
          800: '#262626',
          900: '#141414',
        },
        // Background & Surface
        background: '#f0f2f5',
        card: '#ffffff',
        border: {
          DEFAULT: '#d9d9d9',
          light: '#e8e8e8',
          dark: '#bfbfbf',
        },
        'border-light': '#e8e8e8',
        'border-default': '#d9d9d9',
        'border-dark': '#bfbfbf',
        // Text Colors
        text: {
          primary: 'rgba(0, 0, 0, 0.85)', // 85% black
          secondary: 'rgba(0, 0, 0, 0.65)', // 65% black
          tertiary: 'rgba(0, 0, 0, 0.45)', // 45% black
          disabled: 'rgba(0, 0, 0, 0.25)', // 25% black
          inverse: '#ffffff',
        },
        // Sidebar (Light Theme)
        sidebar: {
          bg: '#001529', // Dark sidebar (Ant Design default)
          'bg-light': '#ffffff', // Light sidebar alternative
          hover: '#1890ff10',
          active: '#e6f7ff',
          border: '#f0f0f0',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'Roboto', "'Helvetica Neue'", 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'heading-1': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'heading-2': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'heading-3': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'heading-4': ['14px', { lineHeight: '22px', fontWeight: '600' }],
        'body-large': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-small': ['12px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '20px', fontWeight: '400' }],
        'overline': ['10px', { lineHeight: '16px', fontWeight: '600' }],
        'small': ['12px', { lineHeight: '20px', fontWeight: '400' }],
      },
      spacing: {
        '4.5': '18px',
        '7': '28px',
        '9': '36px',
        '10': '40px',
        '11': '44px',
        '14': '56px',
        '18': '72px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        'sm': '2px',
        'base': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'none': 'none',
        'sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
        'card': '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
        'card-hover': '0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 6px -1px rgba(0,0,0,0.05)',
        'dropdown': '0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)',
        'modal': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'drawer': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      },
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
        'fade-slide-up': 'fadeSlideUp 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeSlideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      transitionTimingFunction: {
        'ant': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      },
      scale: {
        '98': '0.98',
        '102': '1.02',
        '105': '1.05',
        '110': '1.10',
      },
    },
  },
  plugins: [],
  safelist: [
    'animate-fade-in',
    'animate-fade-slide-up',
    'animate-pulse',
    'animate-spin',
    'active:scale-98',
  ],
}
