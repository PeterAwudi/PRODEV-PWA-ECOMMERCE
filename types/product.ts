// types/product.ts
export interface Product {
  id: number;
  title: string;        // ✅ Changed from "name" to "title"
  description: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}
