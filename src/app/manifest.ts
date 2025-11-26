import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Omnisearch - 앱스토어 & 플레이스토어 통합 검색',
    short_name: 'Omnisearch',
    description:
      'App Store와 Play Store를 한 번에 검색하세요. 앱 비교, 가격 확인, 평점 및 리뷰를 한눈에 확인할 수 있습니다.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
