// Extra content for each service page: the main options to talk through, and planning / Building
// Regulations notes. Planning notes are general guidance for England, worded cautiously; under the
// client's terms, arranging permissions is the customer's responsibility.

export interface ServiceDetails {
  options: { name: string; text: string }[];
  planning: string;
}

const STRUCTURAL = 'Structural work normally needs Building Regulations approval, and some projects also need planning permission. Many extensions fall under permitted development, but limits apply and it depends on your property and area.';
const NOT_USUALLY = 'Like-for-like work of this kind does not usually need planning permission. Listed buildings and conservation areas are different, so check with your local council if that applies.';

export const serviceDetails: Record<string, ServiceDetails> = {
  'double-storey-extensions': {
    options: [
      { name: 'Rear extensions', text: 'Extra living space downstairs and a bedroom or bathroom above.' },
      { name: 'Side extensions', text: 'Use the space beside the house for a wider footprint on both floors.' },
      { name: 'Wrap-around extensions', text: 'Combine side and rear for the biggest change to the layout.' },
    ],
    planning: `${STRUCTURAL} Double-storey extensions are more likely to need a planning application than single-storey ones.`,
  },
  'extension-and-loft': {
    options: [
      { name: 'Rear extension with loft', text: 'More room downstairs plus a new bedroom in the roof.' },
      { name: 'Side extension with loft', text: 'Extra width on the ground floor and space upstairs.' },
      { name: 'Phased projects', text: 'Plan both together and build them in stages if that suits you.' },
    ],
    planning: `${STRUCTURAL} A loft conversion always needs Building Regulations approval.`,
  },
  'loft-extension': {
    options: [
      { name: 'Dormer', text: 'Extends the roof outwards for full head height and more floor space.' },
      { name: 'Hip-to-gable', text: 'Straightens a sloping side roof to create a larger loft.' },
      { name: 'Roof-light (Velux)', text: 'Keeps the roof shape and adds windows set into the slope.' },
    ],
    planning: 'Many loft conversions are permitted development, within volume limits, so do not need planning permission. All loft conversions need Building Regulations approval, covering structure, fire safety, stairs and insulation.',
  },
  'kitchen-renovation': {
    options: [
      { name: 'Open-plan', text: 'Remove walls to join the kitchen with dining or living space.' },
      { name: 'New layout', text: 'Move the sink, cooker and units to suit how you use the room.' },
      { name: 'Full refurbishment', text: 'New units, worktops, flooring, lighting and decoration throughout.' },
    ],
    planning: 'Most kitchen work does not need planning permission. Removing a load-bearing wall, and new electrical circuits, are covered by Building Regulations.',
  },
  'kitchen-refits': {
    options: [
      { name: 'Units and worktops', text: 'New doors, carcasses and worktops in the existing layout.' },
      { name: 'Appliances', text: 'Fitting new ovens, hobs, extractors and integrated appliances.' },
      { name: 'Splashbacks and finishes', text: 'Tiling, splashbacks and decoration to finish the room.' },
    ],
    planning: 'A refit in the existing layout does not usually need planning permission. New electrical circuits or moved gas appliances must meet Building Regulations.',
  },
  bathrooms: {
    options: [
      { name: 'Family bathrooms', text: 'A complete new bathroom with bath, shower or both.' },
      { name: 'En-suites and cloakrooms', text: 'Make the most of a small space with the right layout.' },
      { name: 'Walk-in showers and wet rooms', text: 'Level-access showers with proper waterproofing.' },
    ],
    planning: 'Bathroom renovations do not usually need planning permission. Electrical work in bathrooms and new drainage are covered by Building Regulations.',
  },
  plastering: {
    options: [
      { name: 'Skimming', text: 'A smooth new finish over existing walls and ceilings.' },
      { name: 'Re-plastering', text: 'Hacking off old plaster and starting again where it has failed.' },
      { name: 'Plasterboard and dry lining', text: 'New walls and ceilings boarded and finished.' },
    ],
    planning: NOT_USUALLY,
  },
  decorating: {
    options: [
      { name: 'Interior painting', text: 'Walls, ceilings and woodwork, with proper preparation.' },
      { name: 'Exterior painting', text: 'Render, masonry, windows and doors.' },
      { name: 'Wallpapering', text: 'Feature walls or whole rooms hung neatly.' },
    ],
    planning: NOT_USUALLY,
  },
  tiling: {
    options: [
      { name: 'Wall tiling', text: 'Kitchens, bathrooms and feature walls.' },
      { name: 'Floor tiling', text: 'Hard-wearing floors laid level on a prepared base.' },
      { name: 'Wet-room tiling', text: 'Tiling over a tanked, waterproofed surface.' },
    ],
    planning: NOT_USUALLY,
  },
  'tile-and-flooring': {
    options: [
      { name: 'Tiled floors', text: 'Porcelain and ceramic for kitchens, hallways and bathrooms.' },
      { name: 'Laminate and vinyl', text: 'Practical, affordable floors for any room.' },
      { name: 'Engineered wood', text: 'The look of real wood with more stability.' },
    ],
    planning: NOT_USUALLY,
  },
  electrical: {
    options: [
      { name: 'New circuits', text: 'Power and lighting for extensions, kitchens and lofts.' },
      { name: 'Rewiring', text: 'Replacing old wiring throughout the house.' },
      { name: 'Lighting and sockets', text: 'Extra sockets, new lighting and outdoor power.' },
    ],
    planning: 'Electrical work does not need planning permission, but much of it is notifiable under Part P of the Building Regulations and must be certified on completion.',
  },
  plumbing: {
    options: [
      { name: 'Kitchen and bathroom plumbing', text: 'New supplies and waste for sinks, baths and showers.' },
      { name: 'Rerouting pipework', text: 'Moving pipes to suit a new layout.' },
      { name: 'Fitting and repairs', text: 'Taps, toilets, showers and leaks.' },
    ],
    planning: 'Plumbing work does not usually need planning permission. New drainage connections and some installations are covered by Building Regulations.',
  },
  rendering: {
    options: [
      { name: 'Sand and cement', text: 'A traditional render, finished and painted.' },
      { name: 'Silicone and acrylic', text: 'Through-coloured render that resists weather and dirt.' },
      { name: 'Repairs and re-rendering', text: 'Fixing cracked or blown render, or starting again.' },
    ],
    planning: 'Rendering is often permitted development if it is similar in appearance to the existing house. Conservation areas and listed buildings have stricter rules, so check with your council.',
  },
  'roof-work': {
    options: [
      { name: 'Repairs', text: 'Slipped tiles, leaks, flashing and ridge work.' },
      { name: 'Re-roofing', text: 'Stripping and replacing a worn-out roof.' },
      { name: 'Flat roofs', text: 'New flat roofs for extensions and garages.' },
    ],
    planning: 'Repairs and like-for-like re-roofing do not usually need planning permission. Replacing a significant part of a roof can fall under Building Regulations, for example for insulation.',
  },
  'roofing-fascias': {
    options: [
      { name: 'Fascias and soffits', text: 'Replacing rotten timber with low-maintenance boards.' },
      { name: 'Guttering and downpipes', text: 'New or repaired gutters that carry water away properly.' },
      { name: 'Bargeboards', text: 'Neat, weatherproof finishes to the gable ends.' },
    ],
    planning: NOT_USUALLY,
  },
  'window-work': {
    options: [
      { name: 'Window replacement', text: 'New windows fitted and finished inside and out.' },
      { name: 'Repairs', text: 'Fixing hinges, locks, seals and frames.' },
      { name: 'Commercial windows', text: 'Window work for shops, offices and other premises.' },
    ],
    planning: 'Replacing windows with similar ones does not usually need planning permission. Replacement windows must meet Building Regulations, which can be certified through a competent person scheme.',
  },
  'double-glazing': {
    options: [
      { name: 'Double-glazed windows', text: 'Warmer, quieter rooms and better security.' },
      { name: 'Doors and patio doors', text: 'Double-glazed front, back and patio doors.' },
      { name: 'Sealed unit replacement', text: 'Replacing misted glass while keeping sound frames.' },
    ],
    planning: 'Replacing windows and doors with similar ones does not usually need planning permission. New glazing must meet Building Regulations for energy efficiency and safety.',
  },
  brickwork: {
    options: [
      { name: 'New walls', text: 'Extension walls and new structural brickwork.' },
      { name: 'Garden and boundary walls', text: 'Walls built to last and to match the house.' },
      { name: 'Repointing and repairs', text: 'Restoring worn mortar and damaged bricks.' },
    ],
    planning: 'Repairs and repointing do not usually need planning permission. New walls next to a road over 1 metre, or elsewhere over 2 metres, may need permission.',
  },
  driveways: {
    options: [
      { name: 'New driveways', text: 'Dug out, with a proper sub-base and drainage.' },
      { name: 'Driveway extensions', text: 'More parking space, matched to what is there.' },
      { name: 'Kerbs and edging', text: 'Neat edges that hold the surface in place.' },
    ],
    planning: 'A new front driveway over 5 square metres needs planning permission unless it uses a permeable surface or drains to a lawn or border. A new dropped kerb needs council approval.',
  },
  'block-paving': {
    options: [
      { name: 'Block-paved driveways', text: 'Hard-wearing paving in a range of colours and patterns.' },
      { name: 'Paths and patios', text: 'Paving for gardens and walkways.' },
      { name: 'Repairs and relaying', text: 'Lifting sunken areas and relaying them level.' },
    ],
    planning: 'Front gardens paved over 5 square metres need planning permission unless the paving is permeable or drains to a lawn or border. Permeable block paving is one way to avoid this.',
  },
  fencing: {
    options: [
      { name: 'Panel fencing', text: 'Quick to fit and easy to replace.' },
      { name: 'Close-board fencing', text: 'Strong, private fencing that lasts.' },
      { name: 'Gates', text: 'Garden and side gates to match the fence.' },
    ],
    planning: 'Fences up to 2 metres high do not usually need planning permission, or up to 1 metre next to a road or footpath. Listed buildings and conservation areas have stricter rules.',
  },
  landscaping: {
    options: [
      { name: 'Lawns and planting', text: 'New turf, borders and planting.' },
      { name: 'Patios and paths', text: 'Hard landscaping for outdoor living.' },
      { name: 'Walls, edging and lighting', text: 'Details that frame and light the garden.' },
    ],
    planning: 'Most garden landscaping does not need planning permission. Raised decking and patios, and paving a front garden with an impermeable surface, can do.',
  },
};

export function detailsFor(slug: string): ServiceDetails | undefined {
  return serviceDetails[slug];
}
