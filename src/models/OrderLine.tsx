import { Product } from "./Product";
export interface OrderLine {
    id: number;
    quantity: number;
    product?: Product;
  }