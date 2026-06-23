# BuckBike Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild buckbike.com (an electric-scooter rental service in Đà Nẵng) as a polished, animated, multilingual static site with strong SEO and AI-agent discoverability.

**Architecture:** Astro v5 static site (SSG) with `<ClientRouter />` for navigation/page-transitions; Motion One drives all in-page + cross-page animation; i18next (build-time, vanilla) powers 6 locales via URL prefixes; Tailwind v4 (CSS-first) provides a dark-default / light-toggle design system. Real copy is scraped from the live site; images are downloaded locally and optimized by Astro. Each page emits JSON-LD, Open Graph, Twitter cards, hreflang, plus a project-level `llms.txt` and sitemap.

**Tech Stack:** Astro v5 · Tailwind v4 (`@tailwindcss/vite`) · `motion` (Motion One) · `i18next` · TypeScript (strict) · pnpm

**Note on verification:** This is a visual/animation frontend project, so classic unit-TDD does not fit most tasks. The verification discipline here is: **`pnpm astro check` (types) + `pnpm build` (must succeed) + manual visual check in `pnpm dev`** after each task, followed by a commit. Where pure logic exists (i18n helpers, pricing math), real unit tests with Vitest are written test-first.

---

## File Structure

```
buc-bike/
├── astro.config.mjs            # Astro + Tailwind v4 vite plugin + sitemap
├── tsconfig.json               # strict
├── package.json
├── README.md                   # setup, data-source attribution, translation-review note
├── public/
│   ├── llms.txt                # AI-agent discoverability
│   ├── robots.txt
│   └── og/                     # generated/placed social preview images
├── src/
│   ├── assets/                 # downloaded bike/banner images (Astro-optimized)
│   ├── data/
│   │   ├── fleet.ts            # bike specs (language-neutral: ids, range, images, price keys)
│   │   ├── pricing.ts          # price matrix (model × period) + math helpers
│   │   └── business.ts         # NAP: name/address/phone, hours, geo, reviews, socials
│   ├── i18n/
│   │   ├── config.ts           # locales list, default, helpers (getLocale, localizePath)
│   │   ├── index.ts            # i18next init + t() factory for a given locale
│   │   └── ui.ts               # typed key helper
│   ├── locales/
│   │   ├── en/common.json      # source-of-truth copy (scraped)
│   │   ├── vi/common.json
│   │   ├── ru/common.json
│   │   ├── ja/common.json
│   │   ├── ko/common.json
│   │   └── zh/common.json
│   ├── lib/
│   │   ├── motion/
│   │   │   ├── scrollHideHeader.ts
│   │   │   ├── reveal.ts        # inView + stagger
│   │   │   ├── parallax.ts
│   │   │   ├── scrollProgress.ts
│   │   │   ├── heroScroll.ts    # scroll-linked hero
│   │   │   ├── countUp.ts
│   │   │   └── pageTransition.ts
│   │   └── seo.ts              # buildMeta(), buildJsonLd()
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── LanguageSwitcher.astro
│   │   ├── ThemeToggle.astro
│   │   ├── ScrollProgress.astro
│   │   ├── SectionReveal.astro
│   │   ├── BikeCard.astro
│   │   ├── PriceTable.astro
│   │   └── Seo.astro
│   ├── layouts/
│   │   └── Base.astro          # <head>, ClientRouter, header/footer, motion bootstrap
│   ├── styles/
│   │   └── global.css          # @import tailwind + @theme tokens + fonts
│   └── pages/
│       ├── index.astro                 # EN home
│       ├── fleet/index.astro           # EN fleet list
│       ├── fleet/[bike].astro          # EN bike detail (getStaticPaths)
│       ├── price.astro                 # EN price
│       └── [lang]/                     # vi|ru|ja|ko|zh mirror of the above
│           ├── index.astro
│           ├── fleet/index.astro
│           ├── fleet/[bike].astro
│           └── price.astro
└── scripts/
    └── fetch-assets.mjs        # one-off downloader for live-site images
```

---

## Reference Data (scraped from live site — source of truth for `en/common.json`)

**Business (NAP):**
- Name: BuckBike — Renting Electric Scooters
- Address: 31 - B2 An Thuong 37, Bắc Mỹ An, Ngũ Hành Sơn, Đà Nẵng 550000, Vietnam
- Phone: +84 978 789 133
- Hours: Open · Closes 11 PM (10:00–23:00 assumed)
- Rating: 4.9 (62 reviews)
- Map: https://maps.app.goo.gl/4r7hXgFa3zhd7WGD6
- Site: buckbike.com

**Fleet:**
| id | name | blurb | range |
|----|------|-------|-------|
| evo-200-lite | VinFast Evo 200 Lite | Light, agile and fully electric. Ideal for daily city rides. | up to 120 km |
| feliz-s | VinFast Feliz S | Modern design, smooth ride and excellent stability. Perfect for exploring at your pace. | up to 100 km |
| theon | VinFast Theon | Powerful and sporty. Best choice for longer trips and countryside adventures. | up to 150 km |

**Hero:** "Hit the road. No hassle." / "Book your scooter in minutes. Daily, weekly and monthly plans. Modern fleet, 24h support and full coverage."

**Features (Simple. Fast. Reliable.):** Book in Minutes · Electric Fleet. Zero Fuel. · Plans that Fit Your Budget. · Private Driver. 24 Hours.

**How to book (4 steps):** Visit our store → Select the period → Pay (cash/bank transfer) → Pick up your bike.

**What you need:** Passport photo · Cash or bank transfer.

**Advantages:** No licence required · Zero fuel costs · 100% eco-friendly · Most economical option.

**Plans:** Daily (helmet included) · Weekly (7 days, priority support) · Monthly ⭐ (30 days, maintenance + bike swap). All plans include: fully charged battery · free helmet · 24h WhatsApp support · no licence needed. Payment: cash or bank transfer only.

**Invented pricing (illustrative — flag in UI & README):**
| model | daily (₫) | weekly (₫) | monthly (₫) |
|-------|-----------|------------|-------------|
| evo-200-lite | 150,000 | 850,000 | 2,800,000 |
| feliz-s | 180,000 | 1,000,000 | 3,200,000 |
| theon | 220,000 | 1,250,000 | 3,900,000 |

---

