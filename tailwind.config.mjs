/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        nanaksar: {
          crimson: '#D01B1B',
          'crimson-hover': '#B81414',
          'crimson-dark': '#C62828',
          gold: '#E4A834',
          'gold-vintage': '#C89B53',
          'gold-dark': '#965C00', // WCAG AAA 4.65:1 on light cream
          saffron: '#F27A24',
          'saffron-dark': '#842F06', // WCAG AAA on cream
          obsidian: '#0F0F0F',
          charcoal: '#0F0F0F',
          'charcoal-card': '#181818',
          slate: '#161616',
          elevated: '#202020',
          cream: '#F7F4EB',
          'cream-accent': '#F4EBD0',
          veg: '#15803D',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Cinzel"', '"Cormorant Garamond"', 'serif'],
        editorial: ['"Cormorant Garamond"', 'serif'],
        mono: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '390px',
      },
    },
  },
  plugins: [],
};
