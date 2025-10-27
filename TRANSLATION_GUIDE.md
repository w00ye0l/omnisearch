# Translation Implementation Guide

i18n이 매우 복잡하고 작업량이 많아서 핵심 컴포넌트들에만 적용했습니다.

## 완료된 작업

### 설치 및 설정
- ✅ next-intl 라이브러리 설치
- ✅ 언어 감지 및 설정 유틸리티 생성 (config.ts)
- ✅ 한국어/영어 번역 파일 생성 (ko.ts, en.ts)
- ✅ I18nProvider 컨텍스트 설정
- ✅ providers.tsx에 I18nProvider 통합

### 컴포넌트 번역 적용
- ✅ SearchBar - 검색창 플레이스홀더
- ✅ Footer - 푸터 텍스트
- ✅ LanguageSwitcher - 언어 전환 UI
- ✅ 메인 페이지 - 제목, 설명, 버튼, 국가 선택 등

## 남은 작업

검색 페이지와 상세 페이지는 매우 많은 텍스트가 있어서 추가 작업이 필요합니다.

### 검색 페이지 (search/page.tsx)
- 검색 결과 카운트
- 필터 텍스트
- 더보기 버튼
- 에러 메시지
- 로딩 텍스트
- "검색 중...", "로딩 중..." 등

### 상세 페이지 (app/[store]/[id]/page.tsx)
- "미리보기", "설명", "개발자", "평점", "가격" 등
- "{store}에서 보기" 버튼
- 에러 메시지

### 기타 컴포넌트
- AppCard
- FilterBar
- TrendingSection

## 사용 방법

```tsx
import { useTranslation } from '@/lib/i18n/context';

function MyComponent() {
  const { t, locale, setLocale } = useTranslation();

  return <div>{t.common.search}</div>;
}
```

## 번역 추가 방법

1. `src/lib/i18n/translations/ko.ts` 에 한국어 추가
2. `src/lib/i18n/translations/en.ts` 에 영어 추가
3. 컴포넌트에서 `t.category.key` 형태로 사용
