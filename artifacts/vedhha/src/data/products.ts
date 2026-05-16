export type Product = {
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  category: string;
  gender: "Men" | "Women" | "Unisex";
  img: string;
  images?: string[];
  description: string;
  details: string[];
  soldOut?: boolean;
  collection?: string;
};

// ── Main Collection ──────────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  {
    name: "VEDHHA Blazer",
    price: "₹7,000",
    category: "Blazers",
    gender: "Men",
    img: "/products/vedhha-blazer.jpg",
    description:
      "The VEDHHA Blazer is a masterpiece of modern Indian craftsmanship. Designed for the urban warrior who commands respect, this blazer blends traditional Indian tailoring with contemporary silhouettes. The structured shoulders and clean lapels give you a powerful stance, while the premium fabric ensures all-day comfort.",
    details: [
      "Premium wool-blend fabric",
      "Structured shoulders with soft padding",
      "Two front pockets + one chest pocket",
      "Slim-fit contemporary cut",
      "Dry clean recommended",
      "Available in sizes S, M, L, XL, XXL",
    ],
  },
  {
    name: "Eklavya Bomber",
    price: "₹4,999",
    category: "Outerwear",
    gender: "Men",
    img: "/products/eklavya-bomber.png",
    description:
      "Inspired by the legendary archer Eklavya, this bomber jacket embodies dedication and strength. A bold statement piece that fuses Indian warrior heritage with modern streetwear energy. The ribbed cuffs, premium outer shell, and clean silhouette make it the go-to jacket for every season of your journey.",
    details: [
      "Water-resistant premium outer shell",
      "Ribbed cuffs and hem for snug fit",
      "Full-zip closure with branded zipper",
      "Two side pockets + one inner pocket",
      "Machine washable at 30°C",
      "Available in sizes S, M, L, XL, XXL",
    ],
  },
  {
    name: "Heritage Hoodie",
    price: "₹3,499",
    category: "Hoodies",
    gender: "Unisex",
    img: "/products/heritage-hoodie.png",
    description:
      "The Heritage Hoodie is where India's rich cultural past meets the streets of tomorrow. Made with ultra-soft fleece lining and a relaxed fit, this hoodie wraps you in warmth without compromising on style. The signature VEDHHA branding and subtle heritage motifs make it a collector's piece for those who understand the legacy.",
    details: [
      "300gsm fleece-lined cotton blend",
      "Kangaroo front pocket",
      "Adjustable drawstring hood",
      "Ribbed cuffs and hem",
      "Relaxed unisex fit",
      "Machine washable at 30°C",
      "Available in sizes XS, S, M, L, XL, XXL",
    ],
  },
];

