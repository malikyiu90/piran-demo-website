import type { CategoryId } from './services';

export interface Project {
  src: string;
  alt: string;
  category: CategoryId;
  /** True for stand-in images that are not Piran's own work. The gallery never ships to production while any remain. */
  placeholder: boolean;
}

// ⚠ Stand-in images (old-site service photos) so the gallery design can be reviewed locally.
// Replace with photos of real Piran projects and set `placeholder: false` to publish the gallery.
export const projects: Project[] = [
  { src: '/services/kitchens-lg.webp', alt: 'Kitchen renovation', category: 'kitchens-bathrooms', placeholder: true },
  { src: '/services/loft-conversions-lg.webp', alt: 'Loft conversion', category: 'extensions', placeholder: true },
  { src: '/services/bathrooms-lg.webp', alt: 'Bathroom renovation', category: 'kitchens-bathrooms', placeholder: true },
  { src: '/services/landscaping-lg.webp', alt: 'Landscaped garden', category: 'exterior', placeholder: true },
  { src: '/services/brickwork-lg.webp', alt: 'Brickwork', category: 'exterior', placeholder: true },
  { src: '/services/tiling-and-flooring-lg.webp', alt: 'Tiling and flooring', category: 'interiors', placeholder: true },
  { src: '/services/driveways-and-paving-lg.webp', alt: 'Block paved driveway', category: 'exterior', placeholder: true },
  { src: '/services/roofing-and-fascias-lg.webp', alt: 'Roofing', category: 'exterior', placeholder: true },
];

export const galleryIsPublishable = projects.length > 0 && projects.every((p) => !p.placeholder);
