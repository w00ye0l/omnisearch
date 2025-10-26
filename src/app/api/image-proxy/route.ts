import { NextRequest, NextResponse } from 'next/server';

// 간단한 인메모리 캐시 (프로덕션에서는 Redis 사용 권장)
const cache = new Map<string, { data: Buffer; contentType: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24시간

// Rate limiting을 위한 간단한 카운터
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 1000 * 60; // 1분
const MAX_REQUESTS_PER_WINDOW = 20;

function checkRateLimit(url: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(url);

  if (!limit || now > limit.resetTime) {
    rateLimits.set(url, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (limit.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  limit.count++;
  return true;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
  }

  // 허용된 도메인 체크
  const allowedDomains = [
    'play-lh.googleusercontent.com',
    'is1-ssl.mzstatic.com',
    'is2-ssl.mzstatic.com',
    'is3-ssl.mzstatic.com',
    'is4-ssl.mzstatic.com',
    'is5-ssl.mzstatic.com',
  ];

  try {
    const url = new URL(imageUrl);
    if (!allowedDomains.some((domain) => url.hostname === domain)) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  // Rate limiting 체크
  if (!checkRateLimit(imageUrl)) {
    // 캐시에서 가져오기 시도
    const cached = cache.get(imageUrl);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION * 7) {
      // Rate limit 시 캐시 기간 연장 (7일)
      return new NextResponse(new Uint8Array(cached.data), {
        headers: {
          'Content-Type': cached.contentType,
          'Cache-Control': 'public, max-age=604800',
          'X-Cache': 'HIT-RATE-LIMITED',
        },
      });
    }

    return NextResponse.json(
      { error: 'Rate limit exceeded, please try again later' },
      { status: 429 }
    );
  }

  // 캐시 확인
  const cached = cache.get(imageUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return new NextResponse(new Uint8Array(cached.data), {
      headers: {
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=86400',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    // 이미지 가져오기
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OmniSearch/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 캐시 저장
    cache.set(imageUrl, {
      data: buffer,
      contentType,
      timestamp: Date.now(),
    });

    // 캐시 크기 제한 (최대 100개)
    if (cache.size > 100) {
      const oldestKey = Array.from(cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
      cache.delete(oldestKey);
    }

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
