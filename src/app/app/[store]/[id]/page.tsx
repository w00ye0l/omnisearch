import { Metadata } from "next";
import AppDetailClient from "./AppDetailClient";

// 동적 메타데이터 생성 (기본값 사용, 클라이언트에서 실제 데이터 로드)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}): Promise<Metadata> {
  const { store } = await params;
  const baseUrl = "https://omnisearch-dun.vercel.app";

  const storeLabel = store === "appstore" ? "App Store" : "Play Store";
  const platform = store === "appstore" ? "iOS" : "Android";

  const title = `${storeLabel} 앱 상세 정보 | Omnisearch`;
  const description = `${platform} 앱의 상세 정보, 가격, 평점, 리뷰를 확인하세요. App Store와 Play Store 통합 검색 서비스 Omnisearch`;

  return {
    title,
    description,
    keywords: [
      storeLabel,
      platform,
      "앱 리뷰",
      "앱 평점",
      "앱 가격",
      "모바일 앱",
      "앱 검색",
    ],
    openGraph: {
      title,
      description,
      siteName: "Omnisearch",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Omnisearch - 앱스토어 & 플레이스토어 통합 검색",
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
      canonical: baseUrl,
    },
  };
}

export default function AppDetailPage() {
  return <AppDetailClient />;
}
