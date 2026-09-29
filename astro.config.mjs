import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Change `site` to your real domain (custom domain or *.pages.dev URL).
export default defineConfig({
  site: 'https://badshafaysal.pages.dev',
  output: 'static',
  integrations: [sitemap()],
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true,
      assetsInlineLimit: 4096,
    },
  },
});
