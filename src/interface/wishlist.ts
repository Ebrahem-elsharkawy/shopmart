import { ProductI } from "./products";

export interface WishlistItemI {
  _id: string;
  product: ProductI;
  user?: string;
}
