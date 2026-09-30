export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  sold: number;
  hue: number;
  inStock: boolean;
  materials: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  specs: [string, string][];
}

export type Seed = {
  title: string;
  category: string;
  price: number;
  images: ProductImages; // 1 to 5, required
  mrp?: number;
  description?: string;
  materials?: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  specs?: [string, string][];
  inStock?: boolean;
  rating?: number;
  reviews?: number;
  sold?: number;
};

export interface Category {
  id: string;
  name: string;
}

export type ProductImages =
  | [string]
  | [string, string]
  | [string, string, string]
  | [string, string, string, string]
  | [string, string, string, string, string]; // min 1, max 5, enforced by TS

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  sold: number;
  hue: number;
  inStock: boolean;
  materials: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  specs: [string, string][];
  slug: string;
  images: ProductImages;
}

export interface CartItem {
  product: Product;
  qty: number;
  material: string;
  size: string;
  color: string;
}
