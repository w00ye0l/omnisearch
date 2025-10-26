'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { App } from '@/lib/types/app.types';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import AppIcon from '@/components/AppIcon';
import AppScreenshot from '@/components/AppScreenshot';
import Footer from '@/components/Footer';
import { sanitizeAppDescription } from '@/lib/utils/textUtils';
import { event } from '@/app/gtag';

export default function AppDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [app, setApp] = useState<App | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const store = params.store as string;
  const id = params.id as string;

  useEffect(() => {
    const fetchAppDetails = async () => {
      try {
        // First, try to get from sessionStorage
        const cachedData = sessionStorage.getItem(`app-${store}-${id}`);

        if (cachedData) {
          console.log('Using cached app data');
          const appData = JSON.parse(cachedData);
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

        // If not in cache, fetch from API
        console.log('Fetching from API');
        const response = await fetch(`/api/app/${store}/${id}`);

        if (!response.ok) {
          throw new Error('앱 정보를 불러오는데 실패했습니다');
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
        setError(err instanceof Error ? err.message : '오류가 발생했습니다');
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
            앱을 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  const storeLabel = app.store === 'appstore' ? 'App Store' : 'Play Store';
  const storeVariant = app.store === 'appstore' ? 'appstore' : 'playstore';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">뒤로 가기</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* App Header */}
        <div className="flex gap-4 mb-8">
          {/* App Icon */}
          <div className="flex-shrink-0">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-gray-100">
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
            <div className="flex items-start gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 flex-1">
                {app.title}
              </h1>
              <Badge variant={storeVariant as 'appstore' | 'playstore'}>
                {storeLabel}
              </Badge>
            </div>

            <p className="text-base text-gray-600 mb-3">{app.developer}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-4">
              {app.rating > 0 && (
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="text-xl font-bold text-gray-900">
                      {app.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {app.ratingCount > 0 && `${formatNumber(app.ratingCount)} 평가`}
                  </p>
                </div>
              )}

              <div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {app.price}
                </div>
                <p className="text-xs text-gray-500">가격</p>
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
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition-colors"
            >
              <span>{storeLabel}에서 보기</span>
              <svg
                className="w-4 h-4"
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">미리보기</h2>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">설명</h2>
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {sanitizeAppDescription(app.description)}
              </p>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">개발자</h3>
            <p className="text-gray-700">{app.developer}</p>
          </div>

          {app.rating > 0 && (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">평점</h3>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">★</span>
                <span className="text-gray-700 font-medium">
                  {app.rating.toFixed(1)} / 5.0
                </span>
                {app.ratingCount > 0 && (
                  <span className="text-gray-500 text-sm">
                    ({formatNumber(app.ratingCount)}개 평가)
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">가격</h3>
            <p className="text-gray-700 font-medium">{app.price}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">플랫폼</h3>
            <p className="text-gray-700">{storeLabel}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}
