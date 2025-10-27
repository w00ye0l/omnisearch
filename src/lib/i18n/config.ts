export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ko';

export function getLocaleFromHeaders(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  const browserLang = navigator.language.toLowerCase();

  // 한국어 감지
  if (browserLang.startsWith('ko')) {
    return 'ko';
  }

  // 영어 또는 기타 언어는 영어로
  return 'en';
}
