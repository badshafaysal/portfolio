import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Custom domain: set SITE_URL in Cloudflare Pages (Settings → Environment variables)
// or edit the fallback below. robots.txt, sitemap and meta tags all follow this value.
export default defineConfig({
  site: process.env.SITE_URL || 'https://badshafaysal.pages.dev',
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
