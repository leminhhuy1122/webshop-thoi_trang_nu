import { PrismaClient } from '@prisma/client';
import { ICategoryRepository } from '../ICategoryRepository';

const prisma = new PrismaClient();

export class PrismaCategoryRepository implements ICategoryRepository {
  async findMany(): Promise<any[]> {
    return prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async findByName(name: string): Promise<any> {
    return prisma.category.findUnique({
      where: { name }
    });
  }

  async create(name: string): Promise<any> {
    return prisma.category.create({
      data: { name }
    });
  }
}
