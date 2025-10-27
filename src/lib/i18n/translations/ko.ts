export const ko = {
  // Common
  common: {
    search: '검색',
    searchPlaceholder: '앱 이름을 입력하세요',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    backToTop: '맨 위로',
    back: '뒤로 가기',
    country: '국가',
  },

  // Main Page
  main: {
    title: 'Omnisearch',
    subtitle: 'App Store와 Play Store를 한 번에 검색하세요',
    exampleSearchTitle: '예시 검색:',
    exampleSearches: ['카카오톡', '인스타그램', '넷플릭스', '유튜브'],
    trendingApps: '인기 앱',
    free: '무료',
    paid: '유료',
  },

  // Search Page
  search: {
    searchResults: '검색 결과',
    noResults: '검색 결과가 없습니다',
    noResultsDesc: '다른 검색어를 시도해보세요',
    appStoreResults: 'App Store {count}개',
    playStoreResults: 'Play Store {count}개',
    loadMore: '더 보기',
    loadingMore: '로딩 중...',
    maxResults: '{current}개 표시 중 · 최대 120개까지 로드 가능',
    resultsCount: '{count}개',
    searching: '검색 중...',
  },

  // App Detail Page
  detail: {
    appNotFound: '앱을 찾을 수 없습니다',
    preview: '미리보기',
    description: '설명',
    developer: '개발자',
    rating: '평점',
    price: '가격',
    platform: '플랫폼',
    viewInStore: '{store}에서 보기',
    ratings: '{count}개 평가',
    ratingOutOf: '{rating} / 5.0',
  },

  // Store Names
  stores: {
    appStore: 'App Store',
    playStore: 'Play Store',
    all: '전체',
  },

  // Footer
  footer: {
    copyright: '© 2025 Omnisearch',
    madeWith: 'Made with Next.js',
  },

  // Countries
  countries: {
    kr: '대한민국',
    jp: '일본',
    cn: '중국',
    in: '인도',
    tw: '대만',
    hk: '홍콩',
    sg: '싱가포르',
    th: '태국',
    vn: '베트남',
    id: '인도네시아',
    ph: '필리핀',
    my: '말레이시아',
    au: '호주',
    nz: '뉴질랜드',
    us: '미국',
    ca: '캐나다',
    br: '브라질',
    mx: '멕시코',
    ar: '아르헨티나',
    cl: '칠레',
    co: '콜롬비아',
    gb: '영국',
    fr: '프랑스',
    de: '독일',
    es: '스페인',
    it: '이탈리아',
    ru: '러시아',
    nl: '네덜란드',
    se: '스웨덴',
    no: '노르웨이',
    dk: '덴마크',
    fi: '핀란드',
    pl: '폴란드',
    at: '오스트리아',
    ch: '스위스',
    be: '벨기에',
    tr: '터키',
    sa: '사우디아라비아',
    ae: 'UAE',
    za: '남아프리카공화국',
    eg: '이집트',
  },
} as const;
