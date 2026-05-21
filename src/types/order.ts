import { CartItem } from "./cart";

export type ProductsOrder = Omit<CartItem, "stock">;
export type Order = {
  id?: string;
  user_id: string;
  products: ProductsOrder[];
  status: string;
  total: number;
  pay_date: string;
  delivery_date: string;
};
//datos paginados
export type OrderData = {
  total: number;
  pages: number;
  first: number;
  next: number | null;
  prev: number | null;
  data: Order[];
};
