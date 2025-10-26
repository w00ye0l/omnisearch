/**
 * HTML 엔티티를 디코딩하고 HTML 태그를 처리하는 유틸리티 함수
 */

/**
 * HTML 엔티티를 일반 텍스트로 디코딩
 * 예: &#39; → ', &quot; → ", &amp; → &
 */
export function decodeHtmlEntities(text: string): string {
  if (typeof window === 'undefined') {
    // 서버사이드에서는 수동 변환
    const entities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x27;': "'",
      '&apos;': "'",
    };

    let decoded = text;

    // Named entities
    Object.entries(entities).forEach(([entity, char]) => {
      decoded = decoded.replace(new RegExp(entity, 'g'), char);
    });

    // Numeric entities (&#123; or &#xAB;)
    decoded = decoded.replace(/&#(\d+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 10))
    );
    decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    );

    return decoded;
  }

  // 클라이언트사이드에서는 DOMParser 사용
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * HTML 태그를 React-friendly 형식으로 변환
 * <br> → \n
 * <p> → \n\n
 */
export function convertHtmlToText(html: string): string {
  let text = html;

  // <br>, <br/>, <br /> → 줄바꿈
  text = text.replace(/<br\s*\/?>/gi, '\n');

  // <p> → 단락 구분
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<p[^>]*>/gi, '');

  // 다른 HTML 태그 제거
  text = text.replace(/<[^>]*>/g, '');

  // HTML 엔티티 디코딩
  text = decodeHtmlEntities(text);

  // 과도한 줄바꿈 정리 (3개 이상 → 2개)
  text = text.replace(/\n{3,}/g, '\n\n');

  // 앞뒤 공백 제거
  text = text.trim();

  return text;
}

/**
 * 앱 설명 텍스트를 정제하여 표시용으로 변환
 */
export function sanitizeAppDescription(description: string): string {
  if (!description) return '';

  return convertHtmlToText(description);
}
