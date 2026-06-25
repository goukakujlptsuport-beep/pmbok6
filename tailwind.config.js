/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './books/**/*.html',
    './lib/reader-shell.js',
    './*.html',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        navy:       { DEFAULT: '#1a2744', light: '#2a3a6a', dark: '#0f1d3a' },
        gold:       { DEFAULT: '#c9a84c', light: '#e8d5a3', dim: 'rgba(201,168,76,0.12)' },
        cream:      '#fdf8f0',
        'reader-bg':  'var(--reader-bg)',
        'reader-text':'var(--reader-text)',
      },
      fontFamily: {
        serif:  ["'Merriweather'", 'Georgia', 'serif'],
        sans:   ["'Source Sans 3'", 'Arial', 'sans-serif'],
        mono:   ["'Source Code Pro'", 'monospace'],
        outfit: ["'Outfit'", 'sans-serif'],
      },
      maxWidth: {
        reader: '760px',
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom, 0px)',
      },
      transitionDuration: {
        250: '250ms',
      },
      animation: {
        'slide-up':   'slideUp 0.3s ease-out',
        'fade-in':    'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
