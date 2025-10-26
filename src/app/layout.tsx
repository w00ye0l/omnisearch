import { GoogleAnalytics } from '@next/third-parties/google'
import { GA_MEASUREMENT_ID } from './gtag';
import { Analytics } from '@vercel/analytics/react';
import AdSense from "@/third-parties/AdSense";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Omnisearch - 앱스토어 & 플레이스토어 통합 검색",
    template: "%s | Omnisearch",
  },
  description:
    "App Store와 Play Store를 한 번에 검색하세요. 앱 비교, 가격 확인, 평점 및 리뷰를 한눈에 확인할 수 있습니다.",
  keywords: [
    "앱 검색",
    "앱스토어",
    "플레이스토어",
    "App Store",
    "Play Store",
    "앱 비교",
    "앱 가격",
    "앱 리뷰",
    "모바일 앱",
    "iOS",
    "Android",
    "무료 앱",
    "유료 앱",
  ],
  authors: [{ name: "Omnisearch" }],
  creator: "Omnisearch",
  publisher: "Omnisearch",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://omnisearch-dun.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Omnisearch - 앱스토어 & 플레이스토어 통합 검색",
    description:
      "App Store와 Play Store를 한 번에 검색하세요. 앱 비교, 가격 확인, 평점 및 리뷰를 한눈에 확인할 수 있습니다.",
    url: "https://omnisearch-dun.vercel.app",
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
    title: "Omnisearch - 앱스토어 & 플레이스토어 통합 검색",
    description:
      "App Store와 Play Store를 한 번에 검색하세요. 앱 비교, 가격 확인, 평점 및 리뷰를 한눈에 확인할 수 있습니다.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console 인증 코드 (나중에 추가)
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html suppressHydrationWarning>
      {adsenseId && (
        <head>
          <meta name="google-adsense-account" content={adsenseId} />
        
  {/* Google Analytics */}
  <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
  </head>
      )}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AdSense />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
