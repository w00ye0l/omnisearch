# Omnisearch 프로젝트 명세서

## 📋 프로젝트 개요

### 서비스 이름

**Omnisearch** (옴니서치)

### 목적

Google Play Store와 Apple App Store의 앱 검색 결과를 한 번에 통합하여 보여주는 웹 서비스

### 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Libraries**:
  - `google-play-scraper`
  - `app-store-scraper`
- **Deployment**: Vercel

---

## 🎯 핵심 기능

### 1. 통합 검색

- 하나의 검색어로 두 스토어 동시 검색
- 실시간 검색 결과 표시
- 병렬 처리로 빠른 응답

### 2. 필터링

- 스토어별 필터 (전체/App Store/Play Store)
- 국가별 필터 (한국, 미국, 일본 등)
- 무료/유료 필터

### 3. 정렬

- 관련도순 (기본)
- 평점순
- 리뷰 수순

### 4. 상세 정보

- 앱 아이콘, 제목, 개발자
- 평점 및 리뷰 수
- 가격 정보
- 스토어 링크

---

## 📁 프로젝트 구조

```
omnisearch/
├── app/
│   ├── page.tsx                    # 메인 검색 페이지
│   ├── layout.tsx                  # 루트 레이아웃
│   ├── api/
│   │   ├── search/
│   │   │   └── route.ts           # 통합 검색 API
│   │   ├── appstore/
│   │   │   └── route.ts           # App Store 검색 API
│   │   └── playstore/
│   │       └── route.ts           # Play Store 검색 API
│   └── globals.css                # 글로벌 스타일
├── components/
│   ├── SearchBar.tsx              # 검색바 컴포넌트
│   ├── AppCard.tsx                # 앱 카드 컴포넌트
│   ├── FilterBar.tsx              # 필터바 컴포넌트
│   ├── StoreToggle.tsx            # 스토어 토글
│   └── LoadingSpinner.tsx         # 로딩 스피너
├── lib/
│   ├── services/
│   │   ├── appStore.service.ts    # App Store 서비스
│   │   └── playStore.service.ts   # Play Store 서비스
│   ├── types/
│   │   └── app.types.ts           # 타입 정의
│   └── utils/
│       ├── formatters.ts          # 데이터 포매터
│       └── validators.ts          # 검증 함수
├── public/
│   └── images/                    # 정적 이미지
├── .env.local                     # 환경 변수
├── next.config.js                 # Next.js 설정
├── tailwind.config.ts             # Tailwind 설정
├── tsconfig.json                  # TypeScript 설정
└── package.json                   # 의존성
```

---

## 🎨 UI/UX 명세

### 메인 페이지 레이아웃

```
┌─────────────────────────────────────────────────┐
│                    Omnisearch                     │
│          통합 앱스토어 검색 서비스               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  🔍  카카오톡 검색...            [검색]  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [ 전체 ] [ App Store ] [ Play Store ]         │
│  국가: [🇰🇷 한국 ▼]  가격: [전체 ▼]            │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  검색 결과: 40개 (App Store 20 | Play Store 20)│
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  [아이콘]  KakaoTalk                    │   │
│  │            Kakao Corp.                  │   │
│  │            ⭐ 4.5 (150,000)  Free       │   │
│  │            [App Store]                  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  [아이콘]  카카오톡                     │   │
│  │            Kakao Corp.                  │   │
│  │            ⭐ 4.3 (2,500,000)  무료     │   │
│  │            [Play Store]                 │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ... (더 많은 결과)                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 컬러 스키마

```typescript
// Tailwind 기반
primary: "#3B82F6"; // 파란색 (검색, 버튼)
secondary: "#10B981"; // 초록색 (성공, App Store)
accent: "#8B5CF6"; // 보라색 (Play Store)
background: "#F9FAFB"; // 밝은 회색
text: "#1F2937"; // 다크 그레이
border: "#E5E7EB"; // 연한 그레이
```

### 반응형 디자인

- **Desktop** (1024px+): 3단 그리드
- **Tablet** (768px-1023px): 2단 그리드
- **Mobile** (~767px): 1단 리스트

---

## 🔌 API 명세

### 1. 통합 검색 API

**Endpoint**: `GET /api/search`

**Query Parameters**:

```typescript
{
  q: string;           // 필수: 검색어
  country?: string;    // 선택: 국가 코드 (기본: 'kr')
  limit?: number;      // 선택: 결과 개수 (기본: 20, 최대: 50)
}
```

**Response**:

```typescript
{
  query: string;
  country: string;
  totalCount: number;
  appStore: {
    count: number;
    apps: App[];
  };
  playStore: {
    count: number;
    apps: App[];
  };
  timestamp: string;
}
```

**Example**:

```bash
GET /api/search?q=카카오톡&country=kr&limit=20