## Task 0: Initialize project & tooling

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro` (temporary)

- [ ] **Step 1: Scaffold Astro (TS, empty) with pnpm**

```bash
cd /Users/dongquang/Desktop/buc-bike
pnpm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --skip-houston
pnpm add astro
pnpm add -D @astrojs/check typescript
git init
```

- [ ] **Step 2: Add Tailwind v4, Motion, i18next, sitemap**

```bash
pnpm add tailwindcss @tailwindcss/vite motion i18next
pnpm add @astrojs/sitemap
```

- [ ] **Step 3: Configure `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://buckbike.com',
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap()],
});
```

- [ ] **Step 4: Set `tsconfig.json` to strict**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Verify dev server boots**

Run: `pnpm dev` (then Ctrl-C) and `pnpm astro check`
Expected: dev server starts on :4321; check reports 0 errors.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: init astro + tailwind v4 + motion + i18next"
```

---

## Task 1: Download live-site assets

**Files:**
- Create: `scripts/fetch-assets.mjs`, `src/assets/*` (downloaded)

- [ ] **Step 1: Write the downloader**

```js
// scripts/fetch-assets.mjs
import { mkdir, writeFile } from 'node:fs/promises';
const BASE = 'https://www.buckbike.com/assets/images/';
const files = ['card-1.png', 'card-2.png', 'card-3.png', 'card-4.png', 'banner-wide.png'];
await mkdir('src/assets', { recursive: true });
for (const f of files) {
  const res = await fetch(BASE + f);
  if (!res.ok) { console.warn('skip', f, res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(`src/assets/${f}`, buf);
  console.log('saved', f, buf.length, 'bytes');
}
```

- [ ] **Step 2: Run it**

Run: `node scripts/fetch-assets.mjs`
Expected: each file prints "saved … bytes". If a file 404s, note it; we will substitute a free stock image and record the swap in README.

- [ ] **Step 3: Map assets to bikes** — assign `card-1`→evo-200-lite, `card-2`→feliz-s, `card-3`→theon, `banner-wide`→hero/banner. Rename copies to semantic names: `bike-evo-200-lite.png`, `bike-feliz-s.png`, `bike-theon.png`, `banner.png`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: download and map live-site images locally"
```

---

## Task 2: i18n infrastructure (test-first)

**Files:**
- Create: `src/i18n/config.ts`, `src/i18n/index.ts`, `src/locales/*/common.json`
- Test: `src/i18n/config.test.ts`

- [ ] **Step 1: Add Vitest**

```bash
pnpm add -D vitest
```
Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing test for path helpers**

```ts
// src/i18n/config.test.ts
import { describe, it, expect } from 'vitest';
import { LOCALES, DEFAULT_LOCALE, localizePath, getLocaleFromPath } from './config';

describe('i18n config', () => {
  it('lists 6 locales with en default', () => {
    expect(DEFAULT_LOCALE).toBe('en');
    expect(LOCALES).toEqual(['en', 'vi', 'ru', 'ja', 'ko', 'zh']);
  });
  it('localizePath leaves default locale unprefixed', () => {
    expect(localizePath('/fleet', 'en')).toBe('/fleet');
    expect(localizePath('/', 'en')).toBe('/');
  });
  it('localizePath prefixes non-default locales', () => {
    expect(localizePath('/fleet', 'vi')).toBe('/vi/fleet');
    expect(localizePath('/', 'ja')).toBe('/ja/');
  });
  it('getLocaleFromPath reads the prefix', () => {
    expect(getLocaleFromPath('/vi/fleet')).toBe('vi');
    expect(getLocaleFromPath('/fleet')).toBe('en');
  });
});
```

- [ ] **Step 3: Run it — expect FAIL**

Run: `pnpm test`
Expected: FAIL ("Cannot find module './config'").

- [ ] **Step 4: Implement `src/i18n/config.ts`**

```ts
export const LOCALES = ['en', 'vi', 'ru', 'ja', 'ko', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English', vi: 'Tiếng Việt', ru: 'Русский', ja: '日本語', ko: '한국어', zh: '中文',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  return seg && isLocale(seg) ? seg : DEFAULT_LOCALE;
}

export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return `/${locale}${clean === '/' ? '/' : clean}`;
}
```

- [ ] **Step 5: Run it — expect PASS**

Run: `pnpm test`
Expected: PASS (4 tests).

- [ ] **Step 6: Create `src/locales/en/common.json`** (source of truth — full copy)

```json
{
  "site": { "name": "BuckBike", "tagline": "Renting Electric Scooters" },
  "nav": { "home": "Home", "fleet": "Fleet", "price": "Pricing", "book": "Book Now" },
  "hero": {
    "kicker": "Electric Scooter Rental — Đà Nẵng",
    "title_line1": "Hit the road.",
    "title_line2": "No hassle.",
    "subtitle": "Book your scooter in minutes. Daily, weekly and monthly plans. Modern fleet, 24h support and full coverage.",
    "cta_primary": "Book Now",
    "cta_secondary": "See Fleet"
  },
  "features": {
    "heading": "Simple. Fast. Reliable.",
    "kicker": "Everything you need",
    "items": [
      { "title": "Book in Minutes.", "body": "No licence? No problem. Choose, confirm and ride. Zero bureaucracy." },
      { "title": "Electric Fleet. Zero Fuel.", "body": "Electric scooters. No fuel, no licence, zero emissions. Always serviced." },
      { "title": "Plans that Fit Your Budget.", "body": "Daily, weekly or monthly. Cash only. No hidden fees." },
      { "title": "Private Driver. 24 Hours.", "body": "Door-to-door comfort with a dedicated chauffeur. Any time, any destination." }
    ]
  },
  "booking": {
    "kicker": "Step by step",
    "heading": "How to Book Your Bike",
    "steps": [
      { "title": "Visit our store", "body": "Come to our store and choose your favourite model in person. Our team will guide you." },
      { "title": "Select the period", "body": "Set the pick-up and return dates. Daily, weekly or monthly plans." },
      { "title": "Pay: cash or bank transfer", "body": "We accept cash or direct bank account transfer. No cards or digital wallets." },
      { "title": "Pick up your bike", "body": "Show your ID and pick up the bike at the agreed address. Off you go." }
    ],
    "need_heading": "What you need",
    "need": [
      { "title": "Passport photo", "body": "Just send us a photo of your passport. No driver's licence required." },
      { "title": "Cash or bank transfer", "body": "We accept cash or direct bank account transfer only. No cards accepted." }
    ]
  },
  "advantages": {
    "kicker": "Why electric?",
    "items": [
      { "title": "No licence required", "body": "Scooters can be ridden without a driving licence. Perfect for tourists and beginners." },
      { "title": "Zero fuel costs", "body": "Our electric fleet is fully charged and ready. No petrol bills, ever." },
      { "title": "100% eco-friendly", "body": "Zero emissions, zero noise. Explore the city and respect the planet." },
      { "title": "Most economical option", "body": "Far cheaper than taxis and car rental. Maximum savings, zero compromise." }
    ]
  },
  "fleet": {
    "heading": "Bikes for Every Style",
    "kicker": "Available models",
    "available": "Available",
    "range_label": "Range",
    "view_detail": "View details",
    "specs": "Specs",
    "book_this": "Book this bike"
  },
  "price": {
    "heading": "Flexible Plans, No Surprises",
    "kicker": "Choose your plan",
    "disclaimer": "Prices are illustrative and may differ from the live store. Contact us for the latest rates.",
    "period": { "daily": "Daily", "weekly": "Weekly", "monthly": "Monthly" },
    "most_popular": "Most popular",
    "per_day": "/ day", "per_week": "/ week", "per_month": "/ month",
    "includes_heading": "All plans include",
    "includes": [
      "Fully charged battery", "Free helmet", "24h WhatsApp support", "No licence? No problem"
    ],
    "payment_heading": "Payment",
    "payment_body": "We accept cash or direct bank account transfer. No cards accepted.",
    "faq_heading": "Frequently asked",
    "faq": [
      { "q": "Do I need a driving licence?", "a": "No. Our electric scooters require no licence — tourists welcome." },
      { "q": "How do I pay?", "a": "Cash or direct bank transfer only. No cards or digital wallets." },
      { "q": "Is a helmet included?", "a": "Yes, a certified helmet is included with every rental." }
    ]
  },
  "business": {
    "heading": "We Are Waiting For You",
    "kicker": "Come ride with us",
    "reviews": "{{count}} reviews",
    "open_now": "Open · Closes 11 PM",
    "directions": "Get Directions"
  },
  "footer": {
    "rights": "All rights reserved.",
    "made_with": "Rebuilt as a technical demo. Content adapted from buckbike.com."
  },
  "theme": { "toggle": "Toggle theme" },
  "a11y": { "skip": "Skip to content" }
}
```

- [ ] **Step 7: Create the 5 translated locale files** (`vi`, `ru`, `ja`, `ko`, `zh`) mirroring the exact key structure of `en/common.json`. Translate every string. Keep `{{count}}` interpolation intact. (Translator note: machine-assisted; flag RU/JA/KO/ZH for native review in README.)

  Vietnamese (`vi/common.json`) hero example for reference:
  ```json
  "hero": { "title_line1": "Lên đường.", "title_line2": "Không rắc rối.", "subtitle": "Đặt xe máy điện chỉ trong vài phút. Gói ngày, tuần và tháng. Đội xe hiện đại, hỗ trợ 24h.", "cta_primary": "Đặt ngay", "cta_secondary": "Xem đội xe" }
  ```

- [ ] **Step 8: Implement `src/i18n/index.ts` (i18next factory)**

```ts
import i18next, { type i18n } from 'i18next';
import { LOCALES, DEFAULT_LOCALE, type Locale } from './config';

const resources = import.meta.glob<{ default: Record<string, unknown> }>(
  '../locales/*/common.json',
  { eager: true },
);

