// Turns Google review data into the site's review list. Accepts the review objects found in a Google Takeout
// export of a Business Profile or a Business Profile API response (starRating "FIVE", comment, reviewer,
// createTime) and Places API responses (rating 5, text.text, authorAttribution, publishTime).
// Plain TypeScript with no imports, so scripts/import-reviews.mjs can load it directly under Node.

export interface ImportedReview {
  name: string;
  rating: number;
  date: string;
  quote: string;
  /** ISO time, kept for sorting newest first. */
  time: string;
}

const STARS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "Sarah Mitchell" → "Sarah M.": a first name and initial is all the site needs to show. */
export function shortName(full: string): string {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Google user';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

/** Google adds "(Translated by Google) … (Original) …" to translated reviews; keep the reviewer's own words. */
export function cleanText(text: string): string {
  const original = text.match(/\(Original\)\s*([\s\S]+)$/);
  const kept = original ? original[1] : text.replace(/^\(Translated by Google\)\s*/, '');
  return kept.replace(/\s+\n/g, '\n').trim();
}

export function monthYear(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

type Raw = Record<string, any>;

function ratingOf(r: Raw): number | null {
  if (typeof r.rating === 'number') return r.rating;
  if (typeof r.starRating === 'string') return STARS[r.starRating] ?? null;
  return null;
}

function textOf(r: Raw): string {
  const t = r.originalText?.text ?? r.text?.text ?? r.comment ?? '';
  return typeof t === 'string' ? t : '';
}

function nameOf(r: Raw): string {
  return r.authorAttribution?.displayName ?? r.reviewer?.displayName ?? '';
}

function looksLikeReview(node: Raw): boolean {
  return ratingOf(node) !== null && (node.reviewer || node.authorAttribution) && ('comment' in node || 'text' in node || 'originalText' in node);
}

function collect(node: unknown, out: Raw[]): Raw[] {
  if (Array.isArray(node)) node.forEach((n) => collect(n, out));
  else if (node && typeof node === 'object') {
    if (looksLikeReview(node as Raw)) out.push(node as Raw);
    else Object.values(node).forEach((v) => collect(v, out));
  }
  return out;
}

/**
 * Finds every review in the given data (any nesting), keeps those with written text and at least
 * `minRating` stars, removes duplicates and returns them newest first.
 */
export function normalizeReviews(data: unknown, { minRating = 1 } = {}): ImportedReview[] {
  const seen = new Set<string>();
  const list: ImportedReview[] = [];
  for (const r of collect(data, [])) {
    const rating = ratingOf(r)!;
    const quote = cleanText(textOf(r));
    if (!quote || rating < minRating) continue;
    const name = shortName(nameOf(r));
    const key = `${name}|${quote}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const time = r.publishTime ?? r.createTime ?? r.updateTime ?? '';
    list.push({ name, rating, date: monthYear(time), quote, time });
  }
  return list.sort((a, b) => b.time.localeCompare(a.time));
}
