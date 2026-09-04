/**
 * Source and Link Sanitization Utility for CapyNews
 * Cleans newspaper/magazine names and ensures links point to real browser-accessible web pages
 * instead of raw RSS/XML feeds.
 */

export function getCleanSourceName(rawSource?: string): string {
  if (!rawSource) return 'Portal de Notícias';
  
  // Clean up parenthesis like "(BR)", "(FR)", "(AU)", "(KR)", "(MX)", "(UA)" if needed,
  // but keep the renowned publisher name clean and recognizable.
  const cleaned = rawSource.replace(/\s*\([A-Z]{2}\)$/i, '').trim();
  return cleaned || rawSource;
}

export function getCleanArticleUrl(
  sourceUrl?: string,
  sourceName?: string,
  articleTitle?: string,
  originalTitle?: string
): string {
  const cleanSource = getCleanSourceName(sourceName);
  const titleForSearch = (originalTitle || articleTitle || '').trim();

  if (!sourceUrl || sourceUrl.trim() === '') {
    if (titleForSearch) {
      return `https://news.google.com/search?q=${encodeURIComponent(`${cleanSource} ${titleForSearch}`)}`;
    }
    return 'https://news.google.com';
  }

  const url = sourceUrl.trim();

  // Check if it's an XML/RSS feed url
  const isFeed = url.endsWith('.xml') || url.includes('/rss') || url.includes('/feed') || url.includes('.rss');

  // Check if it's just a bare domain homepage (e.g. "https://asia.nikkei.com" without deep article path)
  let isBareDomain = false;
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/+$/, '').toLowerCase();
    if (path === '' || path === '/news' || path === '/home' || path === '/pt' || path === '/en') {
      isBareDomain = true;
    }
  } catch {
    isBareDomain = false;
  }

  // If it's a real deep article link with a specific path/slug, return it directly
  if (!isFeed && !isBareDomain) {
    return url;
  }

  // If it's a bare domain or raw feed, avoid throwing user onto a generic homepage!
  // Instead, direct them straight to the specific article search for this story:
  if (titleForSearch) {
    return `https://news.google.com/search?q=${encodeURIComponent(`${cleanSource} ${titleForSearch}`)}`;
  }

  return url;
}

