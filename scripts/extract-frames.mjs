// Extracts the hero video into WebP frame sequences for scroll scrubbing,
// then writes the frame count into src/components/Hero.astro (data-frame-count).
// Usage: node scripts/extract-frames.mjs <video.mp4>
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';

const input = process.argv[2];
if (!input || !fs.existsSync(input)) {
  console.error('Video not found. Usage: node scripts/extract-frames.mjs <video.mp4>');
  process.exit(1);
}

const HERO = path.join('src', 'components', 'Hero.astro');
const FPS = 12;
// Light temporal denoise: AI video grain costs a lot of bytes and adds nothing on a scrubbed canvas.
const DENOISE = 'hqdn3d=2:2:4:4';
const SETS = [
  { name: 'lg', width: 1600, quality: 62 },
  { name: 'sm', width: 1080, quality: 58 },
];

function run(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

let count = 0;
for (const set of SETS) {
  const dir = path.join('public', 'frames', set.name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  run([
    '-i', input,
    '-vf', `fps=${FPS},${DENOISE},scale=${set.width}:-2:flags=lanczos`,
    '-c:v', 'libwebp', '-quality', String(set.quality), '-compression_level', '6',
    path.join(dir, '%04d.webp'),
  ]);

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.webp'));
  const bytes = files.reduce((sum, f) => sum + fs.statSync(path.join(dir, f)).size, 0);
  console.log(`${set.name}: ${files.length} frames @ ${set.width}w, ${(bytes / 1024 / 1024).toFixed(1)} MB`);
  if (count && files.length !== count) {
    console.error('Frame sets have different lengths.');
    process.exit(1);
  }
  count = files.length;
}

// Poster = first frame as JPEG, painted instantly before the sequence loads.
run(['-i', input, '-vf', `${DENOISE},scale=1920:-2:flags=lanczos`, '-frames:v', '1', '-q:v', '4', path.join('public', 'frames', 'poster.jpg')]);

const html = fs.readFileSync(HERO, 'utf8');
fs.writeFileSync(HERO, html.replace(/data-frame-count="\d+"/, `data-frame-count="${count}"`));
console.log(`${HERO}: data-frame-count="${count}"`);
