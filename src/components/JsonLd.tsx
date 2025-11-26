import Script from 'next/script';

// 메인 페이지용 WebSite 스키마
export function WebSiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Omnisearch',
    alternateName: '옴니서치',
    url: 'https://www.omnisearch.store',
    description: 'App Store와 Play Store를 한 번에 검색하세요. 앱 비교, 가격 확인, 평점 및 리뷰를 한눈에 확인할 수 있습니다.',
    inLanguage: ['ko', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.omnisearch.store/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}

// Organization 스키마
export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Omnisearch',
    url: 'https://www.omnisearch.store',
    logo: 'https://www.omnisearch.store/og-image.png',
    sameAs: [],
  };

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}

// 앱 상세 페이지용 SoftwareApplication 스키마
interface AppJsonLdProps {
  name: string;
  description: string;
  icon: string;
  rating?: number;
  ratingCount?: number;
  price: string;
  developer: string;
  platform: 'iOS' | 'Android';
  url: string;
}

export function AppJsonLd({
  name,
  description,
  icon,
  rating,
  ratingCount,
  price,
  developer,
  platform,
  url,
}: AppJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description: description?.slice(0, 300),
    image: icon,
    author: {
      '@type': 'Organization',
      name: developer,
    },
    applicationCategory: 'MobileApplication',
    operatingSystem: platform,
    offers: {
      '@type': 'Offer',
      price: price === '무료' || price === 'Free' ? '0' : price.replace(/[^0-9.]/g, ''),
      priceCurrency: 'KRW',
    },
    url,
  };

  if (rating && rating > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      ratingCount: ratingCount || 1,
    };
  }

  return (
    <Script
      id="app-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}

// BreadcrumbList 스키마
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}

// FAQ 스키마 (선택적)
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQJsonLdProps {
  items: FAQItem[];
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}
