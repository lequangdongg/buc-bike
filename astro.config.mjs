import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';

// Canonical site URL — drives canonical links, hreflang, sitemap and OG image
// URLs. Always the production domain, never the deploy-specific preview URL
// (a *.workers.dev canonical would compete with the real domain in search).
// Override with PUBLIC_SITE_URL when building for a staging domain.
const site = process.env.PUBLIC_SITE_URL || 'https://buckbike.com';

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
  integrations: [
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BuckBike — Electric Scooter Rental',
        short_name: 'BuckBike',
        description: 'Affordable VinFast electric scooter rental in Đà Nẵng. No licence, daily/weekly/monthly.',
        lang: 'en',
        theme_color: '#0b0e0f',
        background_color: '#0b0e0f',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{html,js,css,svg,png,jpg,webp,woff2}'],
        // The home page itself is a fine offline fallback for unknown routes.
        navigateFallbackDenylist: [/^\/(_astro|sitemap)/],
      },
    }),
  ],
});
