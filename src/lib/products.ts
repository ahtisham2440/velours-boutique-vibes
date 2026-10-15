import bra from "@/assets/bra.jpg";
import set from "@/assets/set.jpg";
import night from "@/assets/night.jpg";
import panty from "@/assets/panty.jpg";
import detail from "@/assets/detail.jpg";
import hero from "@/assets/hero.jpg";

export type Category = "Bras" | "Panties" | "Sets" | "Night Wear";

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  images: string[];
  colors: { name: string; swatch: string }[];
  sizes: string[];
  description: string;
  fabric: string;
  care: string[];
  badges: string[];
  rating: number;
  reviews: number;
};

const care = ["Hand wash in cool water", "Use a gentle, mild detergent", "Lay flat to dry, away from sun", "Do not iron lace or bleach"];
const braSizes = ["32B", "34B", "34C", "36B", "36C", "38C"];
const sizes = ["XS", "S", "M", "L", "XL"];

export const products: Product[] = [
  {
    id: "rosalie-lace-bra", name: "Rosalie Lace Bra", category: "Bras", price: 3490,
    images: [bra, detail, set],
    colors: [{ name: "Blush", swatch: "var(--blush)" }, { name: "Rose", swatch: "var(--rose)" }, { name: "Ivory", swatch: "var(--cream)" }],
    sizes: braSizes,
    description: "Delicate floral lace over a softly lined cup. Light support that feels like nothing at all — made to feel as good as it looks.",
    fabric: "Outer: 88% nylon lace, 12% elastane. Lining: 100% breathable cotton.",
    care, badges: ["Soft Cotton Lining", "Skin Friendly", "Easy Returns"], rating: 4.9, reviews: 312,
  },
  {
    id: "amour-satin-set", name: "Amour Satin Set", category: "Sets", price: 5290,
    images: [set, detail, bra],
    colors: [{ name: "Dusty Rose", swatch: "var(--rose)" }, { name: "Wine", swatch: "var(--wine)" }],
    sizes: braSizes,
    description: "A smooth satin bra and brief that glide under any outfit. Quietly elegant, all day comfortable.",
    fabric: "92% soft satin, 8% elastane. Cotton gusset.",
    care, badges: ["Smooth Satin", "Skin Friendly", "Easy Returns"], rating: 4.8, reviews: 204,
  },
  {
    id: "camille-silk-pyjama", name: "Camille Silk Pyjama", category: "Night Wear", price: 6990,
    images: [night, hero, detail],
    colors: [{ name: "Ivory", swatch: "var(--cream)" }, { name: "Blush", swatch: "var(--blush)" }],
    sizes,
    description: "Relaxed silky pyjamas with wine piping. For slow mornings and the deepest sleep.",
    fabric: "100% washable mulberry-touch satin.",
    care, badges: ["Breathable", "Skin Friendly", "Easy Returns"], rating: 4.9, reviews: 158,
  },
  {
    id: "everyday-cotton-briefs", name: "Everyday Cotton Briefs (3-pack)", category: "Panties", price: 1990,
    images: [panty, detail, set],
    colors: [{ name: "Ivory", swatch: "var(--cream)" }, { name: "Blush", swatch: "var(--blush)" }],
    sizes,
    description: "Your new favourite everyday briefs. Pure soft cotton, a gentle lace waist, and no digging in.",
    fabric: "95% combed cotton, 5% elastane. Lace waistband.",
    care, badges: ["Soft Cotton", "Skin Friendly", "Easy Returns"], rating: 4.8, reviews: 489,
  },
  {
    id: "serene-satin-robe", name: "Serene Satin Robe", category: "Night Wear", price: 5490,
    images: [hero, night, detail],
    colors: [{ name: "Blush", swatch: "var(--blush)" }],
    sizes: ["S/M", "L/XL"],
    description: "A flowing robe that wraps you like a soft hug. Lace-trimmed sleeves and a tie waist.",
    fabric: "100% satin with lace trim.",
    care, badges: ["Lightweight", "Skin Friendly", "Easy Returns"], rating: 4.7, reviews: 96,
  },
  {
    id: "petal-lace-brief", name: "Petal Lace Brief", category: "Panties", price: 1490,
    images: [detail, panty, bra],
    colors: [{ name: "Rose", swatch: "var(--rose)" }, { name: "Blush", swatch: "var(--blush)" }],
    sizes,
    description: "Soft stretch lace with a cotton-lined gusset. Invisible under clothes, lovely on you.",
    fabric: "85% nylon lace, 15% elastane. Cotton gusset.",
    care, badges: ["Cotton Gusset", "Skin Friendly", "Easy Returns"], rating: 4.8, reviews: 177,
  },
];

export const categories: { name: Category; image: string }[] = [
  { name: "Bras", image: bra },
  { name: "Panties", image: panty },
  { name: "Sets", image: set },
  { name: "Night Wear", image: night },
];

export const formatPrice = (n: number) => `Rs. ${n.toLocaleString("en-PK")}`;
export const getProduct = (id: string) => products.find((p) => p.id === id);
export const WHATSAPP_URL = "https://wa.me/923000000000?text=Hi%2C%20I%20have%20a%20question";
export { hero, detail };
