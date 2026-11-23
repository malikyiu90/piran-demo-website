import { describe, expect, it } from 'vitest';
import { cleanText, normalizeReviews, shortName } from '../src/lib/googleReviews';

describe('Google review import', () => {
  it('reads Business Profile / Takeout reviews', () => {
    const takeout = {
      reviews: [
        { reviewer: { displayName: 'Sarah Mitchell' }, starRating: 'FIVE', comment: 'Brilliant loft conversion.', createTime: '2026-10-03T10:00:00Z' },
        { reviewer: { displayName: 'Tom' }, starRating: 'FOUR', comment: 'Good work.', createTime: '2026-09-01T10:00:00Z' },
      ],
    };
    expect(normalizeReviews(takeout)).toEqual([
      { name: 'Sarah M.', rating: 5, date: 'October 2026', quote: 'Brilliant loft conversion.', time: '2026-10-03T10:00:00Z' },
      { name: 'Tom', rating: 4, date: 'September 2026', quote: 'Good work.', time: '2026-09-01T10:00:00Z' },
    ]);
  });

  it('reads Places API reviews', () => {
    const places = { reviews: [{ rating: 5, text: { text: 'Great kitchen.' }, authorAttribution: { displayName: 'Ali Khan' }, publishTime: '2026-08-15T09:00:00Z' }] };
    expect(normalizeReviews(places)[0]).toMatchObject({ name: 'Ali K.', rating: 5, quote: 'Great kitchen.', date: 'August 2026' });
  });

  it('skips star-only reviews, low ratings below the minimum and duplicates', () => {
    const r = (comment: string | undefined, starRating = 'FIVE') => ({ reviewer: { displayName: 'Jo Bloggs' }, starRating, comment, createTime: '2026-01-01T00:00:00Z' });
    const out = normalizeReviews([r(undefined), r('Lovely job.'), r('Lovely job.'), r('Late finish.', 'TWO')], { minRating: 4 });
    expect(out.map((x) => x.quote)).toEqual(['Lovely job.']);
  });

  it('keeps the reviewer’s own words from translated reviews and shortens names', () => {
    expect(cleanText('(Translated by Google) Very good (Original) Bahut acha kaam')).toBe('Bahut acha kaam');
    expect(shortName('  mary  ann  smith ')).toBe('mary S.');
  });
});
