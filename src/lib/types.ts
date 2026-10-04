export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  _id: string; // replaces `id: number`
  title: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  materials: string[];
  sizes: string[]; // use (string | number)[] if you store numbers
  specs: Record<string, unknown>;
  colors: ProductColor[];
  hue: number;
  sold: number;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
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

export interface CartItem {
  product: Product;
  qty: number;
  material: string;
  size: string;
  color: string;
}

export type ProductImages =
  | [string]
  | [string, string]
  | [string, string, string]
  | [string, string, string, string]
  | [string, string, string, string, string]; // min 1, max 5, enforced by TS
