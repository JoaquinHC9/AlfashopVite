// models/OrderRequest.ts
import { CartItem } from './CartItem';

export interface OrderRequest {
  customerId: number;
  paymentMethod: string; 
  products: CartItem[];
}
