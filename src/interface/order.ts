import { ProductI } from "./products";

export interface OrderItemI {
  product: ProductI;
  quantity: number;
  price: number;
}

export interface OrderI {
  _id: string;
  user?: string;
  cartItems: OrderItemI[];
  totalOrderPrice: number;
  paymentMethod: "cash" | "online" | "card";
  shippingAddress?: {
    details?: string;
    city?: string;
    phone?: string;
  };
  isPaid?: boolean;
  isDelivered?: boolean;
  createdAt: string;
  updatedAt?: string;
}
