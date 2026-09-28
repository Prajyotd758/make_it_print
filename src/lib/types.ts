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
