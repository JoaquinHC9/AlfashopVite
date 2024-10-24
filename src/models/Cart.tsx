import { CartItem } from "./CartItem";

export interface Cart {
    customerId: number; 
    items: CartItem[];
  }