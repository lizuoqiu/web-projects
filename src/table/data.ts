export type Category = 'To start' | 'From the kitchen' | 'Something sweet';
export type Dish = { id: string; name: string; description: string; price: number; category: Category; vegetarian: boolean };
export const categories: Category[] = ['To start', 'From the kitchen', 'Something sweet'];
export const dishes: Dish[] = [
  { id: 'bread', name: 'Bread, still warm', description: 'Rosemary focaccia, cultured butter, flaky sea salt', price: 9, category: 'To start', vegetarian: true },
  { id: 'beets', name: 'Roasted beets & soft cheese', description: 'Whipped chèvre, orange, toasted hazelnuts', price: 17, category: 'To start', vegetarian: true },
  { id: 'chicory', name: 'A bowl of bitter leaves', description: 'Chicory, pear, aged cheddar, mustard dressing', price: 16, category: 'To start', vegetarian: true },
  { id: 'trout', name: 'Smoked trout on toast', description: 'Pickled cucumber, dill, lemon crème fraîche', price: 19, category: 'To start', vegetarian: false },
  { id: 'squash', name: 'Squash, slowly roasted', description: 'Butter beans, sage, pumpkin seeds, brown butter', price: 28, category: 'From the kitchen', vegetarian: true },
  { id: 'mushrooms', name: 'Mushroom & barley risotto', description: 'Roasted oyster mushrooms, thyme, aged cheese', price: 29, category: 'From the kitchen', vegetarian: true },
  { id: 'fish', name: 'Fish from the coast', description: 'Pan-roasted cod, leeks, white beans, herb oil', price: 36, category: 'From the kitchen', vegetarian: false },
  { id: 'chicken', name: 'Chicken for a slow evening', description: 'Roasted chicken, crushed potatoes, pan jus', price: 34, category: 'From the kitchen', vegetarian: false },
  { id: 'pear', name: 'Pear & almond tart', description: 'Warm frangipane, poached pear, vanilla cream', price: 12, category: 'Something sweet', vegetarian: true },
  { id: 'chocolate', name: 'Chocolate, olive oil & salt', description: 'Dark chocolate crémeux, sourdough crumbs', price: 12, category: 'Something sweet', vegetarian: true },
  { id: 'apple', name: 'An apple crumble', description: 'Baked orchard apples, oat crumble, cold cream', price: 11, category: 'Something sweet', vegetarian: true },
  { id: 'cheese', name: 'One last bite', description: 'Aged cheddar, pear preserve, crispbread', price: 14, category: 'Something sweet', vegetarian: true },
];
