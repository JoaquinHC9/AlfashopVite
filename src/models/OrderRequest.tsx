// models/OrderRequest.ts
import { CartItem } from './CartItem';

export interface OrderRequest {
  customerId: number;
  metodoPago: string; 
  productos: CartItem[];
}
