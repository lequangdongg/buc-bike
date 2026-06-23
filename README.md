# BuckBike — rebuild

A polished, animated, multilingual rebuild of [buckbike.com](https://www.buckbike.com/) —
an electric-scooter rental service in Đà Nẵng, Vietnam. Built as a technical demo of
Astro + Motion One + i18next.

## Stack

- **Astro 7** (static / SSG) with `<ClientRouter />` view transitions
- **Tailwind CSS v4** (CSS-first `@theme`, dark-default + light toggle)
- **Motion One** (`motion`) — scroll-hide header, scroll progress, in-view stagger reveal,
  parallax, scroll-linked hero, count-up, page transitions + shared-element bike morph
- **i18next** (vanilla, build-time) — 6 locales with URL prefixes
- **TypeScript** (strict) · **pnpm** · **Vitest** for pure logic
- `sharp` image optimization, `@astrojs/sitemap`

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
pnpm preview    # serve the build
pnpm check      # astro type-check
pnpm test       # vitest (i18n + pricing)
```

## Pages & routes

| Page  | EN          | Localized           |
| ----- | ----------- | ------------------- |
| Home  | `/`         | `/{lang}/`          |
| Fleet | `/fleet`    | `/{lang}/fleet`     |
| Bike  | `/fleet/:id`| `/{lang}/fleet/:id` |
| Price | `/price`    | `/{lang}/price`     |

`lang` ∈ `vi · ru · ja · ko · zh` (English is the unprefixed default).

## Structure

- `src/i18n/` — locale config, path helpers, i18next factory
- `src/locales/{lang}/common.json` — translations (English is the source of truth)
- `src/data/` — fleet specs, pricing matrix, business NAP
- `src/lib/motion/` — one Motion helper per effect; all respect `prefers-reduced-motion`
- `src/lib/seo.ts` — JSON-LD builders (`LocalBusiness`, `Product`, `Offer`)
- `src/components/` — UI components; `src/components/pages/` — page bodies reused by EN and `[lang]` routes
- `src/layouts/Base.astro` — `<head>`, ClientRouter, header/footer, animation bootstrap
- `scripts/fetch-assets.mjs` — one-off downloader for the live-site images

## SEO & discoverability

- Semantic HTML, canonical + `hreflang` (all 6 locales + `x-default`) on every page
- Open Graph + Twitter `summary_large_image` cards (`public/og/default.png`)
- JSON-LD: `LocalBusiness` (home), `Product`/`Offer` (fleet & price), `FAQPage` (price)
- `public/llms.txt` for AI-agent discoverability, `robots.txt`, generated `sitemap-index.xml`

## Accessibility

- Dark/light theme persisted in `localStorage`, applied before paint (no flash)
- Visible keyboard focus, skip-to-content link, `aria-current` nav state
- All animation is disabled under `prefers-reduced-motion: reduce` (CSS net + per-helper guards)

## Notes & attribution

- **Content** (copy, fleet, business details) is **adapted from buckbike.com** for a technical
  demo. Not affiliated with or endorsed by BuckBike.
- **Images** in `src/assets/` were downloaded from the live site for this demo.
- **Pricing is illustrative** — the live store does not publish rates; the numbers here are
  realistic placeholders and are flagged as such in the UI.
- **Translations** for RU / JA / KO / ZH are machine-assisted and should be reviewed by a
  native speaker before any production use. EN and VI are authored.