// ── Gen Z Collection (Sold Out) ───────────────────────────────────────────────
export const GENZ_PRODUCTS: Product[] = [
  {
    name: "Simple Things Tee",
    price: "₹699",
    originalPrice: "₹899",
    discount: "22% OFF",
    category: "T-Shirts",
    gender: "Unisex",
    collection: "Gen Z",
    soldOut: false,
    img: "/simple-things-dual.jpg",
    images: [
      "/simple-things-dual.jpg",
      "/simple-things-front.jpg",
      "/simple-things-back.jpg",
      "/simple-things-detail.png",
    ],
    description:
      "Sometimes the simplest things hit the hardest. The Simple Things Tee features a clean cursive 'simple things' script on the front and an intricate mandala back graphic — a perfect balance of minimalism and depth. Bio wash finish for ultra-soft feel from the very first wear.",
    details: [
      "Bio wash premium cotton — ultra soft from day one",
      "Front: Cursive 'simple things' script print",
      "Back: Intricate mandala graphic",
      "Oversized relaxed fit",
      "Dry wash only",
      "Sizes: XS, S, M, L, XL, XXL",
    ],
  },
  {
    name: "Life Is Beautiful Tee",
    price: "₹599",
    originalPrice: "₹799",
    discount: "25% OFF",
    category: "T-Shirts",
    gender: "Unisex",
    collection: "Gen Z",
    soldOut: false,
    img: "/life-is-beautiful-back.png",
    images: [
      "/life-is-beautiful-back.png",
      "/life-is-beautiful-front.jpg",
      "/life-is-beautiful-detail.png",
    ],
    description:
      "Life is beautiful — and so is this tee. A vibrant acid-washed sage green oversized tee with a bold colorblock 'LIFE IS BEAUTIFUL' mandala back graphic in red, cream, teal, and gold. The front features your name in a bold statement print — because you have crazy potential if you lock in. 240gsm premium cotton, made for those who live loud.",
    details: [
      "240gsm acid-washed premium cotton",
      "Sage green colorway",
      "Front: Customizable name print with motivational text",
      "Back: Life Is Beautiful colorblock mandala graphic",
      "Oversized relaxed fit",
      "Machine washable",
      "Sizes: XS, S, M, L, XL, XXL",
    ],
  },
  {
    name: "Light Weight Baby Tee",
    price: "₹399",
    originalPrice: "₹599",
    discount: "33% OFF",
    category: "T-Shirts",
    gender: "Unisex",
    collection: "Gen Z",
    soldOut: false,
    img: "/products/genz/muscles-tee-front.png",
    images: [
      "/products/genz/muscles-tee-front.png",
      "/products/genz/muscles-tee-back.png",
      "/products/genz/muscles-tee-detail.png",
    ],
    description:
      "For those who lift heavy and live light. Front reads 'Muscles Are My Favorite Accessory' — back drops the iconic 'Light Weight Baby' graphic with a powerlifter silhouette. Acid-washed mocha brown, 240gsm premium cotton. Gym or street — this tee does both.",
    details: [
      "240gsm acid-washed premium cotton",
      "Mocha brown colorway",
      "Front: Muscles Are My Favorite Accessory text print",
      "Back: Light Weight Baby graphic with powerlifter",
      "Oversized relaxed fit",
      "Machine washable",
      "Sizes: XS, S, M, L, XL, XXL",
    ],
  },
  {
    name: "Never Be My Rival Tee",
    price: "₹599",
    originalPrice: "₹799",
    discount: "25% OFF",
    category: "T-Shirts",
    gender: "Unisex",
    collection: "Gen Z",
    soldOut: false,
    img: "/products/genz/never-rival-tee-front.png",
    images: [
      "/products/genz/never-rival-tee-front.png",
      "/products/genz/never-rival-tee-back.png",
      "/products/genz/never-rival-tee-detail.png",
    ],
    description:
      "The boldest drop from VEDHHA yet. Black acid-washed oversized tee with a cracked 3D VEDHHA logo on the front and a full 'Never Be My Rival' dragon graphic on the back. This is not just a tee — it is a statement. Wear it like you mean it.",
    details: [
      "240gsm acid-washed cotton",
      "Cracked 3D VEDHHA logo front print",
      "Full dragon graphic back print",
      "Oversized relaxed fit",
      "Pre-washed for a worn-in feel",
      "Machine washable",
      "Sizes: XS, S, M, L, XL, XXL",
    ],
  },
  {
    name: "Lord I Can't But You Can Tee",
    price: "₹799",
    category: "T-Shirts",
    gender: "Unisex",
    collection: "Gen Z",
    soldOut: true,
    img: "/products/genz/lord-cant-tee.jpg",
    description:
      "A faith-driven streetwear piece that speaks straight from the heart. The jersey-style colorblock design with bold typography makes this tee stand out in any crowd. 'Lord I Can't But You Can' — a reminder to trust the process. Built for Gen Z who wear their beliefs with pride.",
    details: [
      "Jersey-style colorblock fabric",
      "Oversized athletic fit",
      "Bold typography all-over print",
      "Breathable mesh-blend material",
      "Machine washable",
      "Sizes: XS, S, M, L, XL, XXL",
    ],
  },
  {
    name: "Seek His Kingdom Tee",
    price: "₹699",
    category: "T-Shirts",
    gender: "Unisex",
    collection: "Gen Z",
    soldOut: true,
    img: "/products/genz/kingdom-tee.jpg",
    description:
      "Seek first His Kingdom — Matthew 6:33. A beautifully crafted acid-washed tee featuring an intricate floral botanical print with scripture typography. Two stunning variants — light and dark wash — both carrying the same powerful message. Made for those who move with purpose.",
    details: [
      "240gsm premium acid-washed cotton",
      "Full-front botanical floral graphic",
      "Scripture: Matthew 6:33",
      "Oversized relaxed fit",
      "Available in light & dark wash variants",
      "Machine washable",
      "Sizes: XS, S, M, L, XL, XXL",
    ],
  },
  {
    name: "Keep God First Tee",
    price: "₹899",
    category: "T-Shirts",
    gender: "Unisex",
    collection: "Gen Z",
    soldOut: true,
    img: "/products/genz/keep-god-first-tee.jpg",
    description:
      "It's a good day to Keep God First. Rich brown colorway with a bold retro-style 'KEEP GOD FIRST' back graphic in golden yellow. A warm, faith-fuelled essential that pairs with everything. The small chest logo adds the perfect subtle touch before the big reveal on the back.",
    details: [
      "Heavy 280gsm cotton",
      "Rich brown colorway",
      "Back print: KEEP GOD FIRST in retro typography",
      "Small embroidered chest logo",
      "Oversized boxy fit",
      "Machine washable",
      "Sizes: XS, S, M, L, XL, XXL",
    ],
  },
  {
    name: "Tokyo Street Tee",
    price: "₹999",
    category: "T-Shirts",
    gender: "Unisex",
    collection: "Gen Z",
    soldOut: true,
    img: "/products/genz/tokyo-tee.jpg",
    description:
      "Japan vibes, Gen Z energy. The Tokyo Street Tee features a bold 'TOKYO 東京 — Land of the Rising Sun' back graphic in forest green. A cultural fusion piece that blends Japanese street culture with modern oversized silhouettes. The go-to tee for those who travel in their mind.",
    details: [
      "240gsm cotton",
      "Deep forest green colorway",
      "Back print: TOKYO 東京 — Land of the Rising Sun",
      "Clean minimal front",
      "Oversized relaxed fit",
      "Machine washable",
      "Sizes: XS, S, M, L, XL, XXL",
    ],
  },
  {
    name: "Cristo Vive Tee",
    price: "₹899",
    category: "T-Shirts",
    gender: "Unisex",
    collection: "Gen Z",
    soldOut: true,
    img: "/products/genz/cristo-vive-tee.jpg",
    description:
      "Cristo Vive — Christ Lives in Me. A powerful cream-toned oversized tee with an artistic vintage back graphic featuring bold lettering and an illustrated figure. Galations 2:20 — 'I no longer live, but Christ lives in me.' Worn by those who carry faith as their identity.",
    details: [
      "240gsm washed cotton — cream colorway",
      "Large vintage back graphic: Cristo Vive",
      "Illustration + scripture typography",
      "Oversized dropped shoulder fit",
      "Pre-washed for soft feel",
      "Machine washable",
      "Sizes: XS, S, M, L, XL, XXL",
    ],
  },
];

// ── All products combined (for global search/reference) ───────────────────────
export const ALL_PRODUCTS = [...PRODUCTS, ...GENZ_PRODUCTS];

// HOW TO ADD A NEW PRODUCT:
// 1. Add image to artifacts/vedhha/public/products/ folder
// 2. Add entry to PRODUCTS (main) or GENZ_PRODUCTS (Gen Z) array
// 3. Set soldOut: true if the item is sold out
