import { photosFor, services, type CategoryId } from './services';

export interface Project {
  src: string;
  alt: string;
  category: CategoryId;
  href?: string;
  /** True for stand-in images that are not Piran’s own work. The gallery heading reflects how many are real. */
  placeholder: boolean;
}

// Stock photos (Pexels, Unsplash and Pixabay; see content/stock/pixabay.txt) stand in until the client supplies photos of real Piran projects. Add real
// project photos with `placeholder: false`; the heading then changes from "Ideas for your project" to
// "Ideas and our recent work" (some real) and "Our recent work" (all real).
// Eleven tiles fill the grid exactly: one large tile plus ten small ones over four rows.
// Each pick is [service, photo index]; the first is the large tile, so it gets the strongest photo.
const PICKS: [string, number][] = [
  ['kitchen-renovation', 3],
  ['loft-extension', 1],
  ['bathrooms', 1],
  ['landscaping', 1],
  ['double-storey-extensions', 1],
  ['tiling', 1],
  ['driveways', 2],
  ['window-work', 1],
  ['plastering', 1],
  ['kitchen-refits', 1],
  ['block-paving', 1],
];

export const projects: Project[] = PICKS.flatMap(([slug, index]) => {
  const service = services.find((s) => s.slug === slug);
  const photo = service && (photosFor(service)[index] ?? photosFor(service)[0]);
  return service && photo
    ? [{ src: photo.src, alt: service.name, category: service.category, href: `/services/${service.slug}`, placeholder: true }]
    : [];
});

const realCount = projects.filter((p) => !p.placeholder).length;

/** 'none' while every photo is a stand-in, 'some' once real work is mixed in, 'all' when every photo is real. */
export const realWork: 'none' | 'some' | 'all' = realCount === 0 ? 'none' : realCount === projects.length ? 'all' : 'some';
