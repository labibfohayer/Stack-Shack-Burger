export interface MenuItem {
  id: string;
  name: string;
  category: "Burgers" | "Pizza" | "Sides & Chicken" | "Shakes & Drinks" | "Desserts";
  price: number;
  description: string;
  imageSrc?: string;
}

export const MENU_CATEGORIES = [
  "Burgers",
  "Pizza",
  "Sides & Chicken",
  "Shakes & Drinks",
  "Desserts",
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export const MENU_ITEMS: MenuItem[] = [
  // --- Burgers (from Stack Shack website & specialties) ---
  {
    id: "the-double",
    name: "The Double Smashed",
    category: "Burgers",
    price: 9.5,
    description: "Two thin patties pressed hard on a hot griddle, American cheese, pickles & Shack sauce on a toasted potato bun.",
    imageSrc: "/images/closeup-shot-tasty-looking-burger-isolated-1600.webp",
  },
  {
    id: "classic-shack",
    name: "Classic Shack Burger",
    category: "Burgers",
    price: 7.5,
    description: "Single smashed beef patty, American cheese, lettuce, tomato & house Shack sauce.",
    imageSrc: "/images/classic-burger-with-french-fries-beer-1600.webp",
  },
  {
    id: "bacon-griddle",
    name: "Bacon Griddle Smashed",
    category: "Burgers",
    price: 11.0,
    description: "Double beef patties, crispy smoked bacon, melted sharp cheddar & griddled onions.",
    imageSrc: "/images/closeup-shot-cook-placing-fried-bacon-1600.webp",
  },
  {
    id: "jalapeno-heatwave",
    name: "Jalapeño Heatwave Burger",
    category: "Burgers",
    price: 10.5,
    description: "Double beef patties, melted pepper jack, pickled jalapeños & spicy chipotle aioli.",
    imageSrc: "/images/close-up-delicious-fast-food-meal-1600.webp",
  },
  {
    id: "crispy-chicken-burger",
    name: "Crispy Chicken Shack Burger",
    category: "Burgers",
    price: 9.0,
    description: "Crispy buttermilk fried chicken breast, spicy house slaw, pickles & garlic mayo.",
    imageSrc: "/images/chicken-burger-served-with-fries-basket-1600.webp",
  },
  {
    id: "triple-griddle-beast",
    name: "Triple Griddle Beast",
    category: "Burgers",
    price: 13.5,
    description: "Three smashed Texas beef patties, triple American cheese, bacon jam & Shack sauce.",
    imageSrc: "/images/close-up-melted-cheese-burger-1600.webp",
  },

  // --- Pizza ---
  {
    id: "shack-pepperoni-pizza",
    name: "Shack Pepperoni Griddle Pizza",
    category: "Pizza",
    price: 12.0,
    description: "Crispy griddled crust, zesty marinara, spicy cup-and-char pepperoni & whole milk mozzarella.",
  },
  {
    id: "bacon-cheese-pizza",
    name: "Griddle Bacon & 4-Cheese Pizza",
    category: "Pizza",
    price: 11.5,
    description: "Smoked bacon, aged cheddar, mozzarella, provolone & garlic herb butter crust.",
  },
  {
    id: "bbq-chicken-pizza",
    name: "Smokey BBQ Chicken Pizza",
    category: "Pizza",
    price: 12.5,
    description: "Grilled chicken, smoky Texas BBQ sauce, red onion, cilantro & melted mozzarella.",
  },
  {
    id: "margherita-pizza",
    name: "Classic Margherita Pizza",
    category: "Pizza",
    price: 10.0,
    description: "San Marzano style tomato sauce, fresh mozzarella, aromatic basil & extra virgin olive oil.",
  },

  // --- Sides & Chicken ---
  {
    id: "hand-cut-fries",
    name: "Hand-Cut Shack Fries",
    category: "Sides & Chicken",
    price: 4.0,
    description: "Twice-fried crispy Idaho russet potatoes seasoned with Shack sea salt seasoning.",
    imageSrc: "/images/chicken-nuggets-with-french-fries-wooden-1600.webp",
  },
  {
    id: "sweet-potato-fries",
    name: "Sweet Potato Fries",
    category: "Sides & Chicken",
    price: 5.0,
    description: "Crispy crinkle-cut sweet potatoes served with house maple-chipotle dipping sauce.",
    imageSrc: "/images/high-angle-sweet-potato-fries-with-1600.webp",
  },
  {
    id: "crispy-chicken-nuggets",
    name: "Crispy Golden Nuggets (8 Pcs)",
    category: "Sides & Chicken",
    price: 6.5,
    description: "100% whole white-meat chicken nuggets in a crispy spiced crumb with honey mustard.",
    imageSrc: "/images/chicken-nuggets-with-french-fries-wooden-1600.webp",
  },
  {
    id: "loaded-bacon-cheese-fries",
    name: "Loaded Bacon Cheese Fries",
    category: "Sides & Chicken",
    price: 6.5,
    description: "Hand-cut fries smothered in warm cheddar cheese sauce, bacon crumbles & pickled jalapeños.",
  },
  {
    id: "all-beef-hotdog",
    name: "All-Beef Griddle Hot Dog",
    category: "Sides & Chicken",
    price: 5.5,
    description: "Split-top griddled beef frankfurter, caramelized onions, yellow mustard & dill relish.",
  },
  {
    id: "chicken-ranch-wrap",
    name: "Crispy Chicken Ranch Wrap",
    category: "Sides & Chicken",
    price: 7.5,
    description: "Crispy chicken tenders, lettuce, cheddar cheese & buttermilk ranch in a warm tortilla.",
  },

  // --- Shakes & Drinks ---
  {
    id: "strawberry-milkshake",
    name: "Sweet Strawberry Milkshake",
    category: "Shakes & Drinks",
    price: 5.5,
    description: "Hand-spun Texas vanilla bean ice cream blended with sweet fresh strawberry puree.",
    imageSrc: "/images/sweet-strawberry-milkshake-front-view-1600.webp",
  },
  {
    id: "chocolate-cookie-shake",
    name: "Chocolate Cookie Shake",
    category: "Shakes & Drinks",
    price: 5.5,
    description: "Rich dark chocolate shake topped with crushed chocolate chip cookies & fudge drizzle.",
    imageSrc: "/images/chocolate-milkshake-with-cookies-top-1600.webp",
  },
  {
    id: "oreo-whipped-shake",
    name: "Oreo Whipped Milkshake",
    category: "Shakes & Drinks",
    price: 6.0,
    description: "Hand-spun vanilla milkshake loaded with crunchy Oreo cookie crumbles and whipped cream.",
    imageSrc: "/images/woman-holding-oreo-milkshake-with-whipped-1600.webp",
  },
  {
    id: "craft-cola",
    name: "Classic Craft Cola",
    category: "Shakes & Drinks",
    price: 2.75,
    description: "Cane sugar craft soda on tap with fresh ice.",
  },
  {
    id: "texas-lemonade",
    name: "Fresh Squeezed Texas Lemonade",
    category: "Shakes & Drinks",
    price: 3.25,
    description: "Freshly squeezed lemon juice, cane sugar & spring water.",
  },
  {
    id: "sweet-iced-tea",
    name: "Austin Sweet Iced Tea",
    category: "Shakes & Drinks",
    price: 2.75,
    description: "Traditional Southern black tea brewed fresh daily with pure cane sugar.",
  },

  // --- Desserts ---
  {
    id: "fudge-brownie",
    name: "Warm Chocolate Fudge Brownie",
    category: "Desserts",
    price: 4.5,
    description: "Dense, chewy dark chocolate brownie served warm with powdered sugar.",
  },
  {
    id: "cinnamon-churros",
    name: "Cinnamon Sugar Churros",
    category: "Desserts",
    price: 5.0,
    description: "Crispy golden fried churros rolled in cinnamon sugar, served with warm chocolate dip.",
  },
  {
    id: "vanilla-soft-serve",
    name: "Soft Serve Ice Cream Cup",
    category: "Desserts",
    price: 3.5,
    description: "Creamy vanilla soft serve swirl in a cup.",
  },
];

export const TAX_RATE = 0.0825; // 8.25% Austin, Texas sales tax
export const DELIVERY_FEE = 3.99;
export const FREE_DELIVERY_THRESHOLD = 35.0;
