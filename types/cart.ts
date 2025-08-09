// types/cart.ts
export type UUID = string;

export interface CartItem {
  product: UUID;
  product_name: string;
  price: number;       // numeric price in GHS
  quantity: number;
  total_price: number; // price * quantity
}

export interface Cart {
  cart_id: UUID;
  user: UUID;
  items: CartItem[];
  subtotal: number;    // sum of total_price
  currency?: string;   // default "GHS"
  createdAt?: string;
  updatedAt?: string;
}
