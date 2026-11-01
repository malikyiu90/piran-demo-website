export interface Review {
  quote: string;
  name: string;
  context?: string;
  source: string;
}

// ⚠ These four testimonials are copied word for word from the client's previous website
// (pirantrading.com home page, 2024). Before launch, the client must confirm they come from
// real customers, or replace them with reviews from a verifiable source (e.g. Google Business).
export const reviews: Review[] = [
  {
    quote: 'Outstanding service and attention to detail! Highly recommend Piran Trading Limited for any renovation project.',
    name: 'Sarah M.',
    context: 'Customer',
    source: 'Previously published on pirantrading.com',
  },
  {
    quote: 'Piran Trading Limited exceeded our expectations! Professional, reliable, and skilled. Couldn’t be happier with the results.',
    name: 'John D.',
    context: 'Customer',
    source: 'Previously published on pirantrading.com',
  },
  {
    quote: 'Impressed by the efficiency and quality of work provided by Piran Trading Limited. A seamless experience from start to finish.',
    name: 'Emily R.',
    context: 'Customer',
    source: 'Previously published on pirantrading.com',
  },
  {
    quote: 'Exceptional craftsmanship and excellent communication throughout the project. Piran Trading Limited is our go-to for all future renovations.',
    name: 'David S.',
    context: 'Customer',
    source: 'Previously published on pirantrading.com',
  },
];

/** Public review profile (e.g. Google Business). Set once the client provides it. */
export const reviewProfileUrl: string | null = null;
