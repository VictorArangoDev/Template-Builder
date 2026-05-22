// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';
import { fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },
  
  adapter: node({
    mode: 'standalone',
    
  }),
  
  fonts: [{
    provider: fontProviders.fontsource(),
    name: "Geist Mono",
    cssVariable: "--font-sans",
  }]
  
});