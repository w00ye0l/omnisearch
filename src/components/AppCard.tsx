'use client';

import Link from 'next/link';
import { App } from '@/lib/types/app.types';
import { Badge } from '@/components/ui/badge';
import AppIcon from '@/components/AppIcon';
import { sanitizeAppDescription } from '@/lib/utils/textUtils';
import { event } from '@/app/gtag';

interface AppCardProps {
  app: App;
  searchQuery?: string;
  rank?: number;
}

export default function AppCard({ app, searchQuery, rank }: AppCardProps) {
  const storeLabel = app.store === 'appstore' ? 'App Store' : 'Play Store';
  const storeVariant = app.store === 'appstore' ? 'appstore' : 'playstore';

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Store app data in sessionStorage for detail page
  const handleClick = () => {
    sessionStorage.setItem(`app-${app.store}-${app.id}`, JSON.stringify(app));

    // GA 이벤트: 검색 결과 클릭
    if (searchQuery) {
      event({
        action: "검색결과_클릭",
        category: "검색",
        label: `${app.title} (${app.store}) - 검색어: ${searchQuery}${rank ? ` - 순위: ${rank}` : ''}`,
        value: rank || 1,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all p-5 group">
      <Link href={`/app/${app.store}/${app.id}`} className="block" onClick={handleClick}>
        <div className="flex gap-4">
          {/* App Icon */}
          <div className="flex-shrink-0">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
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
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors flex-1">
                {app.title}
              </h3>
              <Badge variant={storeVariant as 'appstore' | 'playstore'} className="flex-shrink-0">
                {storeLabel}
              </Badge>
            </div>

            {/* Developer */}
            <p className="text-sm text-gray-600 truncate mb-2">{app.developer}</p>

            {/* Rating, Reviews, and Price */}
            <div className="flex items-center gap-3 text-sm">
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
              <span className="font-medium text-gray-900">{app.price}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {app.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {sanitizeAppDescription(app.description)}
          </p>
        )}
      </Link>

      {/* External Link Button */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
  );
}
