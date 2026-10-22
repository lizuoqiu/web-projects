export type Category = 'Desk objects' | 'Paper goods' | 'Lighting';

export type Variant = {
  id: string;
  name: string;
  color: string;
  available: boolean;
  image: string;
  imageSide: 'left' | 'right';
};

export type Product = {
  id: string;
  name: string;
  category: Category;
  priceCents: number;
  subtitle: string;
  description: string;
  materials: string;
  dimensions: string;
  details: string[];
  variants: [Variant, Variant];
};

export const categories: Category[] = ['Desk objects', 'Paper goods', 'Lighting'];

const variant = (product: string, id: string, name: string, color: string, available = true): Variant => ({
  id, name, color, available, image: `${product}-photo.png`,
  imageSide: ['walnut', 'ink', 'graphite', 'forest', 'clay', 'slate', 'olive'].includes(id) ? 'right' : 'left',
});

export const products: Product[] = [
  {
    id: 'arc-tray', name: 'Arc Desk Tray', category: 'Desk objects', priceCents: 3400,
    subtitle: 'A place for the small things.',
    description: 'A softly curved home for the things that tend to wander. The shallow, open shape keeps a pen, a pair of glasses, or a few daily essentials within easy reach.',
    materials: 'Solid wood · matte oil finish', dimensions: '24 × 12 × 2.4 cm',
    details: ['Rounded interior for an easy pick-up', 'Low profile with a gently raised edge', 'Wipe clean with a soft, dry cloth'],
    variants: [variant('arc-tray', 'maple', 'Maple', '#c6a47b'), variant('arc-tray', 'walnut', 'Walnut', '#79523c')],
  },
  {
    id: 'field-notebook', name: 'Field Notebook', category: 'Paper goods', priceCents: 1800,
    subtitle: 'Room for an unfinished thought.',
    description: 'An everyday notebook with a quiet cloth cover and generous, lightly ruled pages. Made for working notes, wandering lists, and the thought you want to come back to.',
    materials: 'Cloth cover · 100 gsm writing paper', dimensions: '14.8 × 21 cm · 160 pages',
    details: ['Lay-flat sewn binding', 'Subtle ruled pages with generous margins', 'A ribbon marker to keep your place'],
    variants: [variant('field-notebook', 'oat', 'Oat', '#c6baa4'), variant('field-notebook', 'ink', 'Ink', '#3d474b')],
  },
  {
    id: 'column-rest', name: 'Column Pen Rest', category: 'Desk objects', priceCents: 2400,
    subtitle: 'A pause between sentences.',
    description: 'A small sculptural rest with a single carved channel. Enough weight to stay put, and just enough presence to make setting down your pen feel intentional.',
    materials: 'Cast mineral composite · cork base', dimensions: '15 × 3.8 × 2.2 cm',
    details: ['One gently recessed pen channel', 'Soft cork underside', 'Natural, lightly textured surface'],
    variants: [variant('column-rest', 'chalk', 'Chalk', '#d9d3c6'), variant('column-rest', 'graphite', 'Graphite', '#5e605e')],
  },
  {
    id: 'loop-cup', name: 'Loop Pencil Cup', category: 'Desk objects', priceCents: 2800,
    subtitle: 'The everyday, gathered.',
    description: 'A simple ceramic cylinder, softened with a rounded lip and a tactile satin glaze. A compact home for pencils, brushes, and the tools you reach for most.',
    materials: 'Glazed stoneware', dimensions: '8.5 cm diameter × 10 cm tall',
    details: ['Satin exterior with a smooth glazed interior', 'Wide base and rounded rim', 'Clean with a damp cloth'],
    variants: [variant('loop-cup', 'sand', 'Sand', '#c7b59d'), variant('loop-cup', 'forest', 'Forest', '#616d58')],
  },
  {
    id: 'weekly-pad', name: 'Weekly Desk Pad', category: 'Paper goods', priceCents: 2200,
    subtitle: 'One week. A little perspective.',
    description: 'A clear view of the week without a crowded calendar. Five open columns and a little space for whatever matters next, on an undated tear-off pad.',
    materials: '120 gsm paper · board backing', dimensions: '29.7 × 18 cm · 52 sheets',
    details: ['Undated, so you can start anywhere', 'Five weekday columns and a notes area', 'Clean tear-off edge'],
    variants: [variant('weekly-pad', 'cream', 'Cream', '#e0d4b9'), variant('weekly-pad', 'clay', 'Clay', '#bd8d78')],
  },
  {
    id: 'index-cards', name: 'Index Card Set', category: 'Paper goods', priceCents: 1600,
    subtitle: 'A small space for a good idea.',
    description: 'Keep one idea at a time in focus. A stack of generously weighted cards for quick sketches, reminders, and moving your thoughts around on the table.',
    materials: '300 gsm uncoated card · paper band', dimensions: '10 × 15 cm · 50 cards',
    details: ['Plain fronts with a fine dot grid on the reverse', 'Smooth, uncoated writing surface', 'Wrapped in a reusable paper band'],
    variants: [variant('index-cards', 'ivory', 'Ivory', '#e6dfcf'), variant('index-cards', 'slate', 'Slate', '#a4afb1')],
  },
  {
    id: 'focus-lamp', name: 'Focus Task Lamp', category: 'Lighting', priceCents: 8600,
    subtitle: 'Light where you need it.',
    description: 'A balanced task light with a slim stem and a quietly angled shade. Its compact footprint leaves room for your work, while a warm pool of light defines your space.',
    materials: 'Powder-coated metal', dimensions: '38 cm tall · 16 cm base',
    details: ['Adjustable shade angle', 'Warm 2700K LED light', 'Inline dimmer and USB-C power connection'],
    variants: [variant('focus-lamp', 'chalk', 'Chalk', '#d9d5c9'), variant('focus-lamp', 'ink', 'Ink', '#45494a')],
  },
  {
    id: 'halo-light', name: 'Halo Reading Light', category: 'Lighting', priceCents: 7200,
    subtitle: 'For the slower part of the day.',
    description: 'A low, rounded shade and a generous base make a soft companion for the corner of a desk. A gentle glow for reading a few more pages or finishing the day.',
    materials: 'Powder-coated metal · frosted diffuser', dimensions: '25 cm tall · 20 cm shade',
    details: ['Diffused warm 2700K LED light', 'Three touch-controlled brightness levels', 'USB-C power connection'],
    variants: [variant('halo-light', 'parchment', 'Parchment', '#d7c8ab'), variant('halo-light', 'olive', 'Olive', '#787c59', false)],
  },
];

export const money = (cents: number): string => new Intl.NumberFormat('en-CA', {
  style: 'currency', currency: 'CAD', maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
}).format(cents / 100);

export const assetUrl = (name: string): string => `${import.meta.env.BASE_URL}images/objects/${name}`;
