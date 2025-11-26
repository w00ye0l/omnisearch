import { Suspense } from "react";
import { Metadata } from "next";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchPageClient from "./SearchPageClient";

// 동적 메타데이터 생성
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string; lang?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params?.q;
  const lang = params?.lang || "ko";

  const baseUrl = "https://www.omnisearch.store";

  if (query) {
    const title =
      lang === "ko"
        ? `"${query}" 검색 결과 - Omnisearch`
        : `Search results for "${query}" - Omnisearch`;
    const description =
      lang === "ko"
        ? `"${query}" 앱을 App Store와 Play Store에서 검색한 결과입니다. 가격, 평점, 리뷰를 비교해보세요.`
        : `Search results for "${query}" on App Store and Play Store. Compare prices, ratings, and reviews.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${baseUrl}/search?q=${encodeURIComponent(query)}`,
        siteName: "Omnisearch",
        locale: lang === "ko" ? "ko_KR" : "en_US",
        type: "website",
        images: [
          {
            url: "/og-image.png",
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/og-image.png"],
      },
      alternates: {
        canonical: `${baseUrl}/search?q=${encodeURIComponent(query)}`,
      },
    };
  }

  // 기본 메타데이터 (검색어 없을 때)
  const defaultTitle =
    lang === "ko"
      ? "앱 검색 - Omnisearch"
      : "App Search - Omnisearch";
  const defaultDescription =
    lang === "ko"
      ? "App Store와 Play Store를 한 번에 검색하세요. 앱 비교, 가격 확인, 평점 및 리뷰를 한눈에 확인할 수 있습니다."
      : "Search App Store and Play Store at once. Compare apps, check prices, ratings, and reviews at a glance.";

  return {
    title: defaultTitle,
    description: defaultDescription,
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: `${baseUrl}/search`,
      siteName: "Omnisearch",
      locale: lang === "ko" ? "ko_KR" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: defaultTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `${baseUrl}/search`,
    },
  };
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchPageClient />
    </Suspense>
  );
}
