import { services } from '../data/services';

/**
 * Every indexable page, written the way the site links to it (no trailing slash), which is also the canonical URL.
 * The thank-you and 404 pages are noindex and stay out. A test checks this list against src/pages.
 */
export function sitemapPaths(): string[] {
  return [
    '/',
    '/services',
    ...services.map((s) => `/services/${s.slug}`),
    '/about',
    '/landlords',
    '/contact',
    '/terms',
    '/privacy',
  ];
}

export function sitemapXml(site: URL | string): string {
  const urls = sitemapPaths()
    .map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
