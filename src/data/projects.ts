import { photosFor, serviceUrl, services, type CategoryId } from './services';

export interface Project {
  src: string;
  /** Project type, shown on the tile, e.g. "Kitchen renovation". */
  alt: string;
  category: CategoryId;
  /** Town the work was done in, shown after the project type. Real projects only. */
  town?: string;
  href?: string;
  /** Image candidates with their real widths, when they differ from the stock 960w / 2560w pair. */
  srcset?: string;
  /** True for stand-in images that are not Piran’s own work. The gallery heading reflects how many are real. */
  placeholder: boolean;
}

// Real Piran projects. Save the photo as public/gallery/project-<name>.webp (up to 2000px) plus a 960px copy in
// public/gallery/sm/, and add it here; add `town` when it is known and the tile reads "Kitchen renovation · Nuneaton".
// Only photos of work Piran did belong here. Real projects come first; once there are any, the heading becomes
// "Our Completed Projects".
//
// From the client's own Facebook page (facebook.com/3piran), November 2026. Towns were not given, so none are shown.
// Facebook serves 2000x924 landscape or 924x2000 portrait photos; the 960px copies are 960 or 444 wide to match.
const real = (name: string, alt: string, category: CategoryId, href: string, portrait = false): Project => ({
  src: `/gallery/project-${name}.webp`,
  srcset: `/gallery/sm/project-${name}.webp ${portrait ? 444 : 960}w, /gallery/project-${name}.webp ${portrait ? 924 : 2000}w`,
  alt, category, href, placeholder: false,
});
const completed: Project[] = [
  real('open-plan-kitchen-1', 'Open-plan kitchen', 'kitchens-bathrooms', '/services/kitchen-renovation'),
  real('flat-roof-1', 'Flat roof', 'exterior', '/services/roof-work'),
  real('downstairs-wc-1', 'Downstairs WC', 'kitchens-bathrooms', '/services/bathrooms', true),
  real('hallway-stairs-1', 'Hallway & staircase', 'interiors', '/services/decorating', true),
  real('open-plan-kitchen-2', 'Open-plan kitchen', 'kitchens-bathrooms', '/services/kitchen-renovation', true),
  real('flat-roof-2', 'Flat roof', 'exterior', '/services/roof-work'),
  real('stairs-flooring-1', 'Stair flooring', 'interiors', '/services/tile-and-flooring', true),
  real('open-plan-kitchen-3', 'Open-plan kitchen', 'kitchens-bathrooms', '/services/kitchen-renovation'),
  real('downstairs-wc-2', 'Downstairs WC', 'kitchens-bathrooms', '/services/bathrooms', true),
  real('flat-roof-3', 'Flat roof', 'exterior', '/services/roof-work', true),
  real('open-plan-kitchen-4', 'Open-plan kitchen', 'kitchens-bathrooms', '/services/kitchen-renovation', true),
];

// Stock photos (Pexels, Unsplash and Pixabay; see content/stock/pixabay.txt) fill the gallery until there are
// enough real projects. They carry no town, because they are not Piran's work.
// Eleven tiles fill the grid exactly: one large tile plus ten small ones over four rows.
// Each pick is [service, photo index]; the first is the large tile, so it gets the strongest photo.
const PICKS: [string, number][] = [
  ['kitchen-renovation', 3],
  ['loft-extension', 1],
  ['bathrooms', 1],
  ['hmo-renovations', 0],
  ['landscaping', 1],
  ['double-storey-extensions', 1],
  ['tiling', 1],
  ['driveways', 2],
  ['window-work', 1],
  ['plastering', 1],
  ['kitchen-refits', 1],
];

const stock: Project[] = PICKS.flatMap(([slug, index]) => {
  const service = services.find((s) => s.slug === slug);
  const photo = service && (photosFor(service)[index] ?? photosFor(service)[0]);
  return service && photo
    ? [{ src: photo.src, alt: service.name, category: service.category, href: serviceUrl(service), placeholder: true }]
    : [];
});

const GRID = 11;
export const projects: Project[] = [...completed, ...stock].slice(0, Math.max(GRID, completed.length));

const realCount = projects.filter((p) => !p.placeholder).length;

/** 'none' while every photo is a stand-in, 'some' once real work is mixed in, 'all' when every photo is real. */
export const realWork: 'none' | 'some' | 'all' = realCount === 0 ? 'none' : realCount === projects.length ? 'all' : 'some';

// Gallery wording: it only says "completed projects" for as much of the gallery as really is Piran's work.
export const galleryCopy = {
  none: { eyebrow: 'Gallery', title: 'Ideas for your project.', lede: 'A few ideas to get you started. Ask us for photos of our recent work in your area.' },
  some: { eyebrow: 'Our work', title: 'Our Completed Projects.', lede: 'Recent work by our team, alongside a few ideas to get you started.' },
  all: { eyebrow: 'Our work', title: 'Our Completed Projects.', lede: 'Recent work by our team: kitchens, bathrooms, interiors and roofs, finished properly.' },
}[realWork];

/** Tile caption: project type, plus the town for real projects. */
export const projectLabel = (p: Project) => (p.town ? `${p.alt} · ${p.town}` : p.alt);
