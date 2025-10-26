'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AppIconProps {
  src: string;
  alt: string;
  title: string;
  size?: number;
  useProxy?: boolean;
}

export default function AppIcon({
  src,
  alt,
  title,
  size = 64,
  useProxy = true
}: AppIconProps) {
  const [hasError, setHasError] = useState(false);

  // 프록시 서버를 통해 이미지 로드 (429 에러 방지)
  const imageSrc = useProxy
    ? `/api/image-proxy?url=${encodeURIComponent(src)}`
    : src;

  if (hasError) {
    return (
      <div
        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 font-semibold text-xl rounded-2xl"
        title={title}
      >
        {title.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      className="object-cover"
      sizes={`${size}px`}
      unoptimized
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}
