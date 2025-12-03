/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"SF Pro"', "Roboto", '"Noto Sans"', "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
        bebas: ["Bebas Neue", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
        seogoe: ['"Segoe UI"', "sans-serif"],
        montserrat: ["Montserrat", "Arial", "sans-serif"],
      },
      colors: {
        // Primary brand colors
        brand: {
          primary: '#38bdf8',
          secondary: '#06b6d4',
          accent: '#f97316',
        },
        // Background colors
        surface: {
          primary: '#0f0f0f',
          secondary: '#1a1a1a',
          tertiary: '#252525',
          card: '#1e1e1e',
          elevated: '#2a2a2a',
        },
      },
      gridTemplateColumns: {
        10: "repeat(10, minmax(0, 1fr))",
        15: "repeat(15, minmax(0, 1fr))",
      },
      width: {
        "movie-col-1": "calc((100% - theme('gap.2') * 0) / 1)",
        "movie-col-2": "calc((100% - theme('gap.2') * 1) / 2)",
        "movie-col-3": "calc((100% - theme('gap.2') * 2) / 3)",

        "movie-col-1": "calc((100% - theme('gap.3') * 0) / 1)",
        "movie-col-2": "calc((100% - theme('gap.3') * 1) / 2)",
        "movie-col-3": "calc((100% - theme('gap.3') * 2) / 3)",
        "movie-col-4-sm": "calc((100% - theme('gap.3') * 3) / 4)",
        "movie-col-5-md": "calc((100% - theme('gap.3') * 4) / 5)",
        "movie-col-6-lg": "calc((100% - theme('gap.3') * 6) / 7)",
        "movie-card-col-2": "calc((100% - theme('gap.3') * 1) / 2)",
        "movie-card-col-3-sm": "calc((100% - theme('gap.3') * 2) / 3)",
        "movie-card-col-4-md": "calc((100% - theme('gap.3') * 2) / 3)",
        "movie-card-col-4-lg": "calc((100% - theme('gap.3') * 3) / 4)",
        "movie-card-col-3-lg": "calc((100% - theme('gap.3') * 2) / 3)",
        "movie-card-col-5-xl": "calc((100% - theme('gap.3') * 4) / 5)",
        "movie-card-col-4-xl": "calc((100% - theme('gap.3') * 3) / 4)",
        "half-gap": "calc((100% - 0.75rem * 0) / 1)",
      },
      screens: {
        "3xl": "1692px",
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite linear',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(56, 189, 248, 0.2)',
        'glow-md': '0 0 20px rgba(56, 189, 248, 0.3)',
        'glow-lg': '0 0 30px rgba(56, 189, 248, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
