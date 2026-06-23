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
  const existing = instances.get(locale);
  if (existing) return existing;
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
