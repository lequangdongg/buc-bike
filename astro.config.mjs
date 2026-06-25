import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Canonical site URL. On Vercel it resolves to the production domain
// (custom domain if set, otherwise the project's *.vercel.app), so canonical
// links, hreflang, sitemap and OG image URLs are correct on every deploy.
// Override locally/anywhere with PUBLIC_SITE_URL.
const site =
  process.env.PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://buckbike.com');

export default defineConfig({
  site,
  // All pages are static (SSG). Prefetch every in-page link as it enters the
  // viewport so navigation from the home page (and anywhere) is instant —
  // the target HTML is already fetched before the click.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap()],
});
