import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://nanaksardhaba.com',
  server: {
    host: '127.0.0.1',
    port: 4321,
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', '@nanostores/react', 'nanostores'],
    },
  },
});
