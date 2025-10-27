'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, defaultLocale, getLocaleFromHeaders } from './config';
import { ko } from './translations/ko';
import { en } from './translations/en';

type Translations = typeof ko;

const translations: Record<Locale, Translations> = {
  ko,
  en,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlLocale = urlParams.get('lang') as Locale;

    // 1. URL에 언어 파라미터가 있으면 사용
    if (urlLocale && (urlLocale === 'ko' || urlLocale === 'en')) {
      setLocaleState(urlLocale);
      setIsInitialized(true);
      return;
    }

    // 2. URL에 없으면 브라우저 언어 감지하고 URL에 추가
    const browserLocale = getLocaleFromHeaders();
    setLocaleState(browserLocale);

    // URL에 언어 파라미터 추가
    const params = new URLSearchParams(window.location.search);
    params.set('lang', browserLocale);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    setIsInitialized(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);

    // URL 업데이트
    const params = new URLSearchParams(window.location.search);
    params.set('lang', newLocale);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const value: I18nContextType = {
    locale,
    setLocale,
    t: translations[locale],
  };

  // 초기화 전에는 기본 언어로 렌더링
  if (!isInitialized) {
    return (
      <I18nContext.Provider value={{ locale: defaultLocale, setLocale: () => {}, t: translations[defaultLocale] }}>
        {children}
      </I18nContext.Provider>
    );
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

// 번역 문자열에 변수를 삽입하는 헬퍼 함수
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return String(values[key] ?? match);
  });
}