function buildResources() {
  const out: Record<string, { common: Record<string, unknown> }> = {};
  for (const [path, mod] of Object.entries(resources)) {
    const lng = path.split('/').at(-2)!;
    out[lng] = { common: mod.default };
  }
  return out;
}

const instances = new Map<Locale, i18n>();

export async function getI18n(locale: Locale): Promise<i18n> {
  if (instances.has(locale)) return instances.get(locale)!;
  const instance = i18next.createInstance();
  await instance.init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: LOCALES as unknown as string[],
    ns: ['common'],
    defaultNS: 'common',
    resources: buildResources(),
    returnObjects: true,
    interpolation: { escapeValue: false },
  });
  instances.set(locale, instance);
  return instance;
}

export async function useTranslations(locale: Locale) {
  const instance = await getI18n(locale);
  return instance.getFixedT(locale);
}
```

- [ ] **Step 9: Verify** — `pnpm astro check` (0 errors) and `pnpm test` (PASS).

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat(i18n): 6-locale i18next infra + path helpers (tested)"
```

---

## Task 3: Data layer (fleet, pricing, business)

**Files:**
- Create: `src/data/fleet.ts`, `src/data/pricing.ts`, `src/data/business.ts`
- Test: `src/data/pricing.test.ts`

- [ ] **Step 1: `src/data/fleet.ts`**

```ts
import evo from '../assets/bike-evo-200-lite.png';
import feliz from '../assets/bike-feliz-s.png';
import theon from '../assets/bike-theon.png';
import type { ImageMetadata } from 'astro';

export interface Bike {
  id: 'evo-200-lite' | 'feliz-s' | 'theon';
  name: string;
  image: ImageMetadata;
  rangeKm: number;
  topSpeedKmh: number;
  seats: number;
  available: boolean;
}

export const BIKES: Bike[] = [
  { id: 'evo-200-lite', name: 'VinFast Evo 200 Lite', image: evo, rangeKm: 120, topSpeedKmh: 70, seats: 2, available: true },
  { id: 'feliz-s', name: 'VinFast Feliz S', image: feliz, rangeKm: 100, topSpeedKmh: 78, seats: 2, available: true },
  { id: 'theon', name: 'VinFast Theon', image: theon, rangeKm: 150, topSpeedKmh: 90, seats: 2, available: true },
];

export const getBike = (id: string) => BIKES.find((b) => b.id === id);
```

- [ ] **Step 2: Write failing test for pricing**

