import type { APIRoute } from 'astro';
import { BUSINESS } from '../data/business';
import { BIKES } from '../data/fleet';
import { DAILY_RATE, OVER_3_DAYS_RATE, WEEKLY_RATE, formatVnd } from '../data/pricing';
import { LOCALES } from '../i18n/config';

// /llms.txt — a concise, machine-readable brief for LLMs and AI answer engines
// (ChatGPT, Perplexity, Google AI Overviews, Claude). Generated at build time
// from the same data as the site, so the facts never drift out of sync.
// Spec: https://llmstxt.org

const LANGUAGE_NAMES: Record<(typeof LOCALES)[number], string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  hi: 'हिन्दी',
};

export const GET: APIRoute = () => {
  const { address: a, rating } = BUSINESS;
  const languages = LOCALES.map((l) => LANGUAGE_NAMES[l]).join(', ');

  const fleet = BIKES.map(
    (b) => `- ${b.name} — up to ${b.rangeKm} km range, ${b.topSpeedKmh} km/h top speed, ${b.trunkL} L under-seat storage.`,
  ).join('\n');

  const body = `# ${BUSINESS.name} — Electric Scooter Rental, ${a.city}, Vietnam

> Affordable VinFast electric scooter rental in ${a.city} for tourists and locals.
> No driving licence required. Daily, multi-day, weekly and monthly plans.
> Cash or bank transfer only. Free helmet and 24h support with every rental.

## Pages
- [Home](${BUSINESS.url}/): Overview, how to book, fleet, pricing and location.
- [Fleet](${BUSINESS.url}/fleet): The full VinFast line-up with specs and detail pages.
- [Pricing](${BUSINESS.url}/price): Daily / weekly / monthly rates, what's included, and FAQ.

## Fleet
${fleet}

## Pricing (VND, per day)
- 1–2 days: ${formatVnd(DAILY_RATE)}/day
- From 3 days: ${formatVnd(OVER_3_DAYS_RATE)}/day (−20%)
- Weekly or longer: ${formatVnd(WEEKLY_RATE)}/day (best value)
- Monthly: contact us for a custom rate
Every rental includes a free helmet, phone mount, 24h roadside support and free delivery in ${a.city}.

## Key facts
- Location: ${a.street}, ${a.district}, ${a.city} ${a.postalCode}, Vietnam
- Phone / WhatsApp: ${BUSINESS.phoneDisplay}
- Hours: ${BUSINESS.hours.opens}–${BUSINESS.hours.closes} daily
- Payment: cash or direct bank transfer (no cards)
- Languages: ${languages}
- Rating: ${rating.value.toFixed(1)} / 5 (${rating.count} Google reviews)

## Parking (Vietnam law)
- Park only in permitted areas. Renters are liable for any parking violation —
  police fines, wheel clamps or towing — under Vietnam's sidewalk (vỉa hè) rules.

## Notes
- Prices are realistic placeholders for a technical demo and may differ from the live store.
- This site is a rebuilt technical demo; content adapted from buckbike.com.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