Response:
{
  "query": "카카오톡",
  "country": "kr",
  "totalCount": 40,
  "appStore": {
    "count": 20,
    "apps": [...]
  },
  "playStore": {
    "count": 20,
    "apps": [...]
  },
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

### 2. App Store 검색 API

**Endpoint**: `GET /api/appstore`

**Query Parameters**:

```typescript
{
  q: string;
  country?: string;
  limit?: number;
}
```

**Response**:

```typescript
{
  count: number;
  apps: App[];
}
```

### 3. Play Store 검색 API

**Endpoint**: `GET /api/playstore`

**Query Parameters**:

```typescript
{
  q: string;
  country?: string;
  limit?: number;
}
```

**Response**:

```typescript
{
  count: number;
  apps: App[];
}
```

---

## 📊 데이터 타입

### App Interface

```typescript
interface App {
  // 기본 정보
  id: string;
  title: string;
  developer: string;
  icon: string;

  // 평가 정보
  rating: number; // 0-5
  ratingCount: number;

  // 가격 정보
  price: string; // "Free", "$0.99", "무료" 등
  free: boolean;

  // 메타데이터
  store: "appstore" | "playstore";
  url: string;
  description: string;

  // 선택적 정보
  category?: string;
  screenshots?: string[];
  version?: string;
  releaseDate?: string;
  size?: string;
}
```

### Search Query Interface

```typescript
interface SearchQuery {
  q: string;
  country?: string;
  limit?: number;
}
```

### Search Response Interface

```typescript
interface SearchResponse {
  query: string;
  country: string;
  totalCount: number;
  appStore: {
    count: number;
    apps: App[];
  };
  playStore: {
    count: number;
    apps: App[];
  };
  timestamp: string;
}
```

---

## 🚀 기능 명세

### Phase 1: MVP (필수 기능)

- [x] 통합 검색 기능
- [x] 검색 결과 표시 (그리드/리스트)
- [x] 스토어별 필터링
- [x] 국가 선택
- [x] 반응형 디자인
- [x] 로딩 상태 표시
- [x] 에러 핸들링

### Phase 2: 개선 (추가 기능)

- [ ] 검색 히스토리
- [ ] 정렬 기능 (평점순, 리뷰수순)
- [ ] 무료/유료 필터
- [ ] 앱 상세 모달
- [ ] 공유 기능
- [ ] 다크 모드

### Phase 3: 고급 (선택 기능)

- [ ] 사용자 인증
- [ ] 즐겨찾기/북마크
- [ ] 앱 비교 기능
- [ ] 검색 알림 설정
- [ ] 트렌드 앱 표시
- [ ] 카테고리별 검색

---

## ⚙️ 환경 설정

### 환경 변수 (.env.local)

```bash
# 선택적 - API 키가 필요한 경우
NEXT_PUBLIC_API_URL=http://localhost:3000

# 분석 도구 (선택)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel 배포 시 자동 설정됨
VERCEL_URL=
```

### Next.js 설정 (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "play-lh.googleusercontent.com", // Play Store 이미지
      "is1-ssl.mzstatic.com", // App Store 이미지
      "is2-ssl.mzstatic.com",
      "is3-ssl.mzstatic.com",
      "is4-ssl.mzstatic.com",
      "is5-ssl.mzstatic.com",
    ],
  },
  // API Routes 타임아웃 설정 (Vercel Pro 필요)
  api: {
    responseLimit: false,
  },
};