```ts
// src/data/pricing.test.ts
import { describe, it, expect } from 'vitest';
import { PRICING, getPrice, formatVnd } from './pricing';

describe('pricing', () => {
  it('has a row per bike', () => {
    expect(Object.keys(PRICING)).toEqual(['evo-200-lite', 'feliz-s', 'theon']);
  });
  it('getPrice returns the right cell', () => {
    expect(getPrice('theon', 'monthly')).toBe(3900000);
  });
  it('formatVnd renders Vietnamese đồng', () => {
    expect(formatVnd(150000)).toBe('150.000 ₫');
  });
});
```

- [ ] **Step 3: Run — expect FAIL**

Run: `pnpm test`
Expected: FAIL (module not found).

- [ ] **Step 4: Implement `src/data/pricing.ts`**

```ts
import type { Bike } from './fleet';

export type Period = 'daily' | 'weekly' | 'monthly';

export const PRICING: Record<Bike['id'], Record<Period, number>> = {
  'evo-200-lite': { daily: 150000, weekly: 850000, monthly: 2800000 },
  'feliz-s': { daily: 180000, weekly: 1000000, monthly: 3200000 },
  'theon': { daily: 220000, weekly: 1250000, monthly: 3900000 },
};

export const getPrice = (id: Bike['id'], period: Period) => PRICING[id][period];

export function formatVnd(amount: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(amount)} ₫`;
}
```

- [ ] **Step 5: Run — expect PASS**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 6: Implement `src/data/business.ts`**

```ts
export const BUSINESS = {
  name: 'BuckBike',
  legalName: 'BuckBike — Electric Scooter Rental',
  phone: '+84978789133',
  phoneDisplay: '+84 978 789 133',
  whatsapp: 'https://wa.me/84978789133',
  email: 'hello@buckbike.com',
  url: 'https://buckbike.com',
  address: {
    street: '31 - B2 An Thuong 37, Bắc Mỹ An',
    district: 'Ngũ Hành Sơn',
    city: 'Đà Nẵng',
    postalCode: '550000',
    country: 'VN',
  },
  geo: { lat: 16.0397, lng: 108.2486 },
  hours: { opens: '10:00', closes: '23:00' },
  rating: { value: 4.9, count: 62 },
  maps: 'https://maps.app.goo.gl/4r7hXgFa3zhd7WGD6',
  socials: {
    facebook: 'https://facebook.com/buckbike',
    instagram: 'https://instagram.com/buckbike',
    x: 'https://x.com/buckbike',
  },
} as const;
```

- [ ] **Step 7: Verify & commit** — `pnpm astro check && pnpm test`, then:

```bash
git add -A && git commit -m "feat(data): fleet, pricing (tested), business NAP"
```

---

## Task 4: Design system — Tailwind v4 theme, fonts, dark/light toggle

**Files:**
- Create: `src/styles/global.css`, `src/components/ThemeToggle.astro`

- [ ] **Step 1: `src/styles/global.css` with `@theme` tokens + fonts**

```css
@import 'tailwindcss';

/* Dark is default; .light on <html> opts into light. */
@custom-variant light (&:where(.light, .light *));

@theme {
  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;

  --color-ink: #e8eef0;          /* default text on dark */
  --color-base: #0c0f10;         /* near-black graphite */
  --color-surface: #15191b;
  --color-surface-2: #1d2326;
  --color-muted: #8a979c;
  --color-accent: #c6ff3a;       /* electric lime */
  --color-accent-2: #2ee6d6;     /* cyan */
  --color-line: #2a3135;
}

:root {
  color-scheme: dark;
  --bg: var(--color-base);
  --fg: var(--color-ink);
  --card: var(--color-surface);
}
.light {
  color-scheme: light;
  --bg: #f7f9f8;
  --fg: #0c0f10;
  --card: #ffffff;
}

@font-face { font-family: 'Space Grotesk'; src: local('Space Grotesk'); font-display: swap; }

html { background: var(--bg); color: var(--fg); font-family: var(--font-body); }

