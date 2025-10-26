'use client';

import Script from 'next/script';

export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';

export default function AdSense() {
  // AdSense Client ID가 없으면 로드하지 않음
  if (!ADSENSE_CLIENT_ID) {
    console.warn('NEXT_PUBLIC_ADSENSE_CLIENT_ID is not set');
    return null;
  }

  // 프로덕션 환경이 아니면 로드하지 않음
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}

// AdSense 광고 컴포넌트
export function AdSenseAd({ slot, style = {} }: { slot: string; style?: React.CSSProperties }) {
  // AdSense 승인 대기 중이므로 광고를 렌더링하지 않음
  // 승인 후 이 return null을 제거하세요
  return null;

  // 아래 코드는 AdSense 승인 후 활성화됩니다
  /*
  if (!ADSENSE_CLIENT_ID) {
    // 개발 환경에서 광고 위치 표시
    if (process.env.NODE_ENV === 'development') {
      return (
        <div
          style={{
            padding: '20px',
            margin: '16px 0',
            border: '2px dashed #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
            color: '#6b7280',
            ...style,
          }}
        >
          <p style={{ margin: 0, fontSize: '14px' }}>📢 AdSense 광고 영역</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>슬롯 ID: {slot}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div style={{ display: 'block', textAlign: 'center', margin: '16px 0', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={`adsense-ad-${slot}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
  */
}