module.exports = nextConfig;
```

---

## 🔒 보안 고려사항

### 1. Rate Limiting

- Vercel의 Edge Middleware 사용
- IP 기반 요청 제한 (분당 10회)

### 2. Input Validation

- 검색어 길이 제한 (최대 100자)
- 특수문자 필터링
- SQL Injection 방지

### 3. CORS

- 동일 출처 정책 적용
- 필요시 화이트리스트 설정

### 4. Error Handling

- 민감한 정보 노출 방지
- 사용자 친화적 에러 메시지
- 에러 로깅 (Vercel Analytics)

---

## 📈 성능 최적화

### 1. 캐싱 전략

```typescript
// Next.js의 fetch cache 활용
const res = await fetch(url, {
  next: { revalidate: 3600 }, // 1시간 캐시
});
```

### 2. 이미지 최적화

- Next.js Image 컴포넌트 사용
- Lazy loading 적용
- WebP 포맷 자동 변환

### 3. 코드 스플리팅

- 동적 import 사용
- 라우트 기반 자동 분리

### 4. API 최적화

- Promise.allSettled로 병렬 처리
- 타임아웃 설정 (10초)
- 실패 시 부분 결과 반환

---

## 🧪 테스트 계획

### 단위 테스트

- [ ] 서비스 함수 테스트
- [ ] 유틸리티 함수 테스트
- [ ] 컴포넌트 렌더링 테스트

### 통합 테스트

- [ ] API Routes 테스트
- [ ] 검색 플로우 테스트
- [ ] 필터링 로직 테스트

### E2E 테스트

- [ ] 검색 시나리오
- [ ] 필터/정렬 시나리오
- [ ] 모바일 반응형 테스트

---

## 📦 배포 계획

### Vercel 배포

**1단계: 프로젝트 연결**

```bash
vercel login
vercel link
```

**2단계: 환경 변수 설정**

- Vercel Dashboard에서 설정
- Production/Preview/Development 분리

**3단계: 배포**

```bash
# 프리뷰 배포
git push origin feature/xyz

# 프로덕션 배포
git push origin main
```

### 도메인 설정

- Vercel 제공 도메인: `omnisearch.vercel.app`
- 커스텀 도메인: `omnisearch.io` (선택)

### 모니터링

- Vercel Analytics (무료)
- Error tracking
- 성능 모니터링

---

## 📝 개발 순서

### Week 1: 기본 구조

1. Next.js 프로젝트 초기화
2. 타입 정의 및 서비스 레이어 구현
3. API Routes 구현

### Week 2: UI 개발

1. 레이아웃 및 기본 컴포넌트
2. 검색 페이지 구현
3. 반응형 디자인 적용

### Week 3: 고도화

1. 필터링/정렬 기능
2. 에러 핸들링 개선
3. 성능 최적화

### Week 4: 배포 및 테스트

1. Vercel 배포
2. 테스트 및 버그 픽스
3. 문서화

---

## 🐛 알려진 제약사항

### 1. 서버리스 제약

- Vercel 무료: 10초 타임아웃
- Cold start 지연 가능
- 동시 실행 제한

### 2. 스크래핑 제약

- Play Store/App Store 구조 변경 시 동작 불가
- Rate limiting 걸릴 수 있음
- 일부 국가/언어 제한

### 3. 해결 방안

- 에러 발생 시 부분 결과 반환
- 사용자에게 명확한 에러 메시지
- 대안 제공 (공식 스토어 링크)

---

## 📚 참고 자료

- Next.js 공식 문서: https://nextjs.org/docs
- google-play-scraper: https://www.npmjs.com/package/google-play-scraper
- app-store-scraper: https://www.npmjs.com/package/app-store-scraper
- Tailwind CSS: https://tailwindcss.com/docs
- Vercel 배포 가이드: https://vercel.com/docs

---

## ✅ 체크리스트

### 개발 시작 전

- [ ] 기술 스택 확정
- [ ] 디자인 시안 확인
- [ ] 도메인 네임 결정
- [ ] Git 저장소 생성

### 개발 중

- [ ] 타입 정의 완료
- [ ] API 구현 완료
- [ ] UI 컴포넌트 완료
- [ ] 반응형 테스트 완료

### 배포 전

- [ ] 환경 변수 설정
- [ ] 에러 핸들링 확인
- [ ] 성능 테스트
- [ ] 접근성 테스트
- [ ] 크로스 브라우저 테스트

### 배포 후

- [ ] 모니터링 설정
- [ ] 사용자 피드백 수집
- [ ] 성능 모니터링
- [ ] 버그 트래킹

---

## 📞 문의 및 지원

- GitHub Issues: 버그 리포트 및 기능 제안
- 이메일: support@omnisearch.io (예시)
- 문서: README.md 참조
