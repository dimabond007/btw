export const locales = ['en', 'he', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'he';

export const rtlLocales: Locale[] = ['he'];
