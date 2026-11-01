// Downloads the stock photos listed in content/stock/pixabay.txt, converts them to WebP in
// public/gallery/<slug>-<n>.webp (1280w) plus public/gallery/sm/ (720w), and writes src/data/servicePhotos.json.
// Usage: node scripts/fetch-stock.mjs
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import ffmpeg from 'ffmpeg-static';

const LIST = 'content/stock/pixabay.txt';
const OUT_DIR = path.join('public', 'gallery');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'piran-stock-'));

const rows = fs.readFileSync(LIST, 'utf8')
  .split(/\r?\n/)
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => {
    const [slug, cdnPath, pageSlug] = line.split('|');
    return { slug, cdnPath, pageSlug };
  });

fs.mkdirSync(path.join(OUT_DIR, 'sm'), { recursive: true });
const manifest = {};
const counters = {};

for (const row of rows) {
  const n = (counters[row.slug] = (counters[row.slug] ?? 0) + 1);
  const url = `https://cdn.pixabay.com/photo/${row.cdnPath}`;
  const response = await fetch(url, { headers: { Referer: 'https://pixabay.com/', 'User-Agent': 'Mozilla/5.0' } });
  if (!response.ok) {
    console.error(`FAILED ${row.slug} #${n}: ${response.status} ${url}`);
    process.exitCode = 1;
    continue;
  }
  const raw = path.join(TMP, path.basename(row.cdnPath));
  fs.writeFileSync(raw, Buffer.from(await response.arrayBuffer()));

  const file = `${row.slug}-${n}.webp`;
  const result = spawnSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', raw,
    '-vf', "scale='min(1280,iw)':-2:flags=lanczos", '-c:v', 'libwebp', '-quality', '72',
    path.join(OUT_DIR, file),
  ], { stdio: 'inherit' });
  // 720px copy for lists and grids.
  const thumb = spawnSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', raw,
    '-vf', "scale='min(720,iw)':-2:flags=lanczos", '-c:v', 'libwebp', '-quality', '70',
    path.join(OUT_DIR, 'sm', file),
  ], { stdio: 'inherit' });
  if (result.status !== 0 || thumb.status !== 0) {
    console.error(`CONVERT FAILED ${file}`);
    process.exitCode = 1;
    continue;
  }
  (manifest[row.slug] ??= []).push({ src: `/gallery/${file}`, source: `https://pixabay.com/photos/${row.pageSlug}/` });
}

fs.writeFileSync(path.join('src', 'data', 'servicePhotos.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.rmSync(TMP, { recursive: true, force: true });
const total = Object.values(manifest).reduce((sum, list) => sum + list.length, 0);
console.log(`${total} photos for ${Object.keys(manifest).length} services`);
for (const [slug, list] of Object.entries(manifest)) if (list.length !== 4) console.log(`  ${slug}: ${list.length}`);
