"use client";

import Link from "next/link";
import { App } from "@/lib/types/app.types";
import { Badge } from "@/components/ui/badge";
import AppIcon from "@/components/AppIcon";
import { sanitizeAppDescription } from "@/lib/utils/textUtils";
import { useTranslation } from "@/lib/i18n/context";
import { event } from "@/app/gtag";
import type { Locale } from "@/lib/i18n/config";

interface AppCardProps {
  app: App;
  searchQuery?: string;
  rank?: number;
  locale?: Locale;
}

export default function AppCard({
  app,
  searchQuery,
  rank,
  locale = "ko",
}: AppCardProps) {
  const { t } = useTranslation();
  const storeLabel = app.store === "appstore" ? "App Store" : "Play Store";
  const storeVariant = app.store === "appstore" ? "appstore" : "playstore";

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // 가격 번역 함수
  const translatePrice = (price: string): string => {
    if (price === "무료") {
      return t.main.free;
    }
    return price;
  };

  // Store app data in sessionStorage for detail page
  const handleClick = () => {
    sessionStorage.setItem(`app-${app.store}-${app.id}`, JSON.stringify(app));

    // GA 이벤트: 검색 결과 클릭
    if (searchQuery) {
      event({
        action: "검색결과_클릭",
        category: "검색",
        label: `${app.title} (${app.store}) - 검색어: ${searchQuery}${
          rank ? ` - 순위: ${rank}` : ""
        }`,
        value: rank || 1,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all p-4 md:p-5 group">
      <Link
        href={`/app/${app.store}/${app.id}?lang=${locale}`}
        className="block"
        onClick={handleClick}
      >
        <div className="flex gap-3 md:gap-4">
          {/* App Icon */}
          <div className="flex-shrink-0">
            <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
              <AppIcon
                src={app.icon}
                alt={`${app.title} icon`}
                title={app.title}
                size={64}
              />
            </div>
          </div>

          {/* App Info */}
          <div className="flex-1 min-w-0">
            {/* Title and Store Badge */}
            <div className="flex items-start gap-2 mb-1">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors flex-1">
                {app.title}
              </h3>
              <Badge
                variant={storeVariant as "appstore" | "playstore"}
                className="flex-shrink-0 text-[10px] md:text-xs"
              >
                {storeLabel}
              </Badge>
            </div>

            {/* Developer */}
            <p className="text-xs md:text-sm text-gray-600 truncate mb-1.5 md:mb-2">
              {app.developer}
            </p>

            {/* Rating, Reviews, and Price */}
            <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
              {app.rating > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium text-gray-700">
                    {app.rating.toFixed(1)}
                  </span>
                  {app.ratingCount > 0 && (
                    <span className="text-gray-500">
                      ({formatNumber(app.ratingCount)})
                    </span>
                  )}
                </div>
              )}
              <span className="text-gray-400">·</span>
              <span className="font-medium text-gray-900">
                {translatePrice(app.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {app.description && (
          <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {sanitizeAppDescription(app.description)}
          </p>
        )}
      </Link>

      {/* External Link Button */}
      <div className="mt-2 md:mt-4 md:pt-2 border-t border-gray-100">
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <span>{t.detail.viewInStore.replace("{store}", storeLabel)}</span>
          <svg
            className="w-3 h-3 md:w-4 md:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
