import { PrismaClient } from '@prisma/client';
import { IProductRepository } from '../IProductRepository';

const prisma = new PrismaClient();

export class PrismaProductRepository implements IProductRepository {
  async findMany(filters: {
    category?: string;
    search?: string;
    skip?: number;
    take?: number;
  }): Promise<{ products: any[]; total: number }> {
    const whereClause: any = {
      isDeleted: false
    };

    if (filters.category) {
      whereClause.category = {
        name: {
          equals: filters.category,
          mode: 'insensitive'
        }
      };
    }

    if (filters.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const skip = filters.skip || 0;
    const take = filters.take || 12;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          reviews: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.product.count({ where: whereClause })
    ]);

    return { products, total };
  }

  async findById(id: string): Promise<any> {
    return prisma.product.findUnique({
      where: { id, isDeleted: false },
      include: {
        category: true,
        reviews: true
      }
    });
  }

  async create(data: any): Promise<any> {
    return prisma.product.create({
      data,
      include: {
        category: true
      }
    });
  }

  async update(id: string, data: any): Promise<any> {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true
      }
    });
  }

  async delete(id: string): Promise<any> {
    // Thực thi Soft Delete
    return prisma.product.update({
      where: { id },
      data: { isDeleted: true }
    });
  }

  async addReview(productId: string, review: { name: string; rating: number; content: string }): Promise<any> {
    // 1. Tạo bình luận mới
    const newReview = await prisma.review.create({
      data: {
        productId,
        name: review.name,
        rating: Number(review.rating),
        content: review.content
      }
    });

    // 2. Tính toán lại rating trung bình cho sản phẩm
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { reviews: true }
    });

    if (product) {
      const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
      const avgRating = totalRating / product.reviews.length;

      await prisma.product.update({
        where: { id: productId },
        data: { rating: avgRating }
      });
    }

    return newReview;
  }
}
