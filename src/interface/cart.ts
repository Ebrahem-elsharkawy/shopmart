import { ProductI } from "./products";

export interface CartItemI {
  _id: string;
  product: ProductI;
  quantity: number;
  price: number;
}

export interface CartI {
  _id: string;
  cartItems: CartItemI[];
  totalCartPrice: number;
  user?: string;
}


