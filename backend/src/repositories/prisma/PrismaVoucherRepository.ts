import { PrismaClient } from '@prisma/client';
import { IVoucherRepository } from '../IVoucherRepository';

const prisma = new PrismaClient();

export class PrismaVoucherRepository implements IVoucherRepository {
  async findMany(): Promise<any[]> {
    return prisma.voucher.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByCode(code: string): Promise<any> {
    return prisma.voucher.findUnique({
      where: { code: code.toUpperCase() }
    });
  }

  async incrementUsedCount(code: string): Promise<any> {
    return prisma.voucher.update({
      where: { code: code.toUpperCase() },
      data: {
        usedCount: {
          increment: 1
        }
      }
    });
  }

  async create(data: any): Promise<any> {
    return prisma.voucher.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        minOrder: data.minOrder,
        usageLimit: data.usageLimit,
        usedCount: data.usedCount,
        status: data.status,
        expiresAt: new Date(data.expiresAt),
        isWelcome: data.isWelcome
      }
    });
  }
}
