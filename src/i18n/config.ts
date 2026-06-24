export const LOCALES = ['en', 'vi', 'ru', 'ja', 'ko', 'zh', 'hi'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  hi: 'हिन्दी',
};

/** ISO country code for each locale's flag SVG (public/flags/<code>.svg). */
export const LOCALE_FLAGS: Record<Locale, string> = {
  en: 'gb',
  vi: 'vn',
  ru: 'ru',
  ja: 'jp',
  ko: 'kr',
  zh: 'cn',
  hi: 'in',
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
