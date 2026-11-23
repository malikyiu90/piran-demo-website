// Business details shown across the site. Only facts taken from the client's existing site live here.
export const site = {
  name: 'Piran Builders',
  // Registered company details, from the client's terms and privacy policy (November 2026).
  legalName: 'Piran Builders Ltd',
  companyNumber: '13484930',
  registeredOffice: 'Maximax, 37 Hamlet Court Road, Westcliff-on-Sea, England, SS0 7EY',
  shortName: 'Piran',
  tagline: 'Construction & renovation in Coventry',
  url: 'https://www.piranbuilders.co.uk',
  // Office number (Coventry landline), shown alongside the mobile, which is also the WhatsApp number.
  // Display formats are the client's own.
  phone: '02475 105455',
  phoneHref: 'tel:+442475105455',
  mobile: '+44 7405 308436',
  mobileHref: 'tel:+447405308436',
  whatsappHref: 'https://wa.me/447405308436',
  email: 'info@piranbuilders.co.uk',
  location: 'Coventry, United Kingdom',
  locality: 'Coventry',
  country: 'GB',
  // The content="..." code from Google Search Console's "HTML tag" verification method; null leaves the tag out.
  // Not needed when the domain is verified through a DNS record instead.
  googleSiteVerification: 'bSIKS-Twww_W_zcZOH8-m51oe75LWLxWdbsbowQGck0' as string | null,
  social: {
    facebook: 'https://www.facebook.com/3piran/' as string | null,
    // Add the client's Instagram and TikTok profile links here; their footer icons appear once set.
    instagram: 'https://www.instagram.com/piran9636/' as string | null,
    tiktok: null as string | null,
    youtube: null as string | null,
  },
} as const;

// Figures for the stats strip and reviews section that only the client can supply (null / false hides them).
// Rating and count from the client's Google Business profile (CID 18147134516182513345), November 2026.
// Update them when the profile changes; visitors can check them through googleReviewsUrl.
export const proof = {
  googleRating: 5.0 as number | null,
  googleReviewCount: 52 as number | null,
  googleReviewsUrl: 'https://maps.google.com/maps?cid=18147134516182513345' as string | null,
  // Client's stated response time for free site visits and quotes.
  fastResponse: true,
};

export const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Landlords', href: '/landlords' },
  { label: 'About', href: '/about' },
  { label: 'FAQs', href: '/#faq' },
  { label: 'Contact', href: '/contact' },
] as const;
