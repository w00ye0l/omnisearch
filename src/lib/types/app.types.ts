/**
 * Core App Interface
 * Unified interface for both App Store and Play Store apps
 */
export interface App {
  // Basic Information
  id: string;
  title: string;
  developer: string;
  icon: string;

  // Rating Information
  rating: number; // 0-5
  ratingCount: number;

  // Price Information
  price: string; // "Free", "$0.99", "무료" etc.
  free: boolean;

  // Metadata
  store: 'appstore' | 'playstore';
  url: string;
  description: string;

  // Optional Information
  category?: string;
  screenshots?: string[];
  version?: string;
  releaseDate?: string;
  size?: string;
  reviews?: Review[];
}

/**
 * Review Interface
 */
export interface Review {
  id: string;
  userName: string;
  userImage?: string;
  rating: number; // 1-5
  title?: string;
  text: string;
  date: string;
  thumbsUp?: number;
  version?: string;
}

/**
 * Search Query Interface
 */
export interface SearchQuery {
  q: string;
  country?: string;
  limit?: number;
}

/**
 * Search Response Interface
 */
export interface SearchResponse {
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

/**
 * Store Filter Type
 */
export type StoreFilter = 'all' | 'appstore' | 'playstore';

/**
 * Sort Option Type
 */
export type SortOption = 'relevance' | 'rating' | 'reviews';

/**
 * Country Code Type
 * Supported countries for both App Store and Play Store
 */
export type CountryCode =
  | 'kr' // 🇰🇷 한국
  | 'us' // 🇺🇸 미국
  | 'jp' // 🇯🇵 일본
  | 'gb' // 🇬🇧 영국
  | 'cn' // 🇨🇳 중국
  | 'fr' // 🇫🇷 프랑스
  | 'de' // 🇩🇪 독일
  | 'ca' // 🇨🇦 캐나다
  | 'au' // 🇦🇺 호주
  | 'in' // 🇮🇳 인도
  | 'br' // 🇧🇷 브라질
  | 'mx' // 🇲🇽 멕시코
  | 'es' // 🇪🇸 스페인
  | 'it' // 🇮🇹 이탈리아
  | 'ru' // 🇷🇺 러시아
  | 'tw' // 🇹🇼 대만
  | 'hk' // 🇭🇰 홍콩
  | 'sg' // 🇸🇬 싱가포르
  | 'th' // 🇹🇭 태국
  | 'vn' // 🇻🇳 베트남
  | 'id' // 🇮🇩 인도네시아
  | 'ph' // 🇵🇭 필리핀
  | 'my' // 🇲🇾 말레이시아
  | 'sa' // 🇸🇦 사우디아라비아
  | 'ae' // 🇦🇪 UAE
  | 'tr' // 🇹🇷 터키
  | 'nl' // 🇳🇱 네덜란드
  | 'se' // 🇸🇪 스웨덴
  | 'no' // 🇳🇴 노르웨이
  | 'dk' // 🇩🇰 덴마크
  | 'fi' // 🇫🇮 핀란드
  | 'pl' // 🇵🇱 폴란드
  | 'at' // 🇦🇹 오스트리아
  | 'ch' // 🇨🇭 스위스
  | 'be' // 🇧🇪 벨기에
  | 'nz' // 🇳🇿 뉴질랜드
  | 'za' // 🇿🇦 남아프리카공화국
  | 'ar' // 🇦🇷 아르헨티나
  | 'cl' // 🇨🇱 칠레
  | 'co' // 🇨🇴 콜롬비아
  | 'eg' // 🇪🇬 이집트;

/**
 * Country Information
 */
export interface Country {
  code: CountryCode;
  name: string;
  flag: string;
  region: string;
}

/**
 * API Error Response
 */
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
