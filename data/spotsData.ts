export interface SpotItem {
  id: string;
  name: string;
  locationArea: string;
  address: string;
  hours: {
    weekdays: string;
    friday: string;
  };
  phone: string;
  description: string;
  tags: string[];
  mapLink: string;
  imageSrc: string;
  imageAlt: string;
}

export const SPOTS_DATA: SpotItem[] = [
  {
    id: "dhanmondi",
    name: "DHANMONDI SHACK",
    locationArea: "Dhanmondi, Dhaka",
    address: "House 00, Road 00 (Near Satmasjid Road), Dhanmondi, Dhaka 1205",
    hours: {
      weekdays: "Sat – Thu: 11:00 AM – 11:00 PM",
      friday: "Fri: 2:00 PM – 11:30 PM",
    },
    phone: "+880 1XXX-XXXX01 (Demo)",
    description:
      "Our flagship Dhaka spot right off Satmasjid Road. Cozy griddle counter, vintage hip-hop beats, and fresh smashed patties seared right in front of your eyes.",
    tags: ["Dine-in", "Takeaway", "Delivery", "Indoor AC"],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Dhanmondi+Dhaka",
    imageSrc: "/images/fast-food-menu-two-person-cafe-1600.webp",
    imageAlt: "Dhanmondi Stack Shack dine-in table by the window",
  },
  {
    id: "banani",
    name: "BANANI SHACK",
    locationArea: "Banani, Dhaka",
    address: "House 00, Road 00 (Block 11 Food Street), Banani, Dhaka 1213",
    hours: {
      weekdays: "Sat – Thu: 11:00 AM – Midnight",
      friday: "Fri: 2:00 PM – Midnight",
    },
    phone: "+880 1XXX-XXXX02 (Demo)",
    description:
      "Located in the vibrant center of Banani 11. Neon-lit patio seating, late-night griddle smash sessions, and thick ice-cold milkshakes flowing till midnight.",
    tags: ["Dine-in", "Takeaway", "Delivery", "Outdoor Patio", "Late Night"],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Banani+11+Dhaka",
    imageSrc: "/images/burger-menu-two-pax-with-soft-1600.webp",
    imageAlt: "Banani Stack Shack bustling patio with burgers and drinks",
  },
  {
    id: "gulshan",
    name: "GULSHAN SHACK",
    locationArea: "Gulshan, Dhaka",
    address: "Plot 00, Avenue 00 (Near Gulshan 2 Circle), Gulshan, Dhaka 1212",
    hours: {
      weekdays: "Sat – Thu: 11:00 AM – 11:30 PM",
      friday: "Fri: 2:00 PM – Midnight",
    },
    phone: "+880 1XXX-XXXX03 (Demo)",
    description:
      "Sleek burger haven right by Gulshan 2. Premium open griddle station, ultra-fast express takeout pickup counter, and dedicated home delivery dispatch.",
    tags: ["Dine-in", "Takeaway", "Express Delivery", "Free WiFi"],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Gulshan+2+Dhaka",
    imageSrc: "/images/high-angle-delicious-looking-hamburger-arrangement-1600.webp",
    imageAlt: "Gulshan Stack Shack signature burger feast arrangement",
  },
];
