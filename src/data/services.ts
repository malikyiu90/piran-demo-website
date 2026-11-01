// Service catalogue. The old site listed 22 overlapping pages; they are consolidated here and
// every old slug redirects to its new home (see `legacySlugs` and `legacyRedirects`).

export type CategoryId = 'extensions' | 'kitchens-bathrooms' | 'interiors' | 'exterior';

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  /** Frame from the hero sequence used as atmospheric imagery for this category. */
  image: string;
}

export interface Service {
  slug: string;
  name: string;
  category: CategoryId;
  summary: string;
  intro: string[];
  includes: string[];
  faqs: { q: string; a: string }[];
  legacySlugs: string[];
  /** Guarantee as stated in the client's terms. Defaults to the 12-month workmanship guarantee; null = not covered. */
  guarantee?: string | null;
}

export const DEFAULT_GUARANTEE = '12-month workmanship guarantee';

export function guaranteeFor(service: Service): string | null {
  return service.guarantee === undefined ? DEFAULT_GUARANTEE : service.guarantee;
}

export const categories: Category[] = [
  {
    id: 'extensions',
    name: 'Extensions & lofts',
    blurb: 'More room without moving house, from single-storey additions to full loft conversions.',
    image: '/frames/lg/0030.webp',
  },
  {
    id: 'kitchens-bathrooms',
    name: 'Kitchens & bathrooms',
    blurb: 'The two rooms that work hardest, refitted or rebuilt around the way you live.',
    image: '/frames/lg/0095.webp',
  },
  {
    id: 'interiors',
    name: 'Interiors',
    blurb: 'Plaster, tiles, paint, wiring and pipework: the trades that make a space finished.',
    image: '/frames/lg/0052.webp',
  },
  {
    id: 'exterior',
    name: 'Exterior',
    blurb: 'Roofs, windows, brick, driveways and gardens that protect the house and lift the street view.',
    image: '/frames/lg/0080.webp',
  },
];

