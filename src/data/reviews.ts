import googleReviews from './googleReviews.json';

export interface Review {
  quote: string;
  /** Stars the reviewer gave, 1 to 5. Left out when not known. */
  rating?: number;
  /** When it was posted, e.g. "October 2026". */
  date?: string;
  /** Where the review was published, e.g. "Google". */
  source: string;
}

// Real reviews only, from the client's Google Business profile (proof.googleReviewsUrl in site.ts), quoted
// word for word (only stray spaces tidied). Reviewers' names are not shown, at the client's request.
// Text Google cut short ends in "…".
//
// Copied by the client from the profile in November 2026. Only reviews describing actual work are used;
// the burst of one-word reviews posted on the profile in late November 2026 is deliberately left out
// (see the note to the client). A second review repeating another word for word is also left out.
//
// More can be added by hand below, or imported from a Google Takeout export with
// `npm run reviews -- <takeout-folder>` (written to googleReviews.json).
const fromProfile: Review[] = [
  { source: 'Google', quote: 'Piran builders did my internal Home renovation, starting from contracting till ends, all the work they did is great job, fully satisfied and helping on Building control application, they completed fully details work with our expecting. Highly recommend piran builders.' },
  { source: 'Google', quote: 'Highly recommend this builder! They did an amazing job with our kitchen construction. The work quality, finishing, and attention to detail were top-notch, and everything was completed right on schedule. Professional, reliable, and great to work with!' },
  { source: 'Google', quote: 'High quality work. He made my back extension. Very happy. High recommended this company.' },
  { source: 'Google', quote: 'Good worker. Works in the time requested. Very good pricing. Uses good materials. Built my extension (6 meters).' },
  { source: 'Google', quote: 'I had a great experience with Piran Trading. Their team demonstrated excellent workmanship, completed the job within the agreed timeframe, and showed great knowledge and professionalism throughout.' },
  { source: 'Google', quote: 'I highly recommend his services. Whether it’s building work, electrical installations, or any other home improvement project, he always delivers excellent results at a fair and reasonable price. He is professional, reliable, and always…' },
  { source: 'Google', quote: 'Lovely builders who have gone above expectations and supporting us in our journey.' },
  { source: 'Google', quote: 'High Quality Work using very good quality materials, Highly Recommended 👍🏼👍🏼' },
  { source: 'Google', quote: 'Piran doing outstanding work thanks Piran' },
];

export const reviews: Review[] = [
  ...fromProfile,
  ...(googleReviews as Omit<Review, 'source'>[]).map((r) => ({ ...r, source: 'Google' })),
];
