import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 4321,
  },
  prefetch: {
    prefetchAll: true,
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
      include: ['lucide-react', 'react', 'react-dom', '@nanostores/react', 'nanostores'],
    },
  },
});
