export interface Payment {
    id: number;
    amount: number;
    paymentMethod: string;
    orderId: number;
    createdDate: string;
    lastModifiedDate: string | null;
  }
  