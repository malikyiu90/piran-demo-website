// Towns the client covers (brief, November 2026), shown on /areas-we-cover, in the footer, the FAQs and the
// business schema. Facts here are public ones (councils, postcode districts, rough distances); nothing claims
// work done in a town, so add project examples only from real jobs.

export interface Area {
  /** Anchor on /areas-we-cover, e.g. /areas-we-cover#nuneaton */
  id: string;
  name: string;
  county: string;
  /** Council that handles planning and Building Control there. */
  council: string;
  postcodes: string;
  distance: string;
  intro: string[];
  /** Service slugs to link from the town's section. */
  services: string[];
}

export const areas: Area[] = [
  {
    id: 'coventry',
    name: 'Coventry',
    county: 'West Midlands',
    council: 'Coventry City Council',
    postcodes: 'CV1 to CV6',
    distance: 'Our base',
    intro: [
      'Coventry is where we are based, so most of our jobs are a short drive away, from Earlsdon and Stoke to Tile Hill, Allesley and Binley.',
      'The city’s terraces and 1930s semis suit rear and side extensions and loft conversions, and with two universities nearby, many landlords need HMO renovations and fast turnarounds between tenancies.',
    ],
    services: ['double-storey-extensions', 'loft-extension', 'hmo-renovations', 'kitchen-renovation', 'bathrooms', 'driveways'],
  },
  {
    id: 'nuneaton',
    name: 'Nuneaton',
    county: 'Warwickshire',
    council: 'Nuneaton and Bedworth Borough Council',
    postcodes: 'CV10 and CV11',
    distance: 'About 10 miles north of Coventry',
    intro: [
      'We work across Nuneaton, from the town centre terraces to newer estates on the edge of town.',
      'Extensions, loft conversions, kitchens and bathrooms are planned and built by the same team we use in Coventry, with planning and Building Control handled through Nuneaton and Bedworth Borough Council.',
    ],
    services: ['double-storey-extensions', 'loft-extension', 'kitchen-renovation', 'bathrooms', 'roof-work', 'landscaping'],
  },
  {
    id: 'bedworth',
    name: 'Bedworth',
    county: 'Warwickshire',
    council: 'Nuneaton and Bedworth Borough Council',
    postcodes: 'CV12',
    distance: 'About 6 miles north of Coventry',
    intro: [
      'Bedworth sits between Coventry and Nuneaton, so it is one of the easiest places for our team to reach.',
      'We take on everything from extensions and loft rooms to new kitchens, bathrooms, driveways and fencing.',
    ],
    services: ['extension-and-loft', 'kitchen-refits', 'bathrooms', 'driveways', 'fencing', 'plastering'],
  },
  {
    id: 'hinckley',
    name: 'Hinckley',
    county: 'Leicestershire',
    council: 'Hinckley and Bosworth Borough Council',
    postcodes: 'LE10',
    distance: 'About 13 miles north-east of Coventry, just over the Leicestershire border',
    intro: [
      'Hinckley is in Leicestershire, a short run up the A5 and M69 from Coventry.',
      'Planning and Building Control there go through Hinckley and Bosworth Borough Council. We build extensions and loft conversions and renovate kitchens, bathrooms and exteriors.',
    ],
    services: ['double-storey-extensions', 'loft-extension', 'kitchen-renovation', 'bathrooms', 'rendering', 'block-paving'],
  },
  {
    id: 'leamington-spa',
    name: 'Leamington Spa',
    county: 'Warwickshire',
    council: 'Warwick District Council',
    postcodes: 'CV31 and CV32',
    distance: 'About 10 miles south of Coventry',
    intro: [
      'Leamington Spa has a large stock of Regency and Victorian houses, and much of the town is in conservation areas, where some work needs extra permission.',
      'We renovate period and modern homes alike, from kitchens and bathrooms to extensions, and HMO work for the town’s many rented homes. Check with Warwick District Council early if your house is listed or in a conservation area.',
    ],
    services: ['kitchen-renovation', 'bathrooms', 'hmo-renovations', 'double-storey-extensions', 'plastering', 'decorating'],
  },
];

/** "Coventry, Nuneaton, Bedworth, Hinckley and Leamington Spa" */
export const areaList = areas.map((a) => a.name).join(', ').replace(/, ([^,]+)$/, ' and $1');
