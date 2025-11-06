"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { App } from "@/lib/types/app.types";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import AppIcon from "@/components/AppIcon";
import AppScreenshot from "@/components/AppScreenshot";
import Footer from "@/components/Footer";
import ReviewsModal from "@/components/ReviewsModal";
import { sanitizeAppDescription } from "@/lib/utils/textUtils";
import { useTranslation } from "@/lib/i18n/context";
import { event } from "@/app/gtag";
import { ChevronLeft } from "lucide-react";

export default function AppDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const [app, setApp] = useState<App | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const store = params.store as string;
  const id = params.id as string;

  useEffect(() => {
    const fetchAppDetails = async () => {
      try {
        // First, try to get from sessionStorage
        const cachedData = sessionStorage.getItem(`app-${store}-${id}`);

        if (cachedData) {
          console.log("Using cached app data");
          const appData = JSON.parse(cachedData);

          // Check if cached data has reviews, if not fetch fresh data
          if (!appData.reviews || appData.reviews.length === 0) {
            console.log(
              "Cached data has no reviews, fetching fresh data from API"
            );
            // Clear cache and fetch fresh
            sessionStorage.removeItem(`app-${store}-${id}`);
          } else {
            setApp(appData);

            // GA 이벤트: 상세 페이지 접근
            event({
              action: "앱상세_조회",
              category: "상세페이지",
              label: `${appData.title} (${store})`,
              value: 1,
            });

            setIsLoading(false);
            return;
          }
        }

        // If not in cache or no reviews, fetch from API
        console.log("Fetching from API");
        const response = await fetch(`/api/app/${store}/${id}`);

        if (!response.ok) {
          throw new Error("앱 정보를 불러오는데 실패했습니다");
        }

        const data = await response.json();
        setApp(data);

        // GA 이벤트: 상세 페이지 접근
        event({
          action: "앱상세_조회",
          category: "상세페이지",
          label: `${data.title} (${store})`,
          value: 1,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    if (store && id) {
      fetchAppDetails();
    }
  }, [store, id]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {t.detail.appNotFound}
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            {t.common.back}
          </button>
        </div>
      </div>
    );
  }

  const storeLabel = app.store === "appstore" ? "App Store" : "Play Store";
  const storeVariant = app.store === "appstore" ? "appstore" : "playstore";

  // 가격 번역 함수
  const translatePrice = (price: string): string => {
    if (price === "무료") {
      return t.main.free;
    }
    return price;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base font-medium">
              {t.common.back}
            </span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* App Header */}
        <div className="flex gap-3 md:gap-4 mb-6 md:mb-8">
          {/* App Icon */}
          <div className="flex-shrink-0">
            <div className="relative w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-gray-100">
              <AppIcon
                src={app.icon}
                alt={`${app.title} icon`}
                title={app.title}
                size={80}
              />
            </div>
          </div>

          {/* App Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1 md:mb-2">
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 flex-1">
                {app.title}
              </h1>
              <Badge variant={storeVariant as "appstore" | "playstore"}>
                {storeLabel}
              </Badge>
            </div>

            <p className="text-xs md:text-base text-gray-600 mb-2 md:mb-3">
              {app.developer}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 md:gap-4 mb-3 md:mb-4">
              {app.rating > 0 && (
                <div>
                  <div className="flex items-center gap-1 mb-0.5 md:mb-1">
                    <span className="text-yellow-500 text-sm md:text-lg">
                      ★
                    </span>
                    <span className="text-base md:text-xl font-bold text-gray-900">
                      {app.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500">
                    {app.ratingCount > 0 &&
                      `${formatNumber(app.ratingCount)} 평가`}
                  </p>
                </div>
              )}

              <div>
                <div className="text-base md:text-xl font-bold text-gray-900 mb-0.5 md:mb-1">
                  {translatePrice(app.price)}
                </div>
                <p className="text-[10px] md:text-xs text-gray-500">
                  {t.detail.price}
                </p>
              </div>
            </div>

            {/* Store Link Button */}
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // GA 이벤트: 스토어 링크 클릭
                event({
                  action: "스토어_이동",
                  category: "상세페이지",
                  label: `${app.title} (${storeLabel})`,
                  value: 1,
                });
              }}
              className="inline-flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-blue-500 text-white text-xs md:text-sm font-semibold rounded-full hover:bg-blue-600 transition-colors"
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

        {/* Screenshots */}
        {app.screenshots && app.screenshots.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              {t.detail.preview}
            </h2>
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex gap-3 pb-4">
                {app.screenshots.map((screenshot, index) => (
                  <AppScreenshot
                    key={index}
                    src={screenshot}
                    alt={`${app.title} screenshot ${index + 1}`}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {app.description && (
          <div className="mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              {t.detail.description}
            </h2>
            <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
              <div className="relative">
                <p
                  className={`text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-wrap ${
                    !isDescriptionExpanded ? "line-clamp-6" : ""
                  }`}
                >
                  {sanitizeAppDescription(app.description)}
                </p>
                {!isDescriptionExpanded &&
                  sanitizeAppDescription(app.description).length > 300 && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
                  )}
              </div>
              {sanitizeAppDescription(app.description).length > 300 && (
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="mt-3 text-sm md:text-base text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  {isDescriptionExpanded
                    ? t.detail.collapse
                    : t.detail.showMore}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
            <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2">
              {t.detail.developer}
            </h3>
            <p className="text-sm md:text-base text-gray-700">
              {app.developer}
            </p>
          </div>

          {app.rating > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2">
                {t.detail.rating}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg md:text-xl">★</span>
                <span className="text-sm md:text-base text-gray-700 font-medium">
                  {t.detail.ratingOutOf.replace(
                    "{rating}",
                    app.rating.toFixed(1)
                  )}
                </span>
                {app.ratingCount > 0 && (
                  <span className="text-gray-500 text-xs md:text-sm">
                    (
                    {t.detail.ratings.replace(
                      "{count}",
                      formatNumber(app.ratingCount)
                    )}
                    )
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
            <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2">
              {t.detail.price}
            </h3>
            <p className="text-sm md:text-base text-gray-700 font-medium">
              {translatePrice(app.price)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
            <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2">
              {t.detail.platform}
            </h3>
            <p className="text-sm md:text-base text-gray-700">{storeLabel}</p>
          </div>
        </div>

        {/* Reviews Section */}
        {app.reviews && app.reviews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              {t.detail.reviews} ({app.reviews.length})
            </h2>
            <div className="space-y-4">
              {app.reviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 rounded-2xl p-4 md:p-6"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-semibold text-sm">
                          {review.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-semibold text-gray-900">
                          {review.userName}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-xs md:text-sm ${
                                  i < review.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs md:text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.version && (
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        {review.version}
                      </span>
                    )}
                  </div>

                  {/* Review Title */}
                  {review.title && (
                    <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2">
                      {review.title}
                    </h4>
                  )}

                  {/* Review Text */}
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3">
                    {review.text}
                  </p>

                  {/* Thumbs Up (Play Store only) */}
                  {review.thumbsUp !== undefined && review.thumbsUp > 0 && (
                    <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                      <span>👍</span>
                      <span>
                        {review.thumbsUp} {t.detail.helpful}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* View All Reviews Button */}
            {app.reviews.length > 3 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsReviewsModalOpen(true)}
                  className="px-6 py-3 bg-gray-100 text-gray-900 text-sm md:text-base font-semibold rounded-full hover:bg-gray-200 transition-colors"
                >
                  {t.detail.viewAllReviews} ({app.reviews.length})
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reviews Modal */}
        {app && app.reviews && (
          <ReviewsModal
            reviews={app.reviews}
            isOpen={isReviewsModalOpen}
            onClose={() => setIsReviewsModalOpen(false)}
            appTitle={app.title}
          />
        )}
      </main>

      {/* Footer */}
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}