export const services: Service[] = [
  {
    slug: 'extensions',
    name: 'Extensions',
    category: 'extensions',
    summary: 'Single and double-storey extensions that add space and value to your home.',
    intro: [
      'An extension is the most direct way to gain the space you need, whether that is a bigger kitchen, an extra bedroom or a ground floor that finally works as one room.',
      'We look after the build from groundwork to finishing trades, so you deal with one team from the first call to handover.',
    ],
    includes: [
      'Single-storey rear and side extensions',
      'Double-storey extensions',
      'Groundworks and foundations',
      'Structural openings and knock-throughs',
      'Roofing, glazing and insulation',
      'Plastering, electrics, plumbing and decoration',
    ],
    faqs: [
      {
        q: 'Do I need planning permission?',
        a: 'It depends on the size of the extension and your property. Under our terms, arranging planning permission and building control is the customer’s responsibility, and we may ask to see the approval before work starts. We are happy to talk it through on the first call so you know where you stand.',
      },
      {
        q: 'Can we stay in the house while you build?',
        a: 'In most cases, yes. We plan the work to keep disruption down and agree access, working hours and any days the main living areas are affected before we start.',
      },
    ],
    legacySlugs: ['double-story-extensions', 'extension-and-loft-2'],
  },
  {
    slug: 'loft-conversions',
    name: 'Loft conversions',
    category: 'extensions',
    summary: 'Turn an unused loft into a bedroom, office or suite with natural light.',
    intro: [
      'A loft conversion uses space you already own. Done well, it adds a bedroom, an office or a quiet suite without giving up any of the garden.',
      'We handle the structure, insulation, staircase, windows and finishing so the new room feels like it was always part of the house.',
    ],
    includes: [
      'Dormer and roof-light conversions',
      'Floor strengthening and structural work',
      'Staircase design and fitting',
      'Insulation, windows and roof lights',
      'En-suite bathrooms',
      'Electrics, plastering and decoration',
    ],
    faqs: [
      {
        q: 'Is my loft suitable for a conversion?',
        a: 'Head height, roof structure and stair position all matter. We assess these on the first visit and tell you plainly what is possible.',
      },
      {
        q: 'Will a loft conversion add value?',
        a: 'An extra bedroom often makes a home more attractive to buyers, but values vary by area. We focus on building a room you will use and that is finished to a high standard.',
      },
    ],
    legacySlugs: ['loft-extension'],
  },
  {
    slug: 'kitchens',
    name: 'Kitchens',
    category: 'kitchens-bathrooms',
    summary: 'Kitchen renovations and refits, from new units to full open-plan rebuilds.',
    intro: [
      'Whether you want new units in the existing layout or a full open-plan rebuild, we plan the kitchen around how you cook, eat and gather.',
      'Our team covers the stripping out, plumbing, electrics, plastering, tiling, flooring and fitting, so the trades arrive in the right order.',
    ],
    includes: [
      'Full kitchen renovations',
      'Kitchen refits in an existing layout',
      'Knock-throughs to open-plan',
      'Plumbing and electrics',
      'Tiling, flooring and splashbacks',
      'Plastering and decoration',
    ],
    faqs: [
      {
        q: 'Can you fit a kitchen I have bought myself?',
        a: 'Yes. Tell us on the call where the units are from and we will include fitting and all the supporting trades in the quotation.',
      },
      {
        q: 'How long will we be without a kitchen?',
        a: 'It depends on the scope. We give you a schedule with the quotation and keep you updated as the work progresses.',
      },
    ],
    legacySlugs: ['kitchen-renovation', 'kitchen-refits-2'],
  },
  {
    slug: 'bathrooms',
    name: 'Bathrooms',
    category: 'kitchens-bathrooms',
    summary: 'Bathroom and en-suite renovations that are functional, stylish and easy to keep.',
    intro: [
      'A bathroom has to work every single day. We design and build bathrooms and en-suites that are practical to use, simple to clean and good to look at.',
      'From stripping out the old suite to the final bead of silicone, the plumbing, electrics, waterproofing and tiling are all handled by our team.',
    ],
    includes: [
      'Full bathroom renovations',
      'En-suites and cloakrooms',
      'Walk-in showers and wet rooms',
      'Plumbing and electrics',
      'Waterproofing, tiling and flooring',
      'Fitting of sanitaryware and furniture',
    ],
    faqs: [
      {
        q: 'Can you work around a tight budget?',
        a: 'Yes. Tell us what matters most and we will suggest where to spend and where to save, then put it in a clear quotation.',
      },
      {
        q: 'Do you supply the bathroom suite?',
        a: 'We can supply it or fit the one you choose. Either way, it is set out clearly in the quotation.',
      },
    ],
    legacySlugs: ['bathroom'],
  },
  {
    slug: 'plastering',
    name: 'Plastering',
    category: 'interiors',
    summary: 'Smooth, durable walls and ceilings, ready for paint.',
    intro: [
      'Good plastering is the difference between walls that look finished and walls that show every flaw once they are painted.',
      'We skim, re-plaster and repair walls and ceilings in single rooms or whole houses, and leave them clean and ready to decorate.',
    ],
    includes: [
      'Skimming over existing walls and ceilings',
      'Full re-plastering',
      'Plasterboarding and dry lining',
      'Patch repairs and crack repairs',
      'Coving and finishing details',
    ],
    faqs: [
      {
        q: 'How soon can I paint new plaster?',
        a: 'Plastering carries a 6-month guarantee to allow for settling, and we strongly recommend waiting through that period before decorating. We will talk you through it for your rooms.',
      },
      {
        q: 'Do you plaster single rooms?',
        a: 'Yes. Single rooms, ceilings and repairs are all welcome.',
      },
    ],
    legacySlugs: ['plastering'],
    guarantee: '6-month plastering guarantee',
  },
  {
    slug: 'rendering',
    name: 'Rendering',
    category: 'exterior',
    summary: 'External render that protects your walls and refreshes the look of your home.',
    intro: [
      'Render protects external walls from the weather and can transform how a house looks from the street.',
      'We prepare the surface properly, apply the render system you choose and finish the details around windows, doors and edges.',
    ],
    includes: [
      'Surface preparation and repairs',
      'New render and re-rendering',
      'Beads, edges and detailing',
      'Finishing and painting',
    ],
    faqs: [
      {
        q: 'Which render should I choose?',
        a: 'It depends on the wall, the look you want and your budget. We explain the options on the call and recommend one in the quotation.',
      },
      {
        q: 'Can you render over old render?',
        a: 'Sometimes. We check the condition of the existing render first and tell you whether it needs to come off.',
      },
    ],
    legacySlugs: ['rendering-2'],
  },
  {
    slug: 'decorating',
    name: 'Decorating',
    category: 'interiors',
    summary: 'Interior and exterior painting and decorating with careful preparation.',
    intro: [
      'A sharp finish comes from preparation: filling, sanding, priming and protecting everything that should not be painted.',
      'We decorate single rooms, whole houses and exteriors, and leave the space clean and tidy at the end of each day.',
    ],
    includes: [
      'Interior painting',
      'Exterior painting',
      'Woodwork, doors and skirting',
      'Wallpapering',
      'Preparation, filling and repairs',
    ],
    faqs: [
      {
        q: 'Do you move furniture?',
        a: 'We protect and move furniture within the room as part of the job. Tell us about anything fragile or valuable before we start.',
      },
      {
        q: 'Can you match existing colours?',
        a: 'Yes, as long as we can identify the existing paint or take a sample to match.',
      },
    ],
    legacySlugs: ['decorating-3'],
    // Terms: decorations are signed off on completion and not covered by the guarantee.
    guarantee: null,
  },
  {
    slug: 'tiling-and-flooring',
    name: 'Tiling & flooring',
    category: 'interiors',
    summary: 'Precise tiling for walls and floors, plus flooring that lasts.',
    intro: [
      'Tiling and flooring are judged on the details: level surfaces, straight lines and clean cuts around every corner.',
      'We tile kitchens, bathrooms and living spaces and lay flooring throughout the house, with the preparation done properly underneath.',
    ],
    includes: [
      'Wall and floor tiling',
      'Kitchen splashbacks',
      'Bathroom and wet-room tiling',
      'Floor levelling and preparation',
      'Laminate, vinyl and engineered flooring',
    ],
    faqs: [
      {
        q: 'Can you tile over existing tiles?',
        a: 'Occasionally, but it usually gives a poorer result. We check the existing surface and recommend the right approach.',
      },
      {
        q: 'Do you supply tiles?',
        a: 'We can supply them or fit tiles you have chosen. It will be clear in the quotation.',
      },
    ],
    legacySlugs: ['tiling', 'tile-flooring-2'],
  },
  {
    slug: 'electrical',
    name: 'Electrical work',
    category: 'interiors',
    summary: 'Electrical installations, upgrades and rewiring as part of your project.',
    intro: [
      'Most renovations need electrical work, from extra sockets and new lighting to circuits for a new kitchen or extension.',
      'We plan the electrics with the rest of the build, so cables and fittings go in at the right stage and walls are only opened once.',
    ],
    includes: [
      'New circuits for extensions and kitchens',
      'Sockets, switches and lighting',
      'Rewiring',
      'Outdoor lighting and power',
    ],
    faqs: [
      {
        q: 'Can you add lighting to an existing room?',
        a: 'Yes. Tell us what you have in mind and we will include it in the quotation.',
      },
      {
        q: 'Do you only do electrics as part of a bigger job?',
        a: 'Electrical work is often part of a wider project, but get in touch about standalone jobs too.',
      },
    ],
    legacySlugs: ['electric-2'],
  },
  {
    slug: 'plumbing',
    name: 'Plumbing',
    category: 'interiors',
    summary: 'Plumbing for kitchens, bathrooms, extensions and repairs.',
    intro: [
      'Plumbing sits behind the walls and under the floors, so it needs to be right first time.',
      'We install and reroute pipework for new kitchens, bathrooms and extensions, and fit everything from sinks to showers.',
    ],
    includes: [
      'Kitchen and bathroom plumbing',
      'Pipework rerouting',
      'Fitting sinks, showers, baths and toilets',
      'Plumbing for extensions',
    ],
    faqs: [
      {
        q: 'Can you move my kitchen sink or bathroom?',
        a: 'Often, yes. Waste routes and floor construction decide what is practical, and we check those before quoting.',
      },
      {
        q: 'Do you take on small plumbing jobs?',
        a: 'Get in touch and tell us what you need. We will let you know straight away if it is something we can help with.',
      },
    ],
    legacySlugs: ['plumbing-2'],
  },
  {
    slug: 'roofing-and-fascias',
    name: 'Roofing & fascias',
    category: 'exterior',
    summary: 'Roof repairs, replacements, fascias, soffits and guttering.',
    intro: [
      'A sound roof protects everything underneath it. Small problems caught early cost far less than leaks left to spread.',
      'We repair and replace roofs and renew fascias, soffits and guttering to keep the house watertight and looking sharp.',
    ],
    includes: [
      'Roof repairs',
      'Re-roofing',
      'Flat roofs',
      'Fascias and soffits',
      'Guttering and downpipes',
    ],
    faqs: [
      {
        q: 'Can you look at a leak?',
        a: 'Yes. Describe the problem when you get in touch and we will arrange to take a look.',
      },
      {
        q: 'Repair or replace?',
        a: 'We tell you honestly. If a repair will do the job, we will say so.',
      },
    ],
    legacySlugs: ['roof-work', 'roofing-facias-2'],
  },
  {
    slug: 'windows-and-glazing',
    name: 'Windows & glazing',
    category: 'exterior',
    summary: 'Window installation, replacement and double glazing for homes and commercial properties.',
    intro: [
      'Windows affect comfort, security, energy bills and how a house looks. Replacing tired windows can change all four at once.',
      'We install and repair windows and double glazing for residential and commercial properties, and finish the reveals and sills properly.',
    ],
    includes: [
      'Window replacement',
      'Double glazing',
      'Window repairs',
      'Reveals, sills and finishing',
      'Residential and commercial properties',
    ],
    faqs: [
      {
        q: 'Do you fit windows in extensions?',
        a: 'Yes. Glazing is planned as part of every extension and loft conversion we build.',
      },
      {
        q: 'Do you work on commercial properties?',
        a: 'Yes, window work covers both residential and commercial properties.',
      },
    ],
    legacySlugs: ['window-work', 'double-glazing-2'],
  },
  {
    slug: 'brickwork',
    name: 'Brickwork',
    category: 'exterior',
    summary: 'New brickwork, walls, repairs and repointing.',
    intro: [
      'Good brickwork is structural and visible, so it has to be strong and look right alongside the existing house.',
      'We build new walls, extensions and garden walls, and repair and repoint existing brickwork.',
    ],
    includes: [
      'Extension brickwork',
      'Garden and boundary walls',
      'Brick repairs',
      'Repointing',
    ],
    faqs: [
      {
        q: 'Can you match my existing bricks?',
        a: 'We source the closest available match and agree it with you before building.',
      },
      {
        q: 'Do you build garden walls?',
        a: 'Yes, garden and boundary walls are part of our brickwork service.',
      },
    ],
    legacySlugs: ['brick-work'],
  },
  {
    slug: 'driveways-and-paving',
    name: 'Driveways & paving',
    category: 'exterior',
    summary: 'Driveways, block paving and paths built on a proper base.',
    intro: [
      'A driveway is only as good as what is underneath it. We dig out, build a proper sub-base and plan drainage before the surface goes down.',
      'From block paving to new paths and patios, we create safe, attractive access to your property.',
    ],
    includes: [
      'New driveways',
      'Block paving',
      'Paths and patios',
      'Edging and drainage',
    ],
    faqs: [
      {
        q: 'Which driveway surface is best?',
        a: 'It depends on budget, look and use. We explain the options and recommend one in the quotation.',
      },
      {
        q: 'Can you extend an existing driveway?',
        a: 'Often, yes. We check levels and drainage before quoting.',
      },
    ],
    legacySlugs: ['driveway', 'block-paving-2'],
  },
  {
    slug: 'fencing',
    name: 'Fencing',
    category: 'exterior',
    summary: 'New fences, gates and replacement panels.',
    intro: [
      'A good fence gives privacy and security and frames the garden.',
      'We install new fencing and gates and replace damaged panels and posts.',
    ],
    includes: [
      'Panel and close-board fencing',
      'Gates',
      'Post and panel replacement',
    ],
    faqs: [
      {
        q: 'Can you replace just a few panels?',
        a: 'Yes. Tell us how many and we will quote for it.',
      },
      {
        q: 'Do you remove the old fence?',
        a: 'Yes, removal and disposal can be included in the quotation.',
      },
    ],
    legacySlugs: ['fencing-2'],
  },
  {
    slug: 'landscaping',
    name: 'Landscaping',
    category: 'exterior',
    summary: 'Gardens, lawns and hard landscaping designed to be enjoyed.',
    intro: [
      'Landscaping turns outside space into somewhere you want to be, whether that is a lawn for the children or a patio for long evenings.',
      'We design and build gardens, lawns and hard landscaping that improve curb appeal and suit how you use the space.',
    ],
    includes: [
      'Garden design and build',
      'Lawns and planting',
      'Patios and paths',
      'Garden walls and edging',
      'Outdoor lighting',
    ],
    faqs: [
      {
        q: 'Can you work with an existing garden design?',
        a: 'Yes. Share the plans and we will quote for building them.',
      },
      {
        q: 'Do you do front gardens too?',
        a: 'Yes, front and back gardens.',
      },
    ],
    legacySlugs: ['landscaping'],
  },
];

