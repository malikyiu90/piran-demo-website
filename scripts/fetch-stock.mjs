// Downloads the stock photos listed in content/stock/pixabay.txt, converts them to WebP in
// public/gallery/<slug>-<n>.webp (up to 2560w) plus public/gallery/sm/ (960w), and writes src/data/servicePhotos.json.
// Usage: node scripts/fetch-stock.mjs                      (every photo)
//        node scripts/fetch-stock.mjs bathrooms-1 tiling-2  (only these; the rest of the manifest is kept)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import ffmpeg from 'ffmpeg-static';

const LIST = 'content/stock/pixabay.txt';
const MANIFEST = path.join('src', 'data', 'servicePhotos.json');
const OUT_DIR = path.join('public', 'gallery');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'piran-stock-'));
const only = new Set(process.argv.slice(2));

// A row's photo column is either a path under cdn.pixabay.com/photo/ or a full https:// download link
// (Pexels / Unsplash originals); its source column is either a pixabay.com/photos/ slug or a full page URL.
const rows = fs.readFileSync(LIST, 'utf8')
  .split(/\r?\n/)
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => {
    const [slug, photo, page] = line.split('|');
    const isUrl = photo.startsWith('https://');
    return {
      slug,
      url: isUrl ? photo : `https://cdn.pixabay.com/photo/${photo}`,
      // Pixabay's CDN only serves its own site; the other hosts are plain public downloads.
      headers: isUrl ? {} : { Referer: 'https://pixabay.com/', 'User-Agent': 'Mozilla/5.0' },
      source: page.startsWith('https://') ? page : `https://pixabay.com/photos/${page}/`,
    };
  });

fs.mkdirSync(path.join(OUT_DIR, 'sm'), { recursive: true });
const manifest = only.size ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
const counters = {};

for (const row of rows) {
  const n = (counters[row.slug] = (counters[row.slug] ?? 0) + 1);
  const file = `${row.slug}-${n}.webp`;
  if (only.size && !only.has(`${row.slug}-${n}`)) continue;

  const response = await fetch(row.url, { headers: row.headers });
  if (!response.ok) {
    console.error(`FAILED ${row.slug} #${n}: ${response.status} ${row.url}`);
    process.exitCode = 1;
    continue;
  }
  const raw = path.join(TMP, `${row.slug}-${n}.img`);
  fs.writeFileSync(raw, Buffer.from(await response.arrayBuffer()));

  // 2560px is sharp on high-density screens for every slot on the site; 4K originals would only add weight.
  const result = spawnSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', raw,
    '-vf', "scale='min(2560,iw)':-2:flags=lanczos", '-c:v', 'libwebp', '-quality', '76',
    path.join(OUT_DIR, file),
  ], { stdio: 'inherit' });
  // 960px copy for lists and grids.
  const thumb = spawnSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', raw,
    '-vf', "scale='min(960,iw)':-2:flags=lanczos", '-c:v', 'libwebp', '-quality', '74',
    path.join(OUT_DIR, 'sm', file),
  ], { stdio: 'inherit' });
  if (result.status !== 0 || thumb.status !== 0) {
    console.error(`CONVERT FAILED ${file}`);
    process.exitCode = 1;
    continue;
  }
  const list = (manifest[row.slug] ??= []);
  list[n - 1] = { src: `/gallery/${file}`, source: row.source };
  console.log(`ok ${file}`);
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
fs.rmSync(TMP, { recursive: true, force: true });
const total = Object.values(manifest).reduce((sum, list) => sum + list.length, 0);
console.log(`${total} photos for ${Object.keys(manifest).length} services`);
for (const [slug, list] of Object.entries(manifest)) if (list.length !== 4) console.log(`  ${slug}: ${list.length}`);
