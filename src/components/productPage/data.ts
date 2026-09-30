import type { Category, Product, ProductImages, Seed } from "@/lib/types";

export const CATEGORIES: Category[] = [
  { id: "household", name: "Household" },
  { id: "toys-games", name: "Toys & Games" },
  { id: "miniatures", name: "Miniatures & Tabletop" },
  { id: "art", name: "Art" },
  { id: "education", name: "Education" },
  { id: "fashion", name: "Fashion" },
  { id: "hobby-diy", name: "Hobby & DIY" },
  { id: "props-cosplay", name: "Props & Cosplay" },
  { id: "tools", name: "Tools" },
];

const mw = (model: string, ...files: string[]) =>
  files.map(
    (f) =>
      `https://makerworld.bblmw.com/makerworld/model/${model}/design/${f}?x-oss-process=image/resize,w_1000/format,webp`
  ) as ProductImages;

const seeds: Seed[] = [
  {
    title: "HydroBowl Fruit & Veggie Washer",
    category: "kitchen",
    price: 0, // TODO: set your price
    images: [
      "https://makerworld.bblmw.com/makerworld/model/US5d826ff8eb029d/design/2025-06-10_9d9a809064185.png?x-oss-process=image/resize,w_1000/format,webp",
      "https://makerworld.bblmw.com/makerworld/model/US5d826ff8eb029d/design/2025-06-10_d5813b289efba8.jpg?x-oss-process=image/resize,w_1000/format,webp",
      "https://makerworld.bblmw.com/makerworld/model/US5d826ff8eb029d/design/2025-06-10_d3b3df45fd184.jpg?x-oss-process=image/resize,w_1000/format,webp",
      "https://makerworld.bblmw.com/makerworld/model/US5d826ff8eb029d/design/2025-06-10_b7a67d6329344.jpg?x-oss-process=image/resize,w_1000/format,webp",
      "https://makerworld.bblmw.com/makerworld/model/US5d826ff8eb029d/design/2025-06-10_8deec9d3f6b3a.jpg?x-oss-process=image/resize,w_1000/format,webp",
    ],
    description:
      "A sink-side produce washer with an angled water inlet that creates a vortex, gently spinning fruits and vegetables for a thorough rinse without scrubbing. Place it in the sink, turn on the tap, and let the flow do the work. Prints with easily removable supports.",
    materials: ["PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "6.6–15.4 hrs"],
      ["Plates", "1"],
      ["Material", "PLA"],
      ["Supports", "Easily removable"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  // in seeds:
  {
    title: "Modular Shoe Rack / Wall Shelf",
    category: "home-decor",
    price: 0, // TODO
    images: mw(
      "US84e4784439f5ca",
      "2025-02-08_e41d0c6df1e51.jpg",
      "2025-02-08_e93d418cb6186.jpg",
      "2025-02-08_dc0ff2aec3867.jpg",
      "2025-02-08_73a540eb19957.jpg",
      "2025-02-08_da267bde29a4a.jpg"
    ),
    description:
      "A compact, space-saving shoe rack with a flowing design that also works as a wall shelf. It's built from just two parts that push together with printed pins, so you can make it any height or length. An optional wall mount is included.",
    materials: ["PLA"],
    sizes: ["Small", "Medium", "Large"],
    specs: [
      ["Print time", "8.4 hrs (2 plates)"],
      ["Layer height", "0.2 mm"],
      ["Infill", "5% (8–15% for heavy use)"],
      ["Assembly", "Push-fit pins, no glue"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Mechanical Desk Phone Holder Arm",
    category: "phone-gadgets",
    price: 0, // TODO
    images: mw(
      "US3e09becace8daf",
      "2025-01-29_250cf6e8889f2.jpg",
      "2025-01-29_3f06170c4d829.png",
      "2025-01-29_5817a81a0eff1.png",
      "2025-01-29_61bf92cb89a3b.png",
      "2025-01-29_6fa7b50551082.jpg"
    ),
    description:
      "A desk-mounted phone arm that holds your phone in any position using a gravity mechanism. All joints are adjustable and it clamps to desks up to 50 mm thick.",
    materials: ["PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "6.2–7.1 hrs (3–4 plates)"],
      ["Desk thickness", "Up to 50 mm"],
      ["Hardware", "8 self-tapping screws + 1 rubber band"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Auto-Locking Ball Hanger",
    category: "functional",
    price: 0, // TODO
    images: mw(
      "US7ea63c10a0d61",
      "2025-01-11_5ce5dca9bbdb6.jpeg",
      "2025-01-11_29da85c9d2136.jpeg",
      "2025-01-11_0e796118ecd7e.jpeg",
      "2025-01-11_a6901416731dc.jpeg",
      "2025-01-11_c0fa7c46d4faf.jpeg"
    ),
    description:
      "A print-in-place wall hanger with a ball that locks the hook automatically. Mount it with double-sided tape or with 3 mm screws. The ball can be printed in a contrasting colour.",
    materials: ["PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "1.3–5.9 hrs"],
      ["Mounting", "Tape or 3 mm screws"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "T-Rex Pencil Holder",
    category: "desk-organizers",
    price: 0, // TODO
    images: mw(
      "US8779fef0a2305",
      "2024-07-15_05bc33c09ed44.jpeg",
      "2024-07-15_882874ed060af.jpeg",
      "2024-07-15_8d92bee5a562f.jpeg",
      "2024-07-15_478bd684623ce.jpeg",
      "2024-07-15_0cb9478d4095e.jpeg"
    ),
    description:
      "A T-Rex desk pencil holder that adds a playful touch to a desk or kids' study corner. Printed in one piece.",
    materials: ["PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "5.3 hrs"],
      ["Dimensions", "16.5 × 16 × 13"], // unit not stated on the page
      ["Supports", "Tree supports recommended"],
      ["Dispatch", "2–3 business days"],
    ],
  },

  {
    title: "iPad / Tablet Stand Riser",
    category: "phone-gadgets",
    price: 0, // TODO
    images: mw(
      "USed8466018779e1",
      "2024-12-22_f5db8e93c19e4.jpg",
      "2024-12-22_c5f5e870c5ee2.jpg",
      "2024-12-22_5ba025ed4571b.jpg",
      "2024-12-22_2e8dc035a49ee.jpg",
      "2024-12-21_103a38716e856.jpg"
    ),
    description:
      "A desktop stand for iPad or tablet with a built-in charging cable passthrough and a storage tray to keep your desk organised. Designed for the iPad Pro 12.9-inch, with a maximum device thickness of 15 mm.",
    materials: ["PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "6.7–8 hrs"],
      ["Layer height", "0.2 mm"],
      ["Infill", "10%"],
      ["Fits", 'iPad Pro 12.9" (max 15 mm thick)'],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Modular Desk Shelf",
    category: "desk-organizers",
    price: 0,
    images: [
      "https://makerworld.bblmw.com/makerworld/model/US38eae433bf24d0/design/2025-02-25_d73fe63c2d0e6.png?x-oss-process=image/resize,w_1000/format,webp",
      "https://makerworld.bblmw.com/makerworld/model/US38eae433bf24d0/design/2025-02-25_6968aff3a4459.png?x-oss-process=image/resize,w_1000/format,webp",
      "https://makerworld.bblmw.com/makerworld/model/US38eae433bf24d0/design/2025-02-25_afbfa9deb86408.png?x-oss-process=image/resize,w_1000/format,webp",
      "https://makerworld.bblmw.com/makerworld/model/US38eae433bf24d0/design/2025-02-25_4b737c84dda0a8.png?x-oss-process=image/resize,w_1000/format,webp",
      "https://makerworld.bblmw.com/makerworld/model/US38eae433bf24d0/design/2025-02-25_cc1f7cf94f6f9.png?x-oss-process=image/resize,w_1000/format,webp",
    ], // page returned no image URLs, add real ones
    description:
      "A fully 3D printed modular desk shelf that you configure with clip-in drawers, shelves and add-ons for phones, headphones and accessories. Parts snap together, and rubber pads keep it non-slip.",
    materials: ["PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "5.7–7.7 hrs per set"],
      ["Assembly", "Clip-in modules, no screws"],
      ["Extras", "10×3 mm rubber pads"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Stackable Dual-Colour Shoe Rack",
    category: "home-decor",
    price: 0,
    images: mw(
      "USae6f41de3b641",
      "2025-01-23_4bd72e79a5af28.jpg",
      "2025-01-22_b6a857f2bc37c8.jpeg",
      "2025-01-22_4fe59e4993535.jpeg",
      "2025-01-22_8ffef336f04d.jpeg",
      "2025-01-22_b3f49f6c0a33f8.jpeg"
    ),
    description:
      "A stackable two-colour shoe rack with a clean look and a honeycomb infill. Posts push into the next level for a snug, wobble-free fit. Available in standard, short and heavy-duty versions.",
    materials: ["PLA"],
    sizes: ["Short", "Standard", "Heavy Duty"],
    specs: [
      ["Print time", "6.2–8.8 hrs (2 plates)"],
      ["Layer height", "0.2 mm"],
      ["Infill", "10%"],
      ["Colours", "Two-colour (filament change)"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Alien Desk Mug Holder",
    category: "desk-organizers",
    price: 0, // TODO
    images: mw(
      "US5d321e7c9002f5",
      "2024-10-16_6c7526e98670c.png",
      "2024-10-16_87aba856ffa65.jpg",
      "2024-10-16_4c87794eb3047.jpg",
      "2024-10-16_3c802def5932e.jpg",
      "2024-10-16_f1585902be6b5.jpg"
    ),
    description:
      "A futuristic, alien-styled mug holder that clamps to your desk so you never knock over a coffee again. Fits mugs up to 95 mm across and desks 12–40 mm thick. Four parts with a screw-clamp system.",
    materials: ["PLA", "PETG"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "8.1 hrs (PLA) / 13.2 hrs (PETG)"],
      ["Mug diameter", "Up to 95 mm"],
      ["Desk thickness", "12–40 mm"],
      ["Infill", "40% in clamp area"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Single-Hand Bottle Cap Shooter",
    category: "toys-games",
    price: 0, // TODO
    images: mw(
      "UScefa610fff8083",
      "2f1d3a7b3fed346a.png",
      "3caa786973aec5e3.png",
      "da3111fee82b79ac.jpeg",
      "230b4e81d6d00cb4.jpeg"
    ),
    description:
      "A one-handed bottle opener that pops the cap off with a satisfying launch. Comes in left- and right-handed versions and must match your bottle shape. Best printed in standard PLA.",
    materials: ["PLA"],
    sizes: ["Right-handed", "Left-handed"],
    specs: [
      ["Print time", "1 hr 7 min – 1 hr 15 min"],
      ["Filament", "About 30 g"],
      ["Parts", "Base, lever, cover, nut"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Ghost with Balloon",
    category: "festive",
    price: 0, // TODO
    images: mw(
      "USc8d7fe1ccf0b6",
      "2025-10-21_a3b32cee1e5f1.jpg",
      "2025-10-21_c999691c1d3ca8.jpg",
      "2025-12-05_47281e7a072fa8.jpg",
      "2025-10-21_3bcea9f0e9d058.jpg",
      "2025-10-21_bfbad1e7daceb8.jpg"
    ),
    description:
      "A little ghost holding a red balloon and floating above the ground. A cute Halloween decoration that can also hold an LED tea light. Simple glue assembly.",
    materials: ["PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "1.2–2 hrs"],
      ["Layer height", "0.2 mm"],
      ["Infill", "15%"],
      ["Assembly", "Glue"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Desk Cable Holder with Clamp",
    category: "desk-organizers",
    price: 0, // TODO
    images: mw(
      "US603a5520109477",
      "2025-11-16_ad36ae6dfc124.jpeg",
      "2025-11-16_210221e05a9a68.jpeg",
      "2025-11-16_2b2d9f91b21e48.jpeg",
      "2025-11-15_4e94a4bb7519b.jpeg",
      "2025-11-15_c0a16a325015e.jpeg"
    ),
    description:
      "A clamp-on desk cable holder that keeps charging cables in reach. Drop a cable into a tube, slide it in, and a spring lock holds it. Pull the slider to release. Clamps to the desk with a screw, no adhesive needed.",
    materials: ["PLA", "PETG"],
    sizes: ["1 cable", "3 cables", "5 cables"],
    specs: [
      ["Print time", "1.9–3.2 hrs"],
      ["Desk thickness", "Up to 30 mm or 50 mm"],
      ["Cable diameter", "3.5 / 5.5 / 7.5 mm tubes"],
      ["Mounting", "Screw clamp"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Balancing Goose Wine Bottle Holder",
    category: "kitchen",
    price: 0, // TODO
    images: mw(
      "US30bc20addf76b4",
      "79d9b20100fcba1b.jpg",
      "79c0a0e5b05339a6.jpg",
      "50bd679c689e6cf6.jpg",
      "5ea2bb0bf6d178cf.jpg"
    ),
    description:
      "A mischievous goose that balances a standard wine bottle. It's a fun conversation piece and gift for wine lovers and gamers. Printed in parts, so a multi-colour look is possible without an AMS.",
    materials: ["PLA", "Wood PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "6.6–8 hrs (4–5 plates)"],
      ["Layer height", "0.28 mm"],
      ["Infill", "5%"],
      ["Assembly", "Parts joined with epoxy"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Modern Two-Tier Bathroom Organizer",
    category: "home-decor",
    price: 0, // TODO
    images: mw(
      "US95e1b0a8c1f8ad",
      "2025-02-05_2c663f44c88c1.jpg",
      "2025-02-20_225ce91d4d28.jpg"
    ),
    description:
      "A two-tier countertop organizer with a minimalist ribbed texture and matte finish. Holds toiletries, skincare products and towels, and suits modern and Scandinavian interiors.",
    materials: ["PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "8.4–13.9 hrs"],
      ["Layer height", "0.16–0.2 mm"],
      ["Infill", "5–15%"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Candy Ghost Bowl",
    category: "festive",
    price: 0, // TODO
    images: mw(
      "US1474dde1b39b95",
      "2023-10-08_624b952db99cc.webp",
      "2023-10-08_d2e90a19e512d.webp",
      "2023-10-08_267e2b1574238.webp",
      "2023-10-08_88877f9965c74.webp"
    ),
    description:
      "A ghost-shaped bowl for candy and sweets. A fun Halloween centrepiece for parties and trick-or-treat.",
    materials: ["PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "5.7–7.1 hrs"],
      ["Layer height", "0.2 mm"],
      ["Infill", "10% gyroid"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Under-Monitor Pen & Sticky Note Holder",
    category: "desk-organizers",
    price: 0, // TODO
    images: mw(
      "USf5e3c51f146b23",
      "2025-01-22_e8e79de11c31c.jpeg",
      "2025-01-22_32afe0c8a31f4.jpeg",
      "2025-01-22_d7a6394bd458b.jpeg",
      "2025-01-22_f063362ad53a4.jpeg"
    ),
    description:
      "A holder that mounts under your monitor and stores a full pad of sticky notes plus pens and pencils. Fits most monitors, with a variant for thicker ones under 50 mm. Prints without supports.",
    materials: ["PLA"],
    sizes: ["Standard", "Thick monitor (<50 mm)"],
    specs: [
      ["Print time", "3.7 hrs"],
      ["Layer height", "0.2 mm"],
      ["Infill", "25%"],
      ["Supports", "None needed"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Foldable Under-Desk Cup Holder",
    category: "desk-organizers",
    price: 0, // TODO
    images: mw(
      "US7dba467c4c9033",
      "395147b589704367.jpeg",
      "1265b7f34637bf0e.png",
      "1a9dbb8acc3c1d1c.jpeg",
      "b3eaa2b0a3a6c1f1.jpeg"
    ),
    description:
      "A fully 3D printed foldable cup holder that mounts under a desk, table or shelf. It has a print-in-place moving section and mounts with screws or strong double-sided tape. Available for different mug diameters.",
    materials: ["PLA"],
    sizes: ["85 mm", "95 mm", "105 mm"],
    specs: [
      ["Print time", "3.7–4.6 hrs (3 plates)"],
      ["Walls / infill", "4 walls, 20%"],
      ["Mounting", "Screws or double-sided tape"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Super Saiyan Figurine",
    category: "miniatures",
    price: 0,
    images: mw(
      "USc3e5c4e30677e",
      "2025-10-28_8ee7a01314de58.png",
      "2025-10-28_8df0e7a296687.png",
      "2025-10-28_2b1b12a1e7de48.png"
    ),
    description:
      "A spiky-haired anime warrior figurine, printed in one piece with optional dowels for a clean fit. Available in single-colour and multi-colour versions.",
    materials: ["PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "2.3–4.1 hrs"],
      ["Layer height", "0.16 mm"],
      ["Infill", "7%"],
      ["Colours", "Single or multi-colour"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "X-Wing Kit Card Model",
    category: "miniatures",
    price: 0,
    images: mw(
      "US7e691af03593cd",
      "2025-08-15_d0b4c8cd4e4d98.png",
      "2025-08-15_b3b065ea61957.png",
      "2025-08-15_7d28c773309fb.png",
      "2025-08-15_3ba84b7ce79378.png",
      "2025-08-15_42ea99939b969.jpg"
    ),
    description:
      "A desk-sized 1:60 scale starfighter kit. Wings open and close, all parts press-fit together without glue, and it comes with a display stand and base.",
    materials: ["PLA"],
    sizes: ["75% (A1 mini)", "Full size"],
    specs: [
      ["Print time", "6.3–17.4 hrs"],
      ["Scale", "1:60"],
      ["Layer height", "0.2 mm"],
      ["Infill", "15%"],
      ["Assembly", "Press-fit, no glue"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "USB Cable & Charger Organizer Tray",
    category: "phone-gadgets",
    price: 0,
    images: mw(
      "US308523116a62c2",
      "05bde317d1901863.png",
      "ee00dc679e1c6e3c.jpeg",
      "ea73b531f8337dc5.jpeg",
      "2026-01-19_37e09651dfa658.jpeg",
      "2026-01-19_5b5b3a2817c298.jpeg"
    ),
    description:
      "A grid organizer with fixed compartments for USB cables, adapters, chargers and power banks, so nothing slides or tangles. Made for drawers, cabinets or desks.",
    materials: ["PLA"],
    sizes: ["Half (96×130 mm)", "Full (192×130 mm)"],
    specs: [
      ["Print time", "4.5–7.5 hrs"],
      ["Compartments", "16 small + 6 medium (or 12 large)"],
      ["Height", "75 mm"],
      ["Layer height", "0.28 mm"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Flexi Skeleton T-Rex",
    category: "toys-games",
    price: 0,
    images: mw(
      "UScad4f84b36c974",
      "2025-07-24_dd8326393ae9b8.png",
      "2025-08-05_3b3da268764958.png",
      "2025-08-05_eed877decd268.png",
      "2025-08-05_6b4d78d3648ed8.png"
    ),
    description:
      "A cute, fully articulated skeleton T-Rex that prints in place with no supports. A fun desk toy and gift for dino fans.",
    materials: ["PLA"],
    sizes: ["Small (15 cm)", "Big (22 cm)"],
    specs: [
      ["Print time", "1.2–3.6 hrs"],
      ["Layer height", "0.2 mm"],
      ["Infill", "5%"],
      ["Supports", "None needed"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Flexi Holding Cat",
    category: "toys-games",
    price: 0,
    images: mw(
      "US3468788e15f281",
      "2024-08-12_15f8412dc5052.jpg",
      "2024-08-12_f214d813eb4de.jpg",
      "2024-08-12_8uia99xtgaw6.jpg",
      "2024-08-12_kuzgbwevrfsk.jpg",
      "2024-08-12_d6o06n726tb2.jpg"
    ),
    description:
      "A very bendy print-in-place cat that stretches and curls like a real cat being held. Comes in standard and long lengths. No supports or assembly needed.",
    materials: ["PLA"],
    sizes: ["Standard", "Long"],
    specs: [
      ["Print time", "42 min – 6.5 hrs"],
      ["Length", "11.5 cm (single colour)"],
      ["Layer height", "0.2 mm"],
      ["Infill", "15–20%"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Articulated Cute Octopus",
    category: "toys-games",
    price: 0,
    images: mw(
      "USa9623939ffc422",
      "2025-04-13_fd5cc2d17224f8.jpg",
      "2025-04-13_fa96f2aa165e98.jpg",
      "2025-04-13_59d86af3115ff8.jpg",
      "2025-04-13_8522d377e301a8.jpg",
      "2025-04-13_61d2fb56c695.jpg"
    ),
    description:
      "An articulated octopus with wiggly, flexible legs and a cute face. Available as a multicolour print or in parts with plug-in legs.",
    materials: ["PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "6.3–11.2 hrs"],
      ["Layer height", "0.2 mm"],
      ["Infill", "15%"],
      ["Supports", "None needed"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Modular Flexi Crab",
    category: "toys-games",
    price: 0,
    images: mw(
      "US2dbeb7d4f7a650",
      "2149c394c41ca4ff.jpg",
      "f4be01783e32fd6f.jpg",
      "f29e8894178ad166.jpg",
      "59765eb75659c91d.jpg",
      "f112963cda88845d.jpg"
    ),
    description:
      "A flexible, articulated crab made of modular parts, so you can mix and match colours. Quick to print and needs no AMS.",
    materials: ["PLA"],
    sizes: ["Standard"],
    specs: [
      ["Print time", "1.3–1.8 hrs"],
      ["Colours", "1, 2 or 3-colour profiles"],
      ["Layer height", "0.24 mm"],
      ["Infill", "5%"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Oriental Wish Dragon Statue",
    category: "miniatures",
    price: 0,
    images: mw(
      "USb2b077bef9d4f6",
      "2026-01-18_f3a1274e31e488.png",
      "2026-01-18_661bfd1bd120c8.png",
      "26f013106c1fd0e2.webp"
    ),
    description:
      "A detailed oriental dragon sculpture printed as a single solid piece with a stable base. Ready to display or paint.",
    materials: ["PLA", "PLA+"],
    sizes: ["Small (10 cm)", "Standard (20 cm)"],
    specs: [
      ["Print time", "2.9–16.1 hrs"],
      ["Layer height", "0.16–0.2 mm"],
      ["Infill", "10–15%"],
      ["Supports", "Tree supports required"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Bulbasaur Multicolor Figurine",
    category: "miniatures",
    price: 0,
    images: mw(
      "US17cf8a95553c06",
      "2024-02-01_28f95695f8f78.png",
      "2024-02-01_9b310e6f43d46.png",
      "2024-02-01_3f2fff19cffc4.png",
      "2024-02-01_270115063f6ce.png",
      "2024-02-01_485ecca0e0554.png"
    ),
    description:
      "A multicolour figurine of a green bulb-backed creature, printed in 4 to 5 colours with fine details on the eyes, claws and tongue.",
    materials: ["PLA"],
    sizes: ["Small (4 cm)", "Standard"],
    colors: [
      { name: "Teal", hex: "#4fa89a" },
      { name: "Green", hex: "#2f7d3a" },
    ],
    specs: [
      ["Print time", "6.2–23.7 hrs"],
      ["Colours", "4 or 5"],
      ["Layer height", "0.2 mm"],
      ["Infill", "10%"],
      ["Supports", "Required"],
      ["Dispatch", "2–3 business days"],
    ],
  },
  {
    title: "Detailed Robotic Scorpion",
    category: "home-decor",
    price: 0,
    images: mw(
      "US7fbc77e08df1d9",
      "2025-06-20_374dc15305c288.jpg",
      "2025-06-19_9b337640a3fe28.jpg",
      "2025-06-19_a01c6bdb9164a8.jpg",
      "2025-06-19_71dc23a1d9fe28.jpg",
      "2025-06-19_be7858ae089678.jpg"
    ),
    description:
      "A decorative mechanical scorpion with a very high level of detail. A static collector's piece, pre-oriented for easy printing.",
    materials: ["PLA"],
    sizes: ["Small", "Large"],
    specs: [
      ["Print time", "1.5–4.1 hrs"],
      ["Layer height", "0.2 mm"],
      ["Infill", "15%"],
      ["Supports", "Required"],
      ["Dispatch", "2–3 business days"],
    ],
  },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const PRODUCTS: Product[] = seeds.map((s, i) => ({
  // fallbacks (same as before)
  mrp: Math.round(s.price * 1.25),
  rating: +(4 + ((i * 7) % 10) / 10).toFixed(1),
  reviews: 12 + ((i * 37) % 300),
  sold: 20 + ((i * 53) % 900),
  inStock: true,
  materials: ["PLA", "PETG", "Silk PLA"],
  colors: [
    { name: "Black", hex: "#1c1c1c" },
    { name: "White", hex: "#f2f2f2" },
    { name: "Orange", hex: "#ff6a1a" },
    { name: "Blue", hex: "#2f6fed" },
  ],
  sizes: ["Small", "Medium", "Large"],
  description:
    "Precision 3D printed at 0.16mm layer height with a smooth finish. Designed and printed in-house at Make It Print.",
  specs: [
    ["Print time", `${4 + (i % 12)} hrs`],
    ["Layer height", "0.16 mm"],
    ["Infill", "15–20%"],
    ["Weight", `${40 + i * 6} g`],
    ["Dispatch", "2–3 business days"],
  ],
  // real data overrides the fallbacks above
  ...s,
  id: i + 1,
  slug: slugify(s.title),
  hue: (i * 37) % 360,
}));
