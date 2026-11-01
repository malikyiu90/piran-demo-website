// Service catalogue: one page per service offered on the client's previous website (22 in total).
// Each old WordPress URL redirects to its page here (see `legacySlugs` and `legacyRedirects`).
// Summaries marked "client" are the client's own wording from the old home page.
import servicePhotos from './servicePhotos.json';

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

export interface Photo {
  src: string;
  /** Page of the stock photo (Pixabay Content License). */
  source: string;
}

export const DEFAULT_GUARANTEE = '12-month workmanship guarantee';

export function guaranteeFor(service: Service): string | null {
  return service.guarantee === undefined ? DEFAULT_GUARANTEE : service.guarantee;
}

export const categories: Category[] = [
  {
    id: 'extensions',
    name: 'Extensions & lofts',
    blurb: 'More room without moving house, from extensions to full loft conversions.',
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
    blurb: 'Plaster, tiles, floors, paint, wiring and pipework: the trades that make a space finished.',
    image: '/frames/lg/0052.webp',
  },
  {
    id: 'exterior',
    name: 'Exterior',
    blurb: 'Roofs, windows, render, brick, driveways and gardens that protect the house and lift the street view.',
    image: '/frames/lg/0080.webp',
  },
];

const PLANNING_FAQ = {
  q: 'Do I need planning permission?',
  a: 'It depends on the size of the work and your property. Under our terms, arranging planning permission and building control is the customer’s responsibility, and we may ask to see the approval before work starts. We are happy to talk it through on the first call.',
};

