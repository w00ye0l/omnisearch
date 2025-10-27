'use client';

import { useTranslation } from '@/lib/i18n/context';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1">
      <button
        onClick={() => setLocale('ko')}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          locale === 'ko'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        한국어
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          locale === 'en'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        English
      </button>
    </div>
  );
}
