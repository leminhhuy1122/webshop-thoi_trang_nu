import { PrismaClient, OrderStatus, PaymentMethod } from '@prisma/client';
import { IOrderRepository } from '../IOrderRepository';

const prisma = new PrismaClient();

export class PrismaOrderRepository implements IOrderRepository {
  async findMany(): Promise<any[]> {
    return prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        orderItems: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findManyByUserId(userId: string): Promise<any[]> {
    return prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(data: {
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
  }): Promise<any> {
    // Chạy transaction để ghi đơn hàng, chi tiết đơn hàng và cập nhật tồn kho sản phẩm
    return prisma.$transaction(async (tx) => {
      // 1. Tạo đơn hàng chính
      const order = await tx.order.create({
        data: {
          userId: data.userId,
          subtotal: data.subtotal,
          shippingFee: data.shippingFee,
          discountAmount: data.discountAmount,
          finalTotal: data.finalTotal,
          voucherCode: data.voucherCode,
          paymentMethod: data.paymentMethod as PaymentMethod,
          shippingAddress: data.shippingAddress,
          recipientName: data.recipientName,
          recipientPhone: data.recipientPhone,
          recipientEmail: data.recipientEmail,
          notes: data.notes
        }
      });

      // 2. Tạo các item tương ứng và cập nhật tồn kho
      for (const item of data.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price
          }
        });

        // Trừ tồn kho sản phẩm
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return order;
    });
  }

  async updateStatus(id: string, status: string): Promise<any> {
    return prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus
      }
    });
  }

  async findById(id: string): Promise<any> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: { include: { product: true } }
      }
    });
  }
}