export function servicesIn(category: CategoryId): Service[] {
  return services.filter((s) => s.category === category);
}

export function categoryOf(service: Service): Category {
  const category = categories.find((c) => c.id === service.category);
  if (!category) throw new Error(`Unknown category for service ${service.slug}`);
  return category;
}

export const serviceSlugs = services.map((s) => s.slug);

// Photos come from the client's previous website (public/services/<slug>-sm|lg.webp).
// Only sources at least 1200px wide get a large version used as the service page backdrop;
// the rest were 600px thumbnails and fall back to the category image there.
const LARGE_PHOTOS = new Set([
  'bathrooms', 'brickwork', 'driveways-and-paving', 'fencing', 'kitchens',
  'landscaping', 'loft-conversions', 'roofing-and-fascias', 'tiling-and-flooring', 'windows-and-glazing',
]);

export function photoFor(service: Service): { thumb: string; hero: string | null } {
  return {
    thumb: `/services/${service.slug}-sm.webp`,
    hero: LARGE_PHOTOS.has(service.slug) ? `/services/${service.slug}-lg.webp` : null,
  };
}

/** Shown on the home page; the old home page featured a similar set. */
export const featuredSlugs = [
  'extensions', 'loft-conversions', 'kitchens', 'bathrooms',
  'plastering', 'tiling-and-flooring', 'roofing-and-fascias', 'landscaping',
];

export function featuredServices(): Service[] {
  return featuredSlugs.map((slug) => {
    const service = services.find((s) => s.slug === slug);
    if (!service) throw new Error(`Featured service ${slug} does not exist`);
    return service;
  });
}

/** `/our-services/<old-slug>` → `/services/<new-slug>` for every consolidated page. */
export function legacyRedirects(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const service of services) {
    for (const old of service.legacySlugs) map[`/our-services/${old}`] = `/services/${service.slug}`;
  }
  return map;
}
