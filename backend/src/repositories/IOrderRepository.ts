export interface IOrderRepository {
  findMany(): Promise<any[]>;
  findManyByUserId(userId: string): Promise<any[]>;
  create(data: {
    userId: string;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    finalTotal: number;
    voucherCode?: string | null;
    paymentMethod: string;
    shippingAddress: string;
    recipientName: string;
    recipientPhone: string;
    recipientEmail: string;
    notes?: string | null;
    items: Array<{ productId: string; quantity: number; size: string; color: string; price: number }>;
  }): Promise<any>;
  updateStatus(id: string, status: string): Promise<any>;
  findById(id: string): Promise<any>;
}