export const services: Service[] = [
  // ---------------------------------------------------------------- Extensions & lofts
  {
    slug: 'double-storey-extensions',
    name: 'Double-storey extensions',
    category: 'extensions',
    summary: 'Two floors of new space, from groundworks and foundations to the finished rooms.',
    intro: [
      'A double-storey extension adds space on both floors at once, often a bigger kitchen below and an extra bedroom or bathroom above.',
      'We look after the build from groundworks to finishing trades, so you deal with one team from the first call to handover.',
    ],
    includes: [
      'Groundworks and foundations',
      'Brickwork and structural openings',
      'Roofing, windows and insulation',
      'Electrics and plumbing',
      'Plastering, flooring and decoration',
    ],
    faqs: [
      PLANNING_FAQ,
      {
        q: 'Can we stay in the house while you build?',
        a: 'In most cases, yes. We agree access, working hours and any days the main living areas are affected before we start.',
      },
    ],
    legacySlugs: ['double-story-extensions'],
  },
  {
    slug: 'extension-and-loft',
    name: 'Extension and loft',
    category: 'extensions',
    summary: 'An extension and a loft conversion planned and built together as one project.',
    intro: [
      'Combining an extension with a loft conversion is one of the biggest ways to transform a home, adding space on the ground floor and in the roof.',
      'Planning both as one project means the structure, trades and schedule are coordinated from the start.',
    ],
    includes: [
      'Single and double-storey extensions',
      'Loft conversions with dormers or roof lights',
      'Structural work and staircases',
      'Electrics, plumbing and insulation',
      'Plastering and decoration throughout',
    ],
    faqs: [
      PLANNING_FAQ,
      {
        q: 'Is it cheaper to do both at once?',
        a: 'Doing both together can save on access, scaffolding and repeated trades. We set out the costs clearly in the written quotation.',
      },
    ],
    legacySlugs: ['extension-and-loft-2'],
  },
  {
    slug: 'loft-extension',
    name: 'Loft extensions',
    category: 'extensions',
    // client
    summary: 'Creative expansion of living space by converting underutilised attic areas into functional rooms, adding value and versatility to homes.',
    intro: [
      'A loft conversion uses space you already own. Done well, it adds a bedroom, an office or a quiet suite without giving up any of the garden.',
      'We handle the structure, insulation, staircase, windows and finishing so the new room feels like it was always part of the house.',
    ],
    includes: [
      'Dormer and roof-light conversions',
      'Floor strengthening and structural work',
      'Staircase fitting',
      'Insulation, windows and roof lights',
      'En-suites, electrics, plastering and decoration',
    ],
    faqs: [
      {
        q: 'Is my loft suitable for a conversion?',
        a: 'Head height, roof structure and stair position all matter. We assess these on the first visit and tell you plainly what is possible.',
      },
      PLANNING_FAQ,
    ],
    legacySlugs: ['loft-extension'],
  },

  // ---------------------------------------------------------------- Kitchens & bathrooms
  {
    slug: 'kitchen-renovation',
    name: 'Kitchen renovation',
    category: 'kitchens-bathrooms',
    // client
    summary: 'Complete overhaul or enhancement of kitchen spaces, incorporating modern design, functionality and efficiency for enjoyable cooking and dining.',
    intro: [
      'A full kitchen renovation lets you rethink the whole room: layout, lighting, storage and how the space connects to the rest of the house.',
      'Our team covers the stripping out, plumbing, electrics, plastering, tiling, flooring and fitting, so the trades arrive in the right order.',
    ],
    includes: [
      'Full kitchen renovations',
      'Knock-throughs to open-plan',
      'Plumbing and electrics',
      'Tiling, flooring and splashbacks',
      'Plastering and decoration',
    ],
    faqs: [
      {
        q: 'How long will we be without a kitchen?',
        a: 'It depends on the scope. We give you a schedule with the quotation and keep you updated as the work progresses.',
      },
      {
        q: 'Can you fit a kitchen I have bought myself?',
        a: 'Yes. Tell us where the units are from and we will include fitting and all the supporting trades in the quotation.',
      },
    ],
    legacySlugs: ['kitchen-renovation'],
  },
  {
    slug: 'kitchen-refits',
    name: 'Kitchen refits',
    category: 'kitchens-bathrooms',
    summary: 'New units, worktops and appliances fitted into your existing kitchen layout.',
    intro: [
      'If the layout already works, a refit gives you a new kitchen without moving walls or pipework.',
      'We remove the old kitchen, make good the walls and floor, and fit the new units, worktops, appliances and splashbacks.',
    ],
    includes: [
      'Removal of the old kitchen',
      'Fitting units, worktops and appliances',
      'Sinks, taps and connections',
      'Splashbacks and tiling',
      'Making good and decoration',
    ],
    faqs: [
      {
        q: 'Refit or full renovation?',
        a: 'If you are happy with the layout, a refit is usually quicker. If you want to move things around or open up the room, a renovation is the better fit.',
      },
      {
        q: 'Can you fit a kitchen I have bought myself?',
        a: 'Yes. Tell us where the units are from and we will include fitting in the quotation.',
      },
    ],
    legacySlugs: ['kitchen-refits-2'],
  },
  {
    slug: 'bathrooms',
    name: 'Bathrooms',
    category: 'kitchens-bathrooms',
    // client
    summary: 'Comprehensive renovation services to transform bathrooms into functional, stylish and relaxing spaces, tailored to individual needs and preferences.',
    intro: [
      'A bathroom has to work every single day. We design and build bathrooms and en-suites that are practical to use, simple to clean and good to look at.',
      'From stripping out the old suite to the final bead of silicone, the plumbing, electrics, waterproofing and tiling are handled by our team.',
    ],
    includes: [
      'Full bathroom renovations',
      'En-suites and cloakrooms',
      'Walk-in showers and wet rooms',
      'Waterproofing, tiling and flooring',
      'Fitting sanitaryware and furniture',
    ],
    faqs: [
      {
        q: 'Can you work around a tight budget?',
        a: 'Yes. Tell us what matters most and we will suggest where to spend and where to save, then set it out in a written quotation.',
      },
      {
        q: 'Do you supply the bathroom suite?',
        a: 'We can supply it or fit the one you choose. Either way, it is set out clearly in the quotation.',
      },
    ],
    legacySlugs: ['bathroom'],
  },

  // ---------------------------------------------------------------- Interiors
  {
    slug: 'plastering',
    name: 'Plastering',
    category: 'interiors',
    // client
    summary: 'Professional application of plaster to walls and ceilings, providing smooth surfaces and enhancing the durability and appearance of interior spaces.',
    intro: [
      'Good plastering is the difference between walls that look finished and walls that show every flaw once they are painted.',
      'We skim, re-plaster and repair walls and ceilings in single rooms or whole houses, and leave them clean and ready to decorate.',
    ],
    includes: [
      'Skimming walls and ceilings',
      'Full re-plastering',
      'Plasterboarding and dry lining',
      'Patch and crack repairs',
      'Coving and finishing details',
    ],
    faqs: [
      {
        q: 'How soon can I paint new plaster?',
        a: 'Plastering carries a 6-month guarantee to allow for settling, and we strongly recommend waiting through that period before decorating.',
      },
      { q: 'Do you plaster single rooms?', a: 'Yes. Single rooms, ceilings and repairs are all welcome.' },
    ],
    legacySlugs: ['plastering'],
    guarantee: '6-month plastering guarantee',
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
    includes: ['Interior painting', 'Exterior painting', 'Woodwork, doors and skirting', 'Wallpapering', 'Preparation, filling and repairs'],
    faqs: [
      { q: 'Do you move furniture?', a: 'We protect and move furniture within the room as part of the job. Tell us about anything fragile before we start.' },
      { q: 'Can you match existing colours?', a: 'Yes, as long as we can identify the existing paint or take a sample to match.' },
    ],
    legacySlugs: ['decorating-3'],
    // Terms: decorations are signed off on completion and not covered by the guarantee.
    guarantee: null,
  },
  {
    slug: 'tiling',
    name: 'Tiling',
    category: 'interiors',
    // client
    summary: 'Precision installation of tiles for floors, walls and other surfaces, adding durability, style and easy maintenance to any area.',
    intro: [
      'Tiling is judged on the details: level surfaces, straight lines and clean cuts around every corner.',
      'We tile kitchens, bathrooms, wet rooms and living spaces, with the surface prepared properly underneath.',
    ],
    includes: ['Wall and floor tiling', 'Kitchen splashbacks', 'Bathroom and wet-room tiling', 'Surface preparation and levelling', 'Grouting and sealing'],
    faqs: [
      { q: 'Can you tile over existing tiles?', a: 'Occasionally, but it usually gives a poorer result. We check the surface and recommend the right approach.' },
      { q: 'Do you supply tiles?', a: 'We can supply them or fit tiles you have chosen. It will be clear in the quotation.' },
    ],
    legacySlugs: ['tiling'],
  },
  {
    slug: 'tile-and-flooring',
    name: 'Tile & flooring',
    category: 'interiors',
    summary: 'Floor tiles, laminate, vinyl and engineered wood laid on a properly prepared base.',
    intro: [
      'A good floor starts with what is underneath. We level and prepare the subfloor before anything is laid.',
      'From tiled kitchen floors to laminate and engineered wood in living spaces, we finish the edges, thresholds and skirting properly.',
    ],
    includes: ['Floor tiling', 'Laminate and vinyl flooring', 'Engineered wood flooring', 'Subfloor levelling and preparation', 'Thresholds and finishing'],
    faqs: [
      { q: 'Which floor is best for a kitchen?', a: 'Tiles and good-quality vinyl both cope well with water and wear. We explain the options and recommend one in the quotation.' },
      { q: 'Do you remove the old flooring?', a: 'Yes, removal and disposal can be included in the quotation.' },
    ],
    legacySlugs: ['tile-flooring-2'],
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
    includes: ['New circuits for extensions and kitchens', 'Sockets, switches and lighting', 'Rewiring', 'Outdoor lighting and power'],
    faqs: [
      { q: 'Can you add lighting to an existing room?', a: 'Yes. Tell us what you have in mind and we will include it in the quotation.' },
      { q: 'Do you only do electrics as part of a bigger job?', a: 'Electrical work is often part of a wider project, but get in touch about standalone jobs too.' },
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
    includes: ['Kitchen and bathroom plumbing', 'Pipework rerouting', 'Fitting sinks, showers, baths and toilets', 'Plumbing for extensions'],
    faqs: [
      { q: 'Can you move my kitchen sink or bathroom?', a: 'Often, yes. Waste routes and floor construction decide what is practical, and we check those before quoting.' },
      { q: 'Do you take on small plumbing jobs?', a: 'Get in touch and tell us what you need. We will let you know straight away if we can help.' },
    ],
    legacySlugs: ['plumbing-2'],
  },

  // ---------------------------------------------------------------- Exterior
  {
    slug: 'rendering',
    name: 'Rendering',
    category: 'exterior',
    summary: 'External render that protects your walls and refreshes the look of your home.',
    intro: [
      'Render protects external walls from the weather and can transform how a house looks from the street.',
      'We prepare the surface properly, apply the render system you choose and finish the details around windows, doors and edges.',
    ],
    includes: ['Surface preparation and repairs', 'New render and re-rendering', 'Beads, edges and detailing', 'Finishing and painting'],
    faqs: [
      { q: 'Which render should I choose?', a: 'It depends on the wall, the look you want and your budget. We explain the options and recommend one in the quotation.' },
      { q: 'Can you render over old render?', a: 'Sometimes. We check the condition of the existing render first and tell you whether it needs to come off.' },
    ],
    legacySlugs: ['rendering-2'],
  },
  {
    slug: 'roof-work',
    name: 'Roof work',
    category: 'exterior',
    summary: 'Roof repairs, re-roofing and flat roofs that keep the house watertight.',
    intro: [
      'A sound roof protects everything underneath it. Small problems caught early cost far less than leaks left to spread.',
      'We repair and replace pitched and flat roofs, from slipped tiles to a complete re-roof.',
    ],
    includes: ['Roof repairs and slipped tiles', 'Re-roofing', 'Flat roofs', 'Chimney and flashing repairs'],
    faqs: [
      { q: 'Can you look at a leak?', a: 'Yes. Describe the problem when you get in touch and we will arrange to take a look.' },
      { q: 'Repair or replace?', a: 'We tell you honestly. If a repair will do the job, we will say so.' },
    ],
    legacySlugs: ['roof-work'],
  },
  {
    slug: 'roofing-fascias',
    name: 'Fascias, soffits & guttering',
    category: 'exterior',
    summary: 'New fascias, soffits and guttering to protect the roofline and keep water away from the walls.',
    intro: [
      'Fascias, soffits and gutters carry water away from the house. When they rot or leak, damp follows.',
      'We replace and repair rooflines and guttering so they look sharp and do their job.',
    ],
    includes: ['Fascia and soffit replacement', 'Guttering and downpipes', 'Bargeboards', 'Roofline repairs'],
    faqs: [
      { q: 'Do you clear and repair gutters?', a: 'Yes. Tell us about the problem and we will quote for repair or replacement.' },
      { q: 'Can you match my existing colour?', a: 'We will suggest the closest match and agree it with you before ordering.' },
    ],
    legacySlugs: ['roofing-facias-2'],
  },
  {
    slug: 'window-work',
    name: 'Window work',
    category: 'exterior',
    // client
    summary: 'Expert installation and repair of windows, ensuring energy efficiency, security and aesthetic appeal for residential and commercial properties.',
    intro: [
      'Windows affect comfort, security, energy bills and how a house looks. Replacing tired windows can change all four at once.',
      'We install and repair windows for residential and commercial properties, and finish the reveals and sills properly.',
    ],
    includes: ['Window installation', 'Window repairs', 'Reveals, sills and finishing', 'Residential and commercial properties'],
    faqs: [
      { q: 'Do you fit windows in extensions?', a: 'Yes. Glazing is planned as part of every extension and loft conversion we build.' },
      { q: 'Do you work on commercial properties?', a: 'Yes, window work covers both residential and commercial properties.' },
    ],
    legacySlugs: ['window-work'],
  },
  {
    slug: 'double-glazing',
    name: 'Double glazing',
    category: 'exterior',
    summary: 'Double-glazed windows and doors that keep the heat in and the noise out.',
    intro: [
      'Double glazing makes a house warmer, quieter and more secure.',
      'We replace old single-glazed or failed units and fit new double-glazed windows and doors, finished neatly inside and out.',
    ],
    includes: ['Double-glazed windows', 'Doors and patio doors', 'Replacing failed sealed units', 'Finishing inside and out'],
    faqs: [
      { q: 'Can you replace just the glass?', a: 'Often, if the frames are sound. We check them first and tell you what makes sense.' },
      { q: 'Do you fit doors too?', a: 'Yes, including patio and back doors.' },
    ],
    legacySlugs: ['double-glazing-2'],
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
    includes: ['Extension brickwork', 'Garden and boundary walls', 'Brick repairs', 'Repointing'],
    faqs: [
      { q: 'Can you match my existing bricks?', a: 'We source the closest available match and agree it with you before building.' },
      { q: 'Do you build garden walls?', a: 'Yes, garden and boundary walls are part of our brickwork service.' },
    ],
    legacySlugs: ['brick-work'],
  },
  {
    slug: 'driveways',
    name: 'Driveways',
    category: 'exterior',
    // client
    summary: 'Professional installation or renovation of driveways, using durable materials and expert craftsmanship to provide safe and attractive access to properties.',
    intro: [
      'A driveway is only as good as what is underneath it. We dig out, build a proper sub-base and plan drainage before the surface goes down.',
      'From new driveways to extending an existing one, we create safe, attractive access to your property.',
    ],
    includes: ['New driveways', 'Driveway extensions', 'Edging and kerbs', 'Drainage'],
    faqs: [
      { q: 'Which driveway surface is best?', a: 'It depends on budget, look and use. We explain the options and recommend one in the quotation.' },
      { q: 'Can you extend an existing driveway?', a: 'Often, yes. We check levels and drainage before quoting.' },
    ],
    legacySlugs: ['driveway'],
  },
  {
    slug: 'block-paving',
    name: 'Block paving',
    category: 'exterior',
    summary: 'Block-paved driveways, paths and patios laid on a solid, well-drained base.',
    intro: [
      'Block paving is hard-wearing, easy to repair and comes in a wide range of colours and patterns.',
      'We prepare the base and drainage properly, then lay, cut and edge the blocks for a clean, lasting finish.',
    ],
    includes: ['Block-paved driveways', 'Paths and patios', 'Edging and kerbs', 'Drainage and sub-base'],
    faqs: [
      { q: 'Can you repair sunken block paving?', a: 'Yes. We lift the affected area, fix the base and relay the blocks.' },
      { q: 'Can you match existing paving?', a: 'We find the closest available match and agree it with you first.' },
    ],
    legacySlugs: ['block-paving-2'],
  },
  {
    slug: 'fencing',
    name: 'Fencing',
    category: 'exterior',
    summary: 'New fences, gates and replacement panels.',
    intro: ['A good fence gives privacy and security and frames the garden.', 'We install new fencing and gates and replace damaged panels and posts.'],
    includes: ['Panel and close-board fencing', 'Gates', 'Post and panel replacement', 'Removal of old fencing'],
    faqs: [
      { q: 'Can you replace just a few panels?', a: 'Yes. Tell us how many and we will quote for it.' },
      { q: 'Do you remove the old fence?', a: 'Yes, removal and disposal can be included in the quotation.' },
    ],
    legacySlugs: ['fencing-2'],
  },
  {
    slug: 'landscaping',
    name: 'Landscaping',
    category: 'exterior',
    // client
    summary: 'Artful design and careful implementation of outdoor spaces, including gardens, lawns and hardscapes, to enhance curb appeal and create inviting environments.',
    intro: [
      'Landscaping turns outside space into somewhere you want to be, whether that is a lawn for the children or a patio for long evenings.',
      'We design and build gardens, lawns and hard landscaping that suit how you use the space.',
    ],
    includes: ['Garden design and build', 'Lawns and planting', 'Patios and paths', 'Garden walls and edging', 'Outdoor lighting'],
    faqs: [
      { q: 'Can you work with an existing garden design?', a: 'Yes. Share the plans and we will quote for building them.' },
      { q: 'Do you do front gardens too?', a: 'Yes, front and back gardens.' },
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

/** Four stock photos per service (see content/stock/pixabay.txt and scripts/fetch-stock.mjs). */
export function photosFor(service: Service): Photo[] {
  return (servicePhotos as Record<string, Photo[]>)[service.slug] ?? [];
}

/** 720px version of a gallery photo, for lists and grids (generated next to the 1280px original). */
export function thumbOf(src: string): string {
  return src.replace('/gallery/', '/gallery/sm/');
}

export function photoFor(service: Service): { thumb: string; hero: string | null } {
  const first = photosFor(service)[0]?.src ?? null;
  return { thumb: first ? thumbOf(first) : categoryOf(service).image, hero: first };
}

/** Shown on the home page: the same eight services the client featured on the old home page. */
export const featuredSlugs = [
  'window-work', 'plastering', 'tiling', 'bathrooms',
  'kitchen-renovation', 'landscaping', 'driveways', 'loft-extension',
];

export function featuredServices(): Service[] {
  return featuredSlugs.map((slug) => {
    const service = services.find((s) => s.slug === slug);
    if (!service) throw new Error(`Featured service ${slug} does not exist`);
    return service;
  });
}

/** `/our-services/<old-slug>` → `/services/<new-slug>` for every old WordPress service page. */
export function legacyRedirects(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const service of services) {
    for (const old of service.legacySlugs) map[`/our-services/${old}`] = `/services/${service.slug}`;
  }
  return map;
}
