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

// Figures for the stats strip that only the client can supply. Each stays null, and its box stays hidden,
// until the client gives the real number from their Google Business profile or confirms the opening hours.
export const proof = {
  googleRating: null as number | null, // e.g. 4.8
  googleReviewCount: null as number | null, // e.g. 17
  alwaysOpen: false, // true only if the phone is genuinely answered 24/7
};

export const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/#work' },
  { label: 'Landlords', href: '/landlords' },
  { label: 'About', href: '/about' },
  { label: 'FAQs', href: '/#faq' },
  { label: 'Contact', href: '/contact' },
] as const;
