import type { APIRoute } from 'astro';
import { sitemapXml } from '../lib/sitemap';

// Built as a static file at /sitemap.xml; robots.txt points search engines to it.
export const GET: APIRoute = ({ site }) =>
  new Response(sitemapXml(site!), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
