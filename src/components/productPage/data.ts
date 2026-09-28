import type { Category, Product } from "@/lib/types";

export const CATEGORIES: Category[] = [
  { id: "home-decor", name: "Home Decor" },
  { id: "desk-organizers", name: "Desk & Organizers" },
  { id: "toys-games", name: "Toys & Games" },
  { id: "miniatures", name: "Miniatures & Tabletop" },
  { id: "cosplay", name: "Cosplay & Props" },
  { id: "gifts-keychains", name: "Gifts & Keychains" },
  { id: "planters", name: "Planters & Garden" },
  { id: "phone-gadgets", name: "Phone & Gadgets" },
  { id: "lighting", name: "Lamps & Lighting" },
  { id: "functional", name: "Tools & Functional" },
  { id: "jewelry", name: "Jewelry & Fashion" },
  { id: "kitchen", name: "Kitchen & Dining" },
  { id: "automotive", name: "Automotive" },
  { id: "pets", name: "Pet Accessories" },
  { id: "festive", name: "Festive & Seasonal" },
];

const seeds: [string, string, number][] = [
  ["Geometric Vase", "home-decor", 499], ["Modular Desk Organizer", "desk-organizers", 649],
  ["Articulated Dragon", "toys-games", 799], ["Dungeon Terrain Set", "miniatures", 1199],
  ["Mandalorian-style Helmet", "cosplay", 3499], ["Custom Name Keychain", "gifts-keychains", 149],
  ["Self-watering Planter", "planters", 399], ["Magnetic Phone Stand", "phone-gadgets", 299],
  ["Lithophane Moon Lamp", "lighting", 1299], ["Cable Management Clips", "functional", 199],
  ["Minimal Pendant Necklace", "jewelry", 349], ["Spice Rack Organizer", "kitchen", 549],
  ["Car Vent Phone Mount", "automotive", 249], ["Slow Feeder Pet Bowl", "pets", 449],
  ["Diwali Diya Holder", "festive", 279], ["Low-poly Fox Sculpture", "home-decor", 599],
  ["Headphone Stand", "desk-organizers", 699], ["Flexi Octopus", "toys-games", 349],
  ["Orc Warband Miniatures", "miniatures", 899], ["Cyberpunk Mask", "cosplay", 2199],
  ["Photo Frame Keychain", "gifts-keychains", 199], ["Succulent Pot Trio", "planters", 449],
  ["Desk Cable Dock", "phone-gadgets", 329], ["Layered Ambient Lamp", "lighting", 1599],
  ["Wall Hook Set", "functional", 249], ["Geometric Earrings", "jewelry", 299],
  ["Coaster Set", "kitchen", 399], ["Gear Shift Knob", "automotive", 499],
  ["Cat Scratch Toy", "pets", 349], ["Christmas Tree Decor", "festive", 449],
];

export const PRODUCTS: Product[] = seeds.map(([title, category, price], i) => ({
  id: i + 1,
  title,
  category,
  price,
  mrp: Math.round(price * 1.25),
  rating: +(4 + ((i * 7) % 10) / 10).toFixed(1),
  reviews: 12 + ((i * 37) % 300),
  sold: 20 + ((i * 53) % 900),
  hue: (i * 37) % 360,
  inStock: i % 9 !== 0,
  materials: ["PLA", "PETG", "Silk PLA"],
  colors: [
    { name: "Black", hex: "#1c1c1c" }, { name: "White", hex: "#f2f2f2" },
    { name: "Orange", hex: "#ff6a1a" }, { name: "Blue", hex: "#2f6fed" },
  ],
  sizes: ["Small", "Medium", "Large"],
  description:
    "Precision 3D printed at 0.16mm layer height with a smooth finish. Designed and printed in-house at Make It Print. Lightweight, durable and ready to display or use straight out of the box.",
  specs: [
    ["Print time", `${4 + (i % 12)} hrs`], ["Layer height", "0.16 mm"],
    ["Infill", "15–20%"], ["Weight", `${40 + i * 6} g`], ["Dispatch", "2–3 business days"],
  ],
}));