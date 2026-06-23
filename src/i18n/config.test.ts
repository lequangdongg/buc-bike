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
