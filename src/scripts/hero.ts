// Scroll-built hero: a pinned canvas scrubs a WebP frame sequence (public/frames/{lg,sm}/0001.webp…)
// with GSAP ScrollTrigger. Adjacent frames are cross-blended so the sequence stays smooth between samples.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero) initHero(hero);

function initHero(hero: HTMLElement) {
  const canvas = hero.querySelector<HTMLCanvasElement>('[data-canvas]')!;
  const ctx = canvas.getContext('2d')!;
  const media = hero.querySelector<HTMLElement>('[data-media]')!;
  const chapters = [...hero.querySelectorAll<HTMLElement>('[data-chapter]')];
  const steps = [...hero.querySelectorAll<HTMLElement>('[data-step]')];
  const progressFill = hero.querySelector<HTMLElement>('[data-progress-fill]');
  const progressPct = hero.querySelector<HTMLElement>('[data-progress-pct]');
  const cue = hero.querySelector<HTMLElement>('[data-scroll-cue]');
  const loader = hero.querySelector<HTMLElement>('[data-loader]');
  const loaderFill = hero.querySelector<HTMLElement>('[data-loader-fill]');
  const loaderPct = hero.querySelector<HTMLElement>('[data-loader-pct]');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Build stages as fractions of the video timeline (foundation → frame → finish → handover).
  const STAGE_STARTS = [0, 0.13, 0.33, 0.66];
  // Share of the hero's visible width the house occupies; narrow screens zoom out to keep it in frame.
  const FOCUS_WIDTH = 0.6;
  // Share of the frame's (empty) sky cut off on tall screens; the finished roof starts ~15% down, so stay below that.
  const SKY_TRIM = 0.08;
  const FALLBACK_EDGES = { top: 'rgb(28, 38, 56)', bottom: 'rgb(12, 15, 20)' };

  /* ---------------------------------------------------------------- frames */

  const frameCount = Math.max(1, Number(hero.dataset.frameCount) || 1);
  const lastIndex = frameCount - 1;
  const progressSpan = lastIndex || 1;
  const frameSet = pickFrameSet();
  const frames: (HTMLImageElement | undefined)[] = new Array(frameCount);
  const edgeCache = new Map<HTMLImageElement, { top: string; bottom: string }>();
  const state = { frame: 0 };
  let loadedCount = 0;

  // Phones and small tablets get the 1080w set; anything wider that renders >1100 device px gets 1600w.
  function pickFrameSet() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    return window.innerWidth > 900 && window.innerWidth * dpr > 1100 ? 'lg' : 'sm';
  }

  function frameUrl(i: number) {
    return `/frames/${frameSet}/${String(i + 1).padStart(4, '0')}.webp`;
  }

  // Coarse-to-fine order: early scrubbing gets evenly spread frames before the gaps fill in.
  function loadOrder() {
    const order = [0, lastIndex];
    const seen = new Set(order);
    for (let step = 32; step >= 1; step = Math.floor(step / 2)) {
      for (let i = 0; i < frameCount; i += step) {
        if (!seen.has(i)) { seen.add(i); order.push(i); }
      }
    }
    return order;
  }

  function loadFrame(i: number) {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        const done = () => { frames[i] = img; onFrameLoaded(i); resolve(); };
        img.decode().then(done, done);
      };
      img.onerror = () => { onFrameLoaded(i); resolve(); };
      img.src = frameUrl(i);
    });
  }

  function loadFrames(indices: number[], concurrency = 6) {
    const queue = indices.slice();
    const worker = async () => {
      while (queue.length) await loadFrame(queue.shift()!);
    };
    return Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
  }

  function onFrameLoaded(i: number) {
    loadedCount += 1;
    if (loaderFill) loaderFill.style.transform = `scaleX(${loadedCount / frameCount})`;
    if (loaderPct) loaderPct.textContent = String(Math.round((loadedCount / frameCount) * 100));
    if (loadedCount >= frameCount) loader?.classList.add('is-done');
    if (Math.abs(i - state.frame) <= 1 || !canvas.classList.contains('is-ready')) requestRender();
  }

  function nearestLoaded(i: number) {
    if (frames[i]) return frames[i];
    for (let d = 1; d <= lastIndex; d += 1) {
      if (frames[i - d]) return frames[i - d];
      if (frames[i + d]) return frames[i + d];
    }
    return undefined;
  }

  /* ---------------------------------------------------------------- canvas */

  const sampler = document.createElement('canvas');
  sampler.width = 1;
  sampler.height = 1;
  const samplerCtx = sampler.getContext('2d', { willReadFrequently: true })!;

  // Average colour of the frame's top and bottom bands, used to extend the image on tall screens.
  function edgeColours(img: HTMLImageElement) {
    const cached = edgeCache.get(img);
    if (cached) return cached;
    let colours = FALLBACK_EDGES;
    try {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const band = Math.max(2, Math.round(h * 0.04));
      const read = (sy: number) => {
        samplerCtx.clearRect(0, 0, 1, 1);
        samplerCtx.drawImage(img, 0, sy, w, band, 0, 0, 1, 1);
        const [r, g, b] = samplerCtx.getImageData(0, 0, 1, 1).data;
        return `rgb(${r}, ${g}, ${b})`;
      };
      colours = { top: read(0), bottom: read(h - band) };
    } catch {
      // Tainted canvas — fall back to neutral night tones.
    }
    edgeCache.set(img, colours);
    return colours;
  }

  const withAlpha = (rgb: string, a: number) => rgb.replace('rgb(', 'rgba(').replace(')', `, ${a})`);

  function computeLayout(img: HTMLImageElement) {
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const cover = Math.max(cw / iw, ch / ih);
    let scale = cover;
    if (cw / ch < 1.2) {
      // Narrow viewport: cover would crop the house, so fit the focus area instead.
      scale = Math.min(cover, Math.max(cw / iw, cw / (iw * FOCUS_WIDTH)));
    }
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    let dy: number;
    if (dh >= ch) {
      // Cover crops vertically: take most of it from the ground so the roofline stays in view below the header.
      dy = (ch - dh) * 0.15;
    } else {
      // Tall screens: start the image right under the header (trimming a little empty sky) so there is no
      // dead band above it; the text then sits on the dark ground fill below.
      const headerPx = (document.querySelector('[data-header]')?.getBoundingClientRect().height ?? 0) * (cw / canvas.clientWidth);
      dy = Math.min(headerPx - dh * SKY_TRIM, (ch - dh) * 0.36);
    }
    return { cw, ch, dw, dh, dx, dy, letterbox: dh < ch - 1 };
  }

  function drawFrame(img: HTMLImageElement, alpha: number) {
    const l = computeLayout(img);
    ctx.globalAlpha = alpha;
    if (l.letterbox) {
      const { top, bottom } = edgeColours(img);
      const feather = l.dh * 0.22;
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, l.cw, Math.ceil(l.dy) + 1);
      ctx.fillStyle = bottom;
      ctx.fillRect(0, Math.floor(l.dy + l.dh) - 1, l.cw, l.ch);
      ctx.drawImage(img, l.dx, l.dy, l.dw, l.dh);

      let g = ctx.createLinearGradient(0, l.dy, 0, l.dy + feather);
      g.addColorStop(0, top);
      g.addColorStop(1, withAlpha(top, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, l.dy, l.cw, feather);

      g = ctx.createLinearGradient(0, l.dy + l.dh - feather, 0, l.dy + l.dh);
      g.addColorStop(0, withAlpha(bottom, 0));
      g.addColorStop(1, bottom);
      ctx.fillStyle = g;
      ctx.fillRect(0, l.dy + l.dh - feather, l.cw, feather);
    } else {
      ctx.drawImage(img, l.dx, l.dy, l.dw, l.dh);
    }
    ctx.globalAlpha = 1;
  }

  let renderQueued = false;
  function requestRender() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(render);
  }

  function render() {
    renderQueued = false;
    const f = Math.min(Math.max(state.frame, 0), lastIndex);
    const i = Math.floor(f);
    const t = f - i;
    const base = nearestLoaded(i);
    if (!base) return;
    drawFrame(base, 1);
    if (t > 0.02 && i < lastIndex) {
      const next = nearestLoaded(i + 1);
      if (next && next !== base) drawFrame(next, t);
    }
    canvas.classList.add('is-ready');
  }

  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }
    requestRender();
  }

  /* -------------------------------------------------------------- progress */

  const verticalProgress = window.matchMedia('(min-width: 901px)');
  let activeStep = -1;
  let lastProgress = 0;
  function updateProgress(p: number) {
    lastProgress = p;
    const pct = String(Math.round(p * 100));
    if (progressPct && progressPct.textContent !== pct) progressPct.textContent = pct;
    if (progressFill) progressFill.style.transform = verticalProgress.matches ? `scaleY(${p})` : `scaleX(${p})`;
    let step = 0;
    STAGE_STARTS.forEach((start, idx) => { if (p >= start) step = idx; });
    if (step !== activeStep) {
      activeStep = step;
      steps.forEach((el, idx) => {
        el.classList.toggle('is-active', idx === step);
        el.classList.toggle('is-done', idx < step);
      });
    }
  }

  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(sizeCanvas);
  }, { passive: true });

  /* ---------------------------------------------------------- static mode */

  if (reduceMotion) {
    hero.classList.add('is-static');
    state.frame = lastIndex;
    sizeCanvas();
    loadFrames([lastIndex]).then(() => loader?.classList.add('is-done'));
    return;
  }

  /* -------------------------------------------------------- animated mode */

  sizeCanvas();
  loadFrames(loadOrder());

  const [intro, structure, finish, handover] = chapters;
  const FRAMES_END = 1; // frame scrub runs 0 → 1, then the final chapter holds until 1.12

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: () => `+=${window.innerHeight * 4.4}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // While the hero is pinned the header stays transparent so it never covers the house.
      onToggle: (self) => document.documentElement.classList.toggle('over-hero', self.isActive),
    },
  });

  tl.to(state, {
    frame: lastIndex,
    duration: FRAMES_END,
    onUpdate: () => {
      requestRender();
      updateProgress(state.frame / progressSpan);
    },
  }, 0);
  tl.fromTo(media, { scale: 1.06 }, { scale: 1, duration: FRAMES_END }, 0);

  if (cue) tl.fromTo(cue, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.03, immediateRender: false }, 0.005);
  tl.to(intro, { autoAlpha: 0, y: -60, duration: 0.07, ease: 'power1.in' }, 0.05);

  const chapterSpan = (el: HTMLElement, inAt: number, outAt: number | null) => {
    tl.fromTo(el, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' }, inAt);
    tl.fromTo(el.querySelector('.display'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 -20% 0)', duration: 0.06, ease: 'power2.out' }, inAt);
    if (outAt != null) tl.to(el, { autoAlpha: 0, y: -50, duration: 0.05, ease: 'power1.in' }, outAt);
  };
  chapterSpan(structure, 0.15, 0.30);
  chapterSpan(finish, 0.38, 0.55);
  chapterSpan(handover, 0.84, null);
  tl.to({}, { duration: 0.12 }, FRAMES_END); // hold on the lit house

  // Intro reveal on load.
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from(intro.querySelectorAll('.line__inner'), { yPercent: 110, duration: 1.4, stagger: 0.1 }, 0.15)
    .from(intro.querySelectorAll('.eyebrow, .lede, .cta-row'), { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.08 }, 0.45)
    .from('[data-header]', { autoAlpha: 0, y: -16, duration: 1.2, clearProps: 'transform,opacity,visibility' }, 0.3)
    .from([cue, hero.querySelector('[data-progress]')].filter(Boolean), { autoAlpha: 0, duration: 1 }, 0.9);

  updateProgress(0);
  verticalProgress.addEventListener('change', () => updateProgress(lastProgress));
}
