import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { legacyRedirects } from './src/data/services';

export default defineConfig({
  site: 'https://pirantrading.com',
  output: 'static',
  // Pages are prerendered; only /api/quote runs as a Vercel serverless function.
  adapter: vercel(),
  trailingSlash: 'ignore',
  // Behind a hosting proxy, trust X-Forwarded-Host only for the real domain. Astro's built-in origin
  // check for form posts compares against this host, so without it plain form submissions are rejected.
  security: {
    allowedDomains: [
      { hostname: 'pirantrading.com', protocol: 'https' },
      { hostname: 'www.pirantrading.com', protocol: 'https' },
      // Vercel production and preview URLs.
      { hostname: '**.vercel.app', protocol: 'https' },
    ],
  },
  // Old WordPress URLs keep working (and keep their search ranking) after the move.
  redirects: {
    '/about-us': '/about',
    '/contact-us': '/contact',
    '/our-services': '/services',
    '/terms-conditions': '/terms',
    '/reviews': '/',
    ...legacyRedirects(),
  },
});
