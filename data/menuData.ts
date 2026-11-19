export interface MenuItem {
  id: string;
  name: string;
  category: "Burgers";
  price: number;
  description: string;
  imageSrc?: string;
}

export const MENU_CATEGORIES = ["Burgers"] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "the-double",
    name: "The Double Smashed",
    category: "Burgers",
    price: 480,
    description: "Two thin patties pressed hard on a hot griddle, double American cheese, pickles & secret Shack sauce on a toasted potato bun.",
    imageSrc: "/images/closeup-shot-tasty-looking-burger-isolated-1600.webp",
  },
  {
    id: "classic-shack",
    name: "Classic Shack Burger",
    category: "Burgers",
    price: 350,
    description: "Single smashed Texas beef patty, melted American cheese, crisp lettuce, vine-ripe tomato & house Shack sauce.",
    imageSrc: "/images/classic-burger-with-french-fries-beer-1600.webp",
  },
  {
    id: "bacon-griddle",
    name: "Bacon Griddle Smashed",
    category: "Burgers",
    price: 560,
    description: "Double griddled beef patties, thick-cut crispy smoked bacon, melted sharp cheddar & caramelized griddled onions.",
    imageSrc: "/images/closeup-shot-cook-placing-fried-bacon-1600.webp",
  },
  {
    id: "jalapeno-heatwave",
    name: "Jalapeño Heatwave Burger",
    category: "Burgers",
    price: 520,
    description: "Double beef patties, melted pepper jack, pickled jalapeños, crispy onion straws and smoky chipotle aioli.",
    imageSrc: "/images/close-up-delicious-fast-food-meal-1600.webp",
  },
  {
    id: "crispy-chicken-burger",
    name: "Crispy Chicken Shack Burger",
    category: "Burgers",
    price: 420,
    description: "Golden fried buttermilk chicken breast, spicy house slaw, dill pickles & garlic herb aioli on a toasted potato bun.",
    imageSrc: "/images/chicken-burger-served-with-fries-basket-1600.webp",
  },
  {
    id: "triple-griddle-beast",
    name: "Triple Griddle Beast",
    category: "Burgers",
    price: 690,
    description: "Three smashed Texas beef patties, triple American cheese, bacon onion jam and dripping Shack sauce.",
    imageSrc: "/images/close-up-melted-cheese-burger-1600.webp",
  },
];

export const TAX_RATE = 0.05; // 5% Bangladesh restaurant VAT
export const DELIVERY_FEE = 60; // ৳60 standard delivery in Dhaka
export const FREE_DELIVERY_THRESHOLD = 999; // Free delivery over ৳999
