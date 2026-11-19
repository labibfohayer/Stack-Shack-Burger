export interface NavItem {
  name: string;
  href: string;
}

export interface CtaButton {
  text: string;
  href: string;
}

export interface MediaItem {
  imageSrc: string;
  imageAlt?: string;
  cutout?: boolean;
}

export interface LocationItem {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface FooterLink {
  text: string;
  href: string;
}

export interface RestaurantData {
  meta: {
    title: string;
    description: string;
  };
  loader: {
    label: string;
  };
  navbar: {
    brand: string;
    brandHref: string;
    navItems: NavItem[];
    cta: CtaButton;
    menuLabel: string;
    closeLabel: string;
    note: string;
  };
  hero: {
    label: string;
    title: string;
    description: string;
    cta: CtaButton;
    introDelay: number;
    items: MediaItem[];
    sticker: MediaItem;
  };
  mascotClaims: {
    label: string;
    title: string;
    imageSrc: string;
    imageAlt: string;
    claimsLeft: string[];
    claimsRight: string[];
    badge: string;
    stickers: MediaItem[];
    edges: "both" | "top" | "bottom";
  };
  photoBand: {
    imageSrc: string;
    imageAlt: string;
    label: string;
  };
  cutoutLayers: {
    label: string;
    titleLines: string[];
    items: MediaItem[];
  };
  locations: {
    label: string;
    title: string;
    description: string;
    items: LocationItem[];
  };
  ctaSection: {
    label: string;
    title: string;
    description: string;
    cta: CtaButton;
    imageSrc: string;
    imageAlt: string;
    sticker: MediaItem;
  };
  footer: {
    brand: string;
    links: FooterLink[];
    copyright: string;
    tagline: string;
    items: MediaItem[];
  };
}

export const restaurantData: RestaurantData = {
  meta: {
    title: "Webild Components - Stack Shack Burger Restaurant",
    description: "Smashed to order in Austin, Texas since 2017. Fresh ground Texas beef, potato buns, hand-cut fries, and secret Shack sauce.",
  },
  loader: {
    label: "Smashing the patties",
  },
  navbar: {
    brand: "Stack Shack",
    brandHref: "/",
    navItems: [
      { name: "Home", href: "/" },
      { name: "Burgers", href: "/burgers" },
      { name: "Spots", href: "/spots" },
      { name: "Order", href: "/burgers" },
      { name: "Contact", href: "/contact" },
    ],
    cta: {
      text: "Order now",
      href: "/burgers",
    },
    menuLabel: "Menu",
    closeLabel: "Close",
    note: "Smash burgers in Austin, Texas since 2017",
  },
  hero: {
    label: "The double",
    title: "Smashed stacked dripping",
    description:
      "Two thin patties pressed hard on a hot griddle, American cheese, pickles and Shack sauce on a toasted potato bun. Ready in five minutes.",
    cta: {
      text: "Order now",
      href: "/burgers",
    },
    introDelay: 1.1,
    items: [
      {
        imageSrc: "/images/person-holding-delicious-burger-with-beef-1600.webp",
        imageAlt: "Hand holding a smashed double cheeseburger with bacon",
      },
      {
        imageSrc: "/images/chicken-nuggets-with-french-fries-wooden-1600.webp",
        imageAlt: "Nuggets and fries in a dark bowl",
      },
      {
        imageSrc: "/images/sweet-strawberry-milkshake-front-view-1600.webp",
        imageAlt: "Strawberry milkshake with whipped cream and a cherry",
      },
    ],
    sticker: {
      imageSrc: "/images/still-life-delicious-american-hamburger-1600.webp",
      imageAlt: "",
    },
  },
  mascotClaims: {
    label: "Every bite",
    title: "Built to make a mess",
    imageSrc: "/images/closeup-shot-tasty-looking-burger-isolated-1600.webp",
    imageAlt: "Stacked burger on a black surface",
    claimsLeft: ["100% Texas beef", "Ground fresh daily", "Potato buns"],
    claimsRight: ["Never frozen", "Hand-cut fries", "Secret Shack sauce"],
    badge: "Twice smashed",
    stickers: [
      {
        imageSrc: "/images/chocolate-milkshake-with-cookies-top-1600.webp",
      },
      {
        imageSrc: "/images/high-angle-sweet-potato-fries-with-1600.webp",
      },
    ],
    edges: "top",
  },
  photoBand: {
    imageSrc: "/images/grilling-process-preparing-meat-cutlets-burgers-1600.webp",
    imageAlt: "Burger patties searing on a hot flat top",
    label: "Hot off the flat top",
  },
  cutoutLayers: {
    label: "No shortcuts",
    titleLines: ["Every stack", "loaded with", "cheese and", "attitude"],
    items: [
      {
        imageSrc: "/images/closeup-shot-cook-placing-fried-bacon-1600.webp",
      },
      {
        imageSrc: "/images/close-up-melted-cheese-burger-1600.webp",
      },
      {
        imageSrc: "/images/front-view-burger-table-1600.webp",
      },
      {
        imageSrc: "/images/classic-burger-with-french-fries-beer-1600.webp",
      },
    ],
  },
  locations: {
    label: "Pick up",
    title: "Five shacks across Austin",
    description:
      "Every Stack Shack grills to order from 11am till late. Order ahead on the app and your bag is waiting on the counter when you walk in.",
    items: [
      {
        title: "East Sixth",
        description: "1104 E 6th St, open till 3am",
        imageSrc: "/images/fresh-hamburger-black-gloves-1600.webp",
        imageAlt: "Gloved hand holding a burger against night lights",
      },
      {
        title: "South Congress",
        description: "1720 S Congress Ave, the first shack",
        imageSrc: "/images/fast-food-menu-two-person-cafe-1600.webp",
        imageAlt: "Two burgers and fries on a wooden table by the window",
      },
      {
        title: "Mueller",
        description: "1801 Aldrich St, with a big patio",
        imageSrc: "/images/burger-menu-two-pax-with-soft-1600.webp",
        imageAlt: "Burgers, fries and colas on a leafy patio",
      },
      {
        title: "The Domain",
        description: "11410 Century Oaks Ter, drive through",
        imageSrc: "/images/person-enjoying-some-takeaway-burger-1600.webp",
        imageAlt: "Bacon burger in an open takeout box",
      },
      {
        title: "Zilker",
        description: "2201 Barton Springs Rd, near the park",
        imageSrc: "/images/chicken-burger-served-with-fries-basket-1600.webp",
        imageAlt: "Burger and fries on a board in the grass",
      },
    ],
  },
  ctaSection: {
    label: "Hungry yet",
    title: "Get it while it's hot",
    description:
      "Order ahead and skip the line, or grab a booth and watch your patties hit the griddle. Free fries on your first app order.",
    cta: {
      text: "Order now",
      href: "/burgers",
    },
    imageSrc: "/images/vertical-shot-male-s-hand-grabbing-1600.webp",
    imageAlt: "Hand lifting the bun off a burger piled with crispy onions",
    sticker: {
      imageSrc: "/images/close-up-tasty-double-burger-with-1600.webp",
    },
  },
  footer: {
    brand: "Stack Shack",
    links: [
      { text: "Home", href: "/" },
      { text: "Burgers", href: "/burgers" },
      { text: "Spots", href: "/spots" },
      { text: "Contact", href: "/contact" },
    ],
    copyright: "© 2026 Stack Shack, all rights reserved",
    tagline: "SMASHED TO ORDER ON THE GRILL, EST. 2024",
    items: [
      {
        imageSrc: "/images/close-up-delicious-fast-food-meal-1600.webp",
      },
      {
        imageSrc: "/images/still-life-delicious-american-hamburger-2-1600.webp",
      },
      {
        imageSrc: "/images/woman-holding-oreo-milkshake-with-whipped-1600.webp",
      },
      {
        imageSrc: "/images/high-angle-delicious-looking-hamburger-arrangement-1600.webp",
      },
    ],
  },
};