/* Respect reduced motion globally as a safety net. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; }
}
```

  Load Space Grotesk + Inter via Fontsource for reliability:
  ```bash
  pnpm add @fontsource/space-grotesk @fontsource/inter
  ```
  Import them in `Base.astro` (Task 6).

- [ ] **Step 2: `ThemeToggle.astro` (no-flash inline script + button)**

```astro
---
import { useTranslations, } from '../i18n';
import type { Locale } from '../i18n/config';
const { locale } = Astro.props as { locale: Locale };
const t = await useTranslations(locale);
---
<button id="theme-toggle" class="rounded-full p-2 hover:bg-[--card]" aria-label={t('theme.toggle')}>
  <svg class="size-5 dark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></svg>
</button>
<script is:inline>
  // applied before paint (also inlined in <head> in Base.astro)
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => {
    const light = document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', light ? 'light' : 'dark');
  });
</script>
```

- [ ] **Step 3: Verify** — temporarily import `global.css` in the placeholder page, run `pnpm dev`, confirm dark background + lime accent render and toggle flips to light.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(ui): tailwind v4 theme tokens, fonts, dark/light toggle"
```

---

## Task 5: Motion One utilities

**Files:**
- Create all files under `src/lib/motion/`

- [ ] **Step 1: `scrollHideHeader.ts`**

```ts
export function initScrollHideHeader(el: HTMLElement) {
  let last = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        const goingDown = y > last && y > 80;
        el.style.transform = goingDown ? 'translateY(-100%)' : 'translateY(0)';
        el.dataset.scrolled = String(y > 8);
        last = y;
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}
```

- [ ] **Step 2: `reveal.ts` (inView + stagger via Motion One)**

```ts
import { inView, animate, stagger } from 'motion';

export function initReveal() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  inView('[data-reveal]', (element) => {
    const children = element.querySelectorAll<HTMLElement>('[data-reveal-item]');
    const targets = children.length ? children : [element as HTMLElement];
    animate(
      targets,
      { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] },
      { duration: 0.6, delay: stagger(0.08), easing: [0.16, 1, 0.3, 1] },
    );
  }, { margin: '0px 0px -10% 0px' });
}
```

- [ ] **Step 3: `parallax.ts`**

```ts
import { scroll, animate } from 'motion';

export function initParallax() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const depth = Number(el.dataset.parallax ?? '0.2');
    scroll(animate(el, { transform: [`translateY(${-40 * depth}px)`, `translateY(${40 * depth}px)`] }), {
      target: el, offset: ['start end', 'end start'],
    });
  });
}
```

- [ ] **Step 4: `scrollProgress.ts`**

```ts
import { scroll } from 'motion';

export function initScrollProgress(bar: HTMLElement) {
  scroll((progress: number) => { bar.style.transform = `scaleX(${progress})`; });
}
```

- [ ] **Step 5: `heroScroll.ts`**

```ts
import { scroll, animate } from 'motion';

export function initHeroScroll(el: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  scroll(animate(el, { opacity: [1, 0], transform: ['scale(1)', 'scale(1.08)'] }), {
    target: el, offset: ['start start', 'end start'],
  });
}
```

- [ ] **Step 6: `countUp.ts`**

```ts
import { inView, animate } from 'motion';

export function initCountUp() {
  inView('[data-count]', (el) => {
    const target = Number((el as HTMLElement).dataset.count ?? '0');
    const node = el as HTMLElement;
    animate(0, target, {
      duration: 1.4, easing: 'ease-out',
      onUpdate: (v) => { node.textContent = Math.round(v).toLocaleString(); },
    });
  }, { margin: '0px 0px -20% 0px' });
}
```

- [ ] **Step 7: `pageTransition.ts` (Motion-style easing for Astro view transitions)**

```ts
// Helper consumed by Base.astro to register custom transition animations.
export const PAGE_FADE = {
  forwards: {
    old: [{ opacity: [1, 0], transform: ['translateY(0)', 'translateY(-8px)'] }],
    new: [{ opacity: [0, 1], transform: ['translateY(8px)', 'translateY(0)'] }],
  },
  backwards: {
    old: [{ opacity: [1, 0] }],
    new: [{ opacity: [0, 1] }],
  },
} as const;
```

- [ ] **Step 8: Verify** — `pnpm astro check` (0 errors). These are wired up in Task 6.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat(motion): scroll-hide header, reveal, parallax, progress, hero, count-up, page-transition helpers"
```

---

## Task 6: Base layout, Header, Footer, LanguageSwitcher, SEO component

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/{Header,Footer,LanguageSwitcher,ScrollProgress,SectionReveal,Seo}.astro`, `src/lib/seo.ts`

- [ ] **Step 1: `src/lib/seo.ts`**

```ts
import { BUSINESS } from '../data/business';
import { BIKES } from '../data/fleet';
import { PRICING } from '../data/pricing';
import type { Locale } from '../i18n/config';

export interface MetaInput {
  title: string; description: string; locale: Locale; path: string; image?: string;
}

export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.legalName,
    image: `${BUSINESS.url}/og/default.png`,
    telephone: BUSINESS.phoneDisplay,
    url: BUSINESS.url,
    priceRange: '₫₫',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.geo.lat, longitude: BUSINESS.geo.lng },
    openingHours: `Mo-Su ${BUSINESS.hours.opens}-${BUSINESS.hours.closes}`,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: BUSINESS.rating.value, reviewCount: BUSINESS.rating.count },
  };
}

export function buildProductsJsonLd() {
  return BIKES.map((b) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: b.name,
    brand: 'VinFast',
    offers: {
      '@type': 'Offer', priceCurrency: 'VND', price: PRICING[b.id].daily,
      availability: b.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }));
}
```

- [ ] **Step 2: `Seo.astro` (head tags: meta, OG, Twitter, hreflang, JSON-LD)**

```astro
---
import { LOCALES, localizePath, DEFAULT_LOCALE, type Locale } from '../i18n/config';
interface Props { title: string; description: string; locale: Locale; path: string; image?: string; jsonLd?: object[]; }
const { title, description, locale, path, image = '/og/default.png', jsonLd = [] } = Astro.props;
const site = Astro.site?.toString().replace(/\/$/, '') ?? 'https://buckbike.com';
const canonical = site + localizePath(path, locale);
const ogImage = image.startsWith('http') ? image : site + image;
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{LOCALES.map((l) => (
  <link rel="alternate" hreflang={l} href={site + localizePath(path, l as Locale)} />
))}
<link rel="alternate" hreflang="x-default" href={site + localizePath(path, DEFAULT_LOCALE)} />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImage} />
<meta property="og:locale" content={locale} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
{jsonLd.map((obj) => <script type="application/ld+json" set:html={JSON.stringify(obj)} />)}
```

- [ ] **Step 3: `LanguageSwitcher.astro`**

```astro
---
import { LOCALES, LOCALE_LABELS, localizePath, type Locale } from '../i18n/config';
const { locale, path } = Astro.props as { locale: Locale; path: string };
---
<div class="relative group">
  <button class="flex items-center gap-1 text-sm" aria-haspopup="true">{LOCALE_LABELS[locale]}</button>
  <ul class="absolute right-0 mt-2 hidden group-hover:block bg-[--card] border border-[--color-line] rounded-lg p-1 min-w-36">
    {LOCALES.map((l) => (
      <li><a href={localizePath(path, l as Locale)} class="block px-3 py-1.5 rounded hover:bg-[--color-surface-2] text-sm" data-astro-reload>{LOCALE_LABELS[l as Locale]}</a></li>
    ))}
  </ul>
</div>
```

- [ ] **Step 4: `Header.astro` (scroll-hide, nav, switcher, theme toggle)**

```astro
---
import { useTranslations } from '../i18n';
import { localizePath, type Locale } from '../i18n/config';
import LanguageSwitcher from './LanguageSwitcher.astro';
import ThemeToggle from './ThemeToggle.astro';
const { locale, path } = Astro.props as { locale: Locale; path: string };
const t = await useTranslations(locale);
const link = (p: string) => localizePath(p, locale);
---
<header id="site-header" data-scrolled="false"
  class="fixed inset-x-0 top-0 z-50 transition-transform duration-300 will-change-transform
         data-[scrolled=true]:backdrop-blur-md data-[scrolled=true]:bg-[--bg]/70 border-b border-transparent data-[scrolled=true]:border-[--color-line]">
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
    <a href={link('/')} class="font-display text-xl font-bold tracking-tight">Buck<span class="text-[--color-accent]">Bike</span></a>
    <div class="hidden items-center gap-7 md:flex">
      <a href={link('/')} class="text-sm hover:text-[--color-accent]">{t('nav.home')}</a>
      <a href={link('/fleet')} class="text-sm hover:text-[--color-accent]">{t('nav.fleet')}</a>
      <a href={link('/price')} class="text-sm hover:text-[--color-accent]">{t('nav.price')}</a>
    </div>
    <div class="flex items-center gap-3">
      <LanguageSwitcher locale={locale} path={path} />
      <ThemeToggle locale={locale} />
      <a href={link('/price')} class="rounded-full bg-[--color-accent] px-4 py-2 text-sm font-semibold text-black">{t('nav.book')}</a>
    </div>
  </nav>
</header>
<script>
  import { initScrollHideHeader } from '../lib/motion/scrollHideHeader';
  const h = document.getElementById('site-header');
  if (h) initScrollHideHeader(h);
</script>
```

- [ ] **Step 5: `ScrollProgress.astro` + `SectionReveal.astro`**

```astro
---
// ScrollProgress.astro
---
<div id="scroll-progress" class="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-[--color-accent]"></div>
<script>
  import { initScrollProgress } from '../lib/motion/scrollProgress';
  const bar = document.getElementById('scroll-progress');
  if (bar) initScrollProgress(bar);
</script>
```

```astro
---
// SectionReveal.astro — wraps children, marks them for the reveal observer
const { class: cls = '' } = Astro.props;
---
<div data-reveal class={cls}><slot /></div>
```

- [ ] **Step 6: `Footer.astro`** — NAP, socials, map link, copyright, "content adapted from buckbike.com" note. (Build using `BUSINESS` + `t('footer.*')`.)

- [ ] **Step 7: `Base.astro`** — the shell

```astro
---
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '../styles/global.css';
import { ClientRouter } from 'astro:transitions';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import ScrollProgress from '../components/ScrollProgress.astro';
import Seo from '../components/Seo.astro';
import type { Locale } from '../i18n/config';

interface Props { title: string; description: string; locale: Locale; path: string; jsonLd?: object[]; }
const { title, description, locale, path, jsonLd } = Astro.props;
---
<!doctype html>
<html lang={locale} class="scroll-smooth">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" />
    <script is:inline>
      if (localStorage.getItem('theme') === 'light') document.documentElement.classList.add('light');
    </script>
    <Seo title={title} description={description} locale={locale} path={path} jsonLd={jsonLd} />
  </head>
  <body class="min-h-dvh antialiased">
    <a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>
    <ScrollProgress />
    <Header locale={locale} path={path} />
    <main id="main"><slot /></main>
    <Footer locale={locale} path={path} />
    <script>
      import { initReveal } from '../lib/motion/reveal';
      import { initParallax } from '../lib/motion/parallax';
      import { initCountUp } from '../lib/motion/countUp';
      const boot = () => { initReveal(); initParallax(); initCountUp(); };
      boot();
      document.addEventListener('astro:after-swap', boot);
    </script>
  </body>
</html>
```

- [ ] **Step 8: Verify** — `pnpm astro check` 0 errors; `pnpm build` succeeds.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat(layout): Base shell, Header (scroll-hide), Footer, switcher, SEO head"
```

---

## Task 7: Home page (EN) + section components

**Files:**
- Create: `src/pages/index.astro`, `src/components/BikeCard.astro`

- [ ] **Step 1: `BikeCard.astro` (with shared-element transition name)**

```astro
---
import { Image } from 'astro:assets';
import { localizePath, type Locale } from '../i18n/config';
import type { Bike } from '../data/fleet';
const { bike, locale, label } = Astro.props as { bike: Bike; locale: Locale; label: string };
---
<a href={localizePath(`/fleet/${bike.id}`, locale)} class="group block rounded-2xl border border-[--color-line] bg-[--card] p-4 transition hover:-translate-y-1" data-reveal-item>
  <div class="overflow-hidden rounded-xl">
    <Image src={bike.image} alt={bike.name} width={560} height={420}
      class="aspect-[4/3] w-full object-cover transition group-hover:scale-105"
      style={`view-transition-name: bike-${bike.id}`} />
  </div>
  <h3 class="mt-4 font-display text-lg font-bold">{bike.name}</h3>
  <p class="mt-1 text-sm text-[--color-muted]">{bike.rangeKm} km · {bike.topSpeedKmh} km/h</p>
  <span class="mt-3 inline-block text-sm text-[--color-accent]">{label} →</span>
</a>
```

- [ ] **Step 2: `src/pages/index.astro`** — compose hero (with `data-parallax` banner + `heroScroll`), features grid, how-to-book steps, advantages, fleet preview (3 `BikeCard`s in a `SectionReveal`), business/reviews block with `data-count` for "62 reviews" and "4.9". Pull all strings via `useTranslations('en')`; set page `<Base>` props (title/description/path `'/'`, `jsonLd={[buildLocalBusinessJsonLd()]}`). Add `<script>` to init `initHeroScroll` on the hero element.

  Hero skeleton:
  ```astro
  ---
  import Base from '../layouts/Base.astro';
  import SectionReveal from '../components/SectionReveal.astro';
  import BikeCard from '../components/BikeCard.astro';
  import { Image } from 'astro:assets';
  import banner from '../assets/banner.png';
  import { BIKES } from '../data/fleet';
  import { useTranslations } from '../i18n';
  import { buildLocalBusinessJsonLd } from '../lib/seo';
  const locale = 'en' as const;
  const t = await useTranslations(locale);
  ---
  <Base title={`${t('site.name')} — ${t('hero.title_line1')} ${t('hero.title_line2')}`}
        description={t('hero.subtitle')} locale={locale} path="/" jsonLd={[buildLocalBusinessJsonLd()]}>
    <section class="relative flex min-h-dvh items-center overflow-hidden">
      <Image src={banner} alt="" data-parallax="0.3" class="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />
      <div id="hero-inner" class="mx-auto max-w-6xl px-5">
        <p class="font-display text-sm uppercase tracking-widest text-[--color-accent]">{t('hero.kicker')}</p>
        <h1 class="mt-4 font-display text-6xl font-bold leading-[0.95] md:text-8xl">{t('hero.title_line1')}<br />{t('hero.title_line2')}</h1>
        <p class="mt-6 max-w-xl text-lg text-[--color-muted]">{t('hero.subtitle')}</p>
        <!-- CTAs -->
      </div>
    </section>
    <!-- features / booking / advantages / fleet preview / business sections -->
    <script>
      import { initHeroScroll } from '../lib/motion/heroScroll';
      const el = document.getElementById('hero-inner');
      if (el) initHeroScroll(el);
    </script>
  </Base>
  ```

- [ ] **Step 3: Verify** — `pnpm dev`; check hero parallax/scroll fade, header hides on scroll-down, sections reveal with stagger, count-up fires, page builds with `pnpm build`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(home): EN home page with full motion set + JSON-LD"
```

---

## Task 8: Fleet list + detail (shared-element page transition)

**Files:**
- Create: `src/pages/fleet/index.astro`, `src/pages/fleet/[bike].astro`

- [ ] **Step 1: `fleet/index.astro`** — grid of all `BikeCard`s inside `SectionReveal`; `<Base>` path `/fleet`.

- [ ] **Step 2: `fleet/[bike].astro` with `getStaticPaths`**

```astro
---
import Base from '../../layouts/Base.astro';
import { Image } from 'astro:assets';
import { BIKES, getBike } from '../../data/fleet';
import { PRICING, formatVnd } from '../../data/pricing';
import { useTranslations } from '../../i18n';
export function getStaticPaths() {
  return BIKES.map((b) => ({ params: { bike: b.id } }));
}
const { bike: id } = Astro.params;
const bike = getBike(id!)!;
const locale = 'en' as const;
const t = await useTranslations(locale);
---
<Base title={`${bike.name} — ${t('site.name')}`} description={`${bike.name}: ${bike.rangeKm} km range.`} locale={locale} path={`/fleet/${bike.id}`}>
  <section class="mx-auto grid max-w-6xl gap-10 px-5 pt-32 md:grid-cols-2">
    <Image src={bike.image} alt={bike.name} width={720} height={540}
      class="rounded-2xl" style={`view-transition-name: bike-${bike.id}`} />
    <div>
      <h1 class="font-display text-5xl font-bold">{bike.name}</h1>
      <dl class="mt-8 grid grid-cols-2 gap-4">
        <div><dt class="text-[--color-muted] text-sm">{t('fleet.range_label')}</dt><dd class="font-display text-2xl">{bike.rangeKm} km</dd></div>
        <div><dt class="text-[--color-muted] text-sm">Top speed</dt><dd class="font-display text-2xl">{bike.topSpeedKmh} km/h</dd></div>
      </dl>
      <p class="mt-8 font-display text-3xl text-[--color-accent]">{formatVnd(PRICING[bike.id].daily)}<span class="text-base text-[--color-muted]">{t('price.per_day')}</span></p>
    </div>
  </section>
</Base>
```

  The matching `view-transition-name: bike-<id>` on both the card image and the detail image gives Astro's `<ClientRouter />` a free shared-element morph.

- [ ] **Step 3: Verify** — click a bike card → image morphs into the detail hero; back button reverses smoothly; `pnpm build` succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(fleet): list + detail with shared-element page transition"
```

---

## Task 9: Price page (EN)

**Files:**
- Create: `src/pages/price.astro`, `src/components/PriceTable.astro`

- [ ] **Step 1: `PriceTable.astro` (period toggle, animated price swap)**

```astro
---
import { BIKES } from '../data/fleet';
import { PRICING, formatVnd } from '../data/pricing';
import { useTranslations } from '../i18n';
import type { Locale } from '../i18n/config';
const { locale } = Astro.props as { locale: Locale };
const t = await useTranslations(locale);
const periods = ['daily', 'weekly', 'monthly'] as const;
---
<div data-price-table>
  <div role="tablist" class="mb-8 inline-flex rounded-full border border-[--color-line] p-1">
    {periods.map((p, i) => (
      <button role="tab" data-period={p} aria-selected={i === 0}
        class="rounded-full px-5 py-2 text-sm aria-selected:bg-[--color-accent] aria-selected:text-black">
        {t(`price.period.${p}`)}{p === 'weekly' ? ` ⭐` : ''}
      </button>
    ))}
  </div>
  <div class="grid gap-6 md:grid-cols-3">
    {BIKES.map((b) => (
      <div data-reveal-item class="rounded-2xl border border-[--color-line] bg-[--card] p-6">
        <h3 class="font-display text-lg font-bold">{b.name}</h3>
        <p class="mt-4 font-display text-4xl text-[--color-accent]"
           data-price-cell={JSON.stringify(PRICING[b.id])}>{formatVnd(PRICING[b.id].daily)}</p>
        <p class="mt-1 text-sm text-[--color-muted]" data-price-suffix>{t('price.per_day')}</p>
      </div>
    ))}
  </div>
</div>
<script>
  import { animate } from 'motion';
  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
  const suffix: Record<string, string> = { daily: '/ day', weekly: '/ week', monthly: '/ month' };
  document.querySelectorAll<HTMLButtonElement>('[role=tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const period = tab.dataset.period!;
      document.querySelectorAll('[role=tab]').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      document.querySelectorAll<HTMLElement>('[data-price-cell]').forEach((cell) => {
        const prices = JSON.parse(cell.dataset.priceCell!);
        cell.textContent = fmt(prices[period]);
        animate(cell, { opacity: [0.3, 1], transform: ['translateY(6px)', 'translateY(0)'] }, { duration: 0.3 });
      });
      document.querySelectorAll<HTMLElement>('[data-price-suffix]').forEach((s) => { s.textContent = suffix[period]; });
    });
  });
</script>
```

- [ ] **Step 2: `price.astro`** — heading + disclaimer banner (`t('price.disclaimer')`), `<PriceTable>`, "all plans include" list, payment block, FAQ accordion. Set `<Base>` path `/price`, `jsonLd={buildProductsJsonLd()}`.

- [ ] **Step 3: Verify** — toggle daily/weekly/monthly animates prices; disclaimer visible; build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(price): pricing page with animated period toggle + Product JSON-LD"
```

---

## Task 10: Localized routes for vi/ru/ja/ko/zh

**Files:**
- Create: `src/pages/[lang]/index.astro`, `src/pages/[lang]/fleet/index.astro`, `src/pages/[lang]/fleet/[bike].astro`, `src/pages/[lang]/price.astro`

**Approach:** To avoid duplicating page markup 5×, refactor each EN page body into a reusable `.astro` component that accepts `locale` (e.g. `src/components/pages/HomePage.astro`, `FleetListPage.astro`, `FleetDetailPage.astro`, `PricePage.astro`). EN pages render `<HomePage locale="en" />`; localized pages render it with the dynamic locale.

- [ ] **Step 1: Refactor EN page bodies into `src/components/pages/*.astro`** — move the markup from Task 7–9 pages into components taking `{ locale, path }` (and `bike` for detail). EN `src/pages/*.astro` now just wrap them. Verify `pnpm build` still green (no visual change).

- [ ] **Step 2: `src/pages/[lang]/index.astro`**

```astro
---
import HomePage from '../../components/pages/HomePage.astro';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '../../i18n/config';
export function getStaticPaths() {
  return LOCALES.filter((l) => l !== DEFAULT_LOCALE).map((lang) => ({ params: { lang } }));
}
const locale = Astro.params.lang as Locale;
---
<HomePage locale={locale} path="/" />
```

- [ ] **Step 3: `[lang]/price.astro`** — same pattern wrapping `<PricePage>`.

- [ ] **Step 4: `[lang]/fleet/index.astro`** — same pattern wrapping `<FleetListPage>`.

- [ ] **Step 5: `[lang]/fleet/[bike].astro`** — nested params

```astro
---
import FleetDetailPage from '../../../components/pages/FleetDetailPage.astro';
import { BIKES, getBike } from '../../../data/fleet';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '../../../i18n/config';
export function getStaticPaths() {
  const langs = LOCALES.filter((l) => l !== DEFAULT_LOCALE);
  return langs.flatMap((lang) => BIKES.map((b) => ({ params: { lang, bike: b.id } })));
}
const locale = Astro.params.lang as Locale;
const bike = getBike(Astro.params.bike!)!;
---
<FleetDetailPage locale={locale} bike={bike} path={`/fleet/${bike.id}`} />
```

- [ ] **Step 6: Verify** — `pnpm build`; confirm `dist/vi/`, `dist/ru/`, etc. generated for all 4 page types × 5 locales; spot-check `/vi/`, `/ja/price`, `/ko/fleet/theon` in `pnpm preview`; language switcher navigates and preserves the current page.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat(i18n): localized routes for vi/ru/ja/ko/zh across all pages"
```

---

## Task 11: SEO completion — llms.txt, robots, OG image, sitemap

**Files:**
- Create: `public/llms.txt`, `public/robots.txt`, `public/og/default.png`, `public/favicon.svg`

- [ ] **Step 1: `public/llms.txt`**

```
# BuckBike — Electric Scooter Rental, Đà Nẵng, Vietnam

> Affordable VinFast electric scooter rental in Đà Nẵng. No driving licence required. Daily, weekly and monthly plans. Cash or bank transfer. Free helmet and 24h support.

## Pages
- [Home](https://buckbike.com/): Overview, how to book, fleet, and location.
- [Fleet](https://buckbike.com/fleet): VinFast Evo 200 Lite, Feliz S, Theon — specs and details.
- [Pricing](https://buckbike.com/price): Daily/weekly/monthly rates per model and FAQ.

## Key facts
- Location: 31-B2 An Thuong 37, Bắc Mỹ An, Ngũ Hành Sơn, Đà Nẵng 550000, Vietnam
- Phone: +84 978 789 133
- Hours: 10:00–23:00 daily
- Payment: cash or bank transfer only
- Languages: English, Tiếng Việt, Русский, 日本語, 한국어, 中文
```

- [ ] **Step 2: `public/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://buckbike.com/sitemap-index.xml
```

- [ ] **Step 3: OG image + favicon** — add a 1200×630 `public/og/default.png` (branded: dark bg, lime "BuckBike", scooter silhouette) and a simple `favicon.svg`. If no design tool, generate a clean text-on-graphite PNG.

- [ ] **Step 4: Verify** — `pnpm build`; confirm `dist/sitemap-index.xml` exists and includes localized URLs; `llms.txt`, `robots.txt`, `og/default.png` copied to `dist`. Validate one page's JSON-LD via Google Rich Results structure (manually paste into validator).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(seo): llms.txt, robots, OG image, favicon, sitemap"
```

---

## Task 12: README, attribution, final QA

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write `README.md`** — setup (`pnpm install`, `pnpm dev`, `pnpm build`), stack overview, **data-source attribution** ("Copy and images adapted from buckbike.com for a technical demo; not affiliated"), **illustrative-pricing note**, **translation-review note** (RU/JA/KO/ZH machine-assisted), and an accessibility note (reduced-motion respected).

- [ ] **Step 2: Full QA pass**

Run: `pnpm astro check && pnpm test && pnpm build && pnpm preview`
Manually verify checklist:
  - [ ] Scroll-hide header works on every page
  - [ ] Scroll progress bar fills
  - [ ] Sections stagger-reveal; count-up runs
  - [ ] Hero parallax + scroll-fade
  - [ ] Page transition + bike shared-element morph
  - [ ] All 6 languages render; switcher keeps current page
  - [ ] Dark/light toggle persists across navigation (no flash)
  - [ ] `prefers-reduced-motion: reduce` disables animations (toggle in devtools)
  - [ ] View page source: `<title>`, OG, Twitter, hreflang, JSON-LD present
  - [ ] Lighthouse (mobile): Performance ≥ 90, SEO = 100, Accessibility ≥ 95

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "docs: README with attribution + final QA pass"
```

---

## Self-Review Notes (author checklist)

- **Spec coverage:** scrape (T1), Astro+TS (T0), Tailwind (T4), Motion One scroll set + page transition + scroll-hide header (T5–T9), i18next 6 langs (T2, T10), Price page (T9), creative content/pricing (T3/T9), aesthetic theme (T4), SEO/social/AI-discoverability (T6, T11). ✅
- **Type consistency:** `Bike['id']` union reused in `PRICING`; `Locale` type threaded through every component; `localizePath`/`getLocaleFromPath` names stable across tasks. ✅
- **Open risks to confirm during build:** (a) live image URLs may 404 → stock fallback path documented in T1; (b) Motion One `scroll`/`inView` API names verified against installed `motion` version before T5 — adjust imports if the package version differs; (c) Astro view-transition + Motion-driven in-page animations must re-init on `astro:after-swap` (handled in Base.astro T6).
```

