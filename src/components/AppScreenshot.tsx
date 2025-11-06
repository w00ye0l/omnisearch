'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AppScreenshotProps {
  src: string;
  alt: string;
  index: number;
  useProxy?: boolean;
}

export default function AppScreenshot({
  src,
  alt,
  index,
  useProxy = true
}: AppScreenshotProps) {
  const [hasError, setHasError] = useState(false);

  // 프록시 서버를 통해 이미지 로드 (429 에러 방지)
  const imageSrc = useProxy
    ? `/api/image-proxy?url=${encodeURIComponent(src)}`
    : src;

  if (hasError) {
    return (
      <div className="flex-shrink-0 w-36 md:w-48 h-[256px] md:h-[341px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-2xl md:text-3xl mb-2">📱</div>
          <p className="text-xs text-gray-500">스크린샷 {index + 1}</p>
          <p className="text-xs text-gray-400 mt-1">로드 실패</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-36 md:w-48 rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow bg-gray-100">
      <Image
        src={imageSrc}
        alt={alt}
        width={192}
        height={341}
        className="object-cover w-full h-auto"
        unoptimized
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
