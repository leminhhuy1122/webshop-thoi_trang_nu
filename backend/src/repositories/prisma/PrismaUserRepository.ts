import { PrismaClient, Role } from '@prisma/client';
import { IUserRepository } from '../IUserRepository';

const prisma = new PrismaClient();

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<any> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
  }

  async findById(id: string): Promise<any> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async create(data: { name: string; email: string; passwordHash: string; role?: string }): Promise<any> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        role: (data.role as Role) || Role.CUSTOMER
      }
    });
  }

  async update(id: string, data: any): Promise<any> {
    return prisma.user.update({
      where: { id },
      data
    });
  }
}
