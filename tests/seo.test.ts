import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { services } from '../src/data/services';
import { sitemapPaths, sitemapXml } from '../src/lib/sitemap';

// Routes of the .astro pages in src/pages, skipping dynamic routes (covered by the services list) and noindex pages.
function staticRoutes(dir = 'src/pages', base = ''): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'api' ? [] : staticRoutes(full, `${base}/${entry.name}`);
    if (!entry.name.endsWith('.astro') || entry.name.startsWith('[')) return [];
    const name = entry.name.replace(/\.astro$/, '');
    return [name === 'index' ? base || '/' : `${base}/${name}`];
  });
}
const NOINDEX = new Set(['/404', '/contact/thanks']);

describe('sitemap', () => {
  it('lists every indexable page and no noindex page', () => {
    const paths = sitemapPaths();
    for (const route of staticRoutes()) {
      if (NOINDEX.has(route)) expect(paths, route).not.toContain(route);
      else expect(paths, route).toContain(route);
    }
  });

  it('lists every service page once', () => {
    const paths = sitemapPaths();
    for (const s of services) expect(paths.filter((p) => p === `/services/${s.slug}`)).toHaveLength(1);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('writes absolute URLs on the given host without trailing slashes', () => {
    const xml = sitemapXml('https://www.piranbuilders.co.uk');
    expect(xml).toContain('<loc>https://www.piranbuilders.co.uk/</loc>');
    expect(xml).toContain('<loc>https://www.piranbuilders.co.uk/services/bathrooms</loc>');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    expect(locs.filter((p) => p !== '/' && p.endsWith('/'))).toEqual([]);
  });
});
