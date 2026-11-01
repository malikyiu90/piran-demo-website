// Business details shown across the site. Only facts taken from the client's existing site live here.
export const site = {
  name: 'Piran Trading Limited',
  shortName: 'Piran',
  tagline: 'Construction & renovation in Coventry',
  url: 'https://pirantrading.com',
  phone: '+44 7405 308436',
  phoneHref: 'tel:+447405308436',
  whatsappHref: 'https://wa.me/447405308436',
  email: 'info@pirantrading.com',
  location: 'Coventry, United Kingdom',
  locality: 'Coventry',
  country: 'GB',
  social: {
    facebook: null as string | null,
    instagram: null as string | null,
    youtube: null as string | null,
  },
} as const;

// Figures for the stats strip that only the client can supply (null / false hides the box).
// Supplied by the client from their own Google Business profile, which they share with Mazzy Construction Ltd,
// November 2026. Update these when the profile changes.
export const proof = {
  googleRating: 4.8 as number | null,
  googleReviewCount: 17 as number | null,
  alwaysOpen: true, // client confirms the phone is answered 24/7
};

export const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/#work' },
  { label: 'Landlords', href: '/landlords' },
  { label: 'About', href: '/about' },
  { label: 'FAQs', href: '/#faq' },
  { label: 'Contact', href: '/contact' },
] as const;
