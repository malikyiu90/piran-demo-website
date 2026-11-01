import { photosFor, services, type CategoryId } from './services';

export interface Project {
  src: string;
  alt: string;
  category: CategoryId;
  href?: string;
  /** True for stand-in images that are not Piran’s own work. While any remain, the gallery is titled as ideas, not projects. */
  placeholder: boolean;
}

// Stock photos (Pixabay) stand in until the client supplies photos of real Piran projects.
// Replace with real project photos and set `placeholder: false` to retitle the section "Recent projects".
// Eleven tiles fill the grid exactly: one large tile plus ten small ones over four rows.
const GALLERY_SERVICES = [
  'kitchen-renovation', 'loft-extension', 'bathrooms', 'landscaping',
  'double-storey-extensions', 'tiling', 'driveways', 'window-work',
  'plastering', 'kitchen-refits', 'block-paving',
];

export const projects: Project[] = GALLERY_SERVICES.flatMap((slug) => {
  const service = services.find((s) => s.slug === slug);
  // The second photo, so the gallery doesn't repeat the services-list thumbnail.
  const photo = service && (photosFor(service)[1] ?? photosFor(service)[0]);
  return service && photo
    ? [{ src: photo.src, alt: service.name, category: service.category, href: `/services/${service.slug}`, placeholder: true }]
    : [];
});

export const galleryIsPublishable = projects.length > 0 && projects.every((p) => !p.placeholder);
