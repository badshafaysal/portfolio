import type { APIRoute } from 'astro';

// Generated from the `site` value in astro.config.mjs so it always matches your domain.
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL('https://badshafaysal.pages.dev')).origin;
  const body = `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${base}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
