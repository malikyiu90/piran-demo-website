import projectPhotos from './projectPhotos.json';
import { photosFor, serviceUrl, services, type CategoryId, type Service } from './services';

interface PhotoEntry { name: string; alt: string; category: CategoryId; href: string; town?: string; w: number; h: number; smW: number }

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

// Real Piran projects, listed in src/data/projectPhotos.json with each photo's real size. Photos live at
// public/gallery/project-<name>.webp (up to 2000px) with a 960px copy in public/gallery/sm/. Add `town` to an entry
// when it is known and the tile reads "Kitchen renovation · Nuneaton". Only photos of work Piran did belong here.
// Real projects come first; once there are any, the heading becomes "Our Completed Projects".
//
// From the client's own Facebook page (facebook.com/3piran), November 2026. Towns were not given, so none are shown.
const completed: Project[] = (projectPhotos as PhotoEntry[]).map((p) => ({
  src: `/gallery/project-${p.name}.webp`,
  srcset: `/gallery/sm/project-${p.name}.webp ${p.smW}w, /gallery/project-${p.name}.webp ${p.w}w`,
  alt: p.alt,
  category: p.category,
  town: p.town,
  href: p.href,
  placeholder: false,
}));

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

/** Tiles on the home page; the /gallery page shows every project. Eleven fill the grid: one large and ten small. */
export const HOME_TILES = 11;
export const projects: Project[] = [...completed, ...stock].slice(0, Math.max(HOME_TILES, completed.length));

/** Real project photos for a service page, matched by the service the project links to. */
export const realPhotosFor = (service: Service) => completed.filter((p) => p.href === serviceUrl(service));

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
