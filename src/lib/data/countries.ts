import { Country, CountryCode } from '../types/app.types';

/**
 * Comprehensive list of countries supported by App Store and Play Store
 * Organized by region for better UX
 */
export const COUNTRIES: Country[] = [
  // Asia Pacific
  { code: 'kr', name: '한국', flag: '🇰🇷', region: 'Asia Pacific' },
  { code: 'jp', name: '일본', flag: '🇯🇵', region: 'Asia Pacific' },
  { code: 'cn', name: '중국', flag: '🇨🇳', region: 'Asia Pacific' },
  { code: 'in', name: '인도', flag: '🇮🇳', region: 'Asia Pacific' },
  { code: 'tw', name: '대만', flag: '🇹🇼', region: 'Asia Pacific' },
  { code: 'hk', name: '홍콩', flag: '🇭🇰', region: 'Asia Pacific' },
  { code: 'sg', name: '싱가포르', flag: '🇸🇬', region: 'Asia Pacific' },
  { code: 'th', name: '태국', flag: '🇹🇭', region: 'Asia Pacific' },
  { code: 'vn', name: '베트남', flag: '🇻🇳', region: 'Asia Pacific' },
  { code: 'id', name: '인도네시아', flag: '🇮🇩', region: 'Asia Pacific' },
  { code: 'ph', name: '필리핀', flag: '🇵🇭', region: 'Asia Pacific' },
  { code: 'my', name: '말레이시아', flag: '🇲🇾', region: 'Asia Pacific' },
  { code: 'au', name: '호주', flag: '🇦🇺', region: 'Asia Pacific' },
  { code: 'nz', name: '뉴질랜드', flag: '🇳🇿', region: 'Asia Pacific' },

  // Americas
  { code: 'us', name: '미국', flag: '🇺🇸', region: 'Americas' },
  { code: 'ca', name: '캐나다', flag: '🇨🇦', region: 'Americas' },
  { code: 'br', name: '브라질', flag: '🇧🇷', region: 'Americas' },
  { code: 'mx', name: '멕시코', flag: '🇲🇽', region: 'Americas' },
  { code: 'ar', name: '아르헨티나', flag: '🇦🇷', region: 'Americas' },
  { code: 'cl', name: '칠레', flag: '🇨🇱', region: 'Americas' },
  { code: 'co', name: '콜롬비아', flag: '🇨🇴', region: 'Americas' },

  // Europe
  { code: 'gb', name: '영국', flag: '🇬🇧', region: 'Europe' },
  { code: 'fr', name: '프랑스', flag: '🇫🇷', region: 'Europe' },
  { code: 'de', name: '독일', flag: '🇩🇪', region: 'Europe' },
  { code: 'es', name: '스페인', flag: '🇪🇸', region: 'Europe' },
  { code: 'it', name: '이탈리아', flag: '🇮🇹', region: 'Europe' },
  { code: 'ru', name: '러시아', flag: '🇷🇺', region: 'Europe' },
  { code: 'nl', name: '네덜란드', flag: '🇳🇱', region: 'Europe' },
  { code: 'se', name: '스웨덴', flag: '🇸🇪', region: 'Europe' },
  { code: 'no', name: '노르웨이', flag: '🇳🇴', region: 'Europe' },
  { code: 'dk', name: '덴마크', flag: '🇩🇰', region: 'Europe' },
  { code: 'fi', name: '핀란드', flag: '🇫🇮', region: 'Europe' },
  { code: 'pl', name: '폴란드', flag: '🇵🇱', region: 'Europe' },
  { code: 'at', name: '오스트리아', flag: '🇦🇹', region: 'Europe' },
  { code: 'ch', name: '스위스', flag: '🇨🇭', region: 'Europe' },
  { code: 'be', name: '벨기에', flag: '🇧🇪', region: 'Europe' },
  { code: 'tr', name: '터키', flag: '🇹🇷', region: 'Europe' },

  // Middle East & Africa
  { code: 'sa', name: '사우디아라비아', flag: '🇸🇦', region: 'Middle East & Africa' },
  { code: 'ae', name: 'UAE', flag: '🇦🇪', region: 'Middle East & Africa' },
  { code: 'za', name: '남아프리카공화국', flag: '🇿🇦', region: 'Middle East & Africa' },
  { code: 'eg', name: '이집트', flag: '🇪🇬', region: 'Middle East & Africa' },
];

/**
 * Get country by code
 */
export function getCountryByCode(code: CountryCode): Country | undefined {
  return COUNTRIES.find(c => c.code === code);
}

/**
 * Get countries by region
 */
export function getCountriesByRegion(region: string): Country[] {
  return COUNTRIES.filter(c => c.region === region);
}

/**
 * Get all regions
 */
export function getRegions(): string[] {
  return Array.from(new Set(COUNTRIES.map(c => c.region)));
}
