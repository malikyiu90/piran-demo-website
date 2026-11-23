// Imports the client's own Google reviews into src/data/googleReviews.json, which feeds the reviews carousel.
// Source: a Google Takeout export of the Business Profile (unzipped folder or any .json file in it), or a saved
// Business Profile API / Places API response. Nothing is fetched from Google by this script.
// Usage: node scripts/import-reviews.mjs <takeout-folder-or-json> [--min-rating 4]
import fs from 'node:fs';
import path from 'node:path';
import { normalizeReviews } from '../src/lib/googleReviews.ts';

const OUT = path.join('src', 'data', 'googleReviews.json');
const [input, ...flags] = process.argv.slice(2);
const minIndex = flags.indexOf('--min-rating');
const minRating = minIndex >= 0 ? Number(flags[minIndex + 1]) : 1;

if (!input || !fs.existsSync(input)) {
  console.error('Usage: node scripts/import-reviews.mjs <takeout-folder-or-json> [--min-rating 4]');
  process.exit(1);
}

function jsonFiles(p) {
  const stat = fs.statSync(p);
  if (stat.isFile()) return p.endsWith('.json') ? [p] : [];
  return fs.readdirSync(p).flatMap((name) => jsonFiles(path.join(p, name)));
}

const data = jsonFiles(input).map((file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
});

// Reviewer names are left out: the site does not show them (client request, November 2026).
const reviews = normalizeReviews(data, { minRating }).map(({ time, name, ...review }) => review);
if (reviews.length === 0) {
  console.error('No reviews with written text were found. Check that the export includes Google Business Profile reviews.');
  process.exit(1);
}
fs.writeFileSync(OUT, JSON.stringify(reviews, null, 2) + '\n');
console.log(`${OUT}: ${reviews.length} reviews (newest ${reviews[0].date}, oldest ${reviews[reviews.length - 1].date})`);
