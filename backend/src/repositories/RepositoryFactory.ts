import { IProductRepository } from './IProductRepository';
import { ICategoryRepository } from './ICategoryRepository';
import { IUserRepository } from './IUserRepository';
import { IOrderRepository } from './IOrderRepository';
import { IVoucherRepository } from './IVoucherRepository';

import { PrismaProductRepository } from './prisma/PrismaProductRepository';
import { DemoProductRepository } from './demo/DemoProductRepository';
import { PrismaCategoryRepository } from './prisma/PrismaCategoryRepository';
import { DemoCategoryRepository } from './demo/DemoCategoryRepository';
import { PrismaUserRepository } from './prisma/PrismaUserRepository';
import { DemoUserRepository } from './demo/DemoUserRepository';
import { PrismaOrderRepository } from './prisma/PrismaOrderRepository';
import { DemoOrderRepository } from './demo/DemoOrderRepository';
import { PrismaVoucherRepository } from './prisma/PrismaVoucherRepository';
import { DemoVoucherRepository } from './demo/DemoVoucherRepository';

export class RepositoryFactory {
  static getProductRepository(): IProductRepository {
    return process.env.DEMO_MODE === 'true'
      ? new DemoProductRepository()
      : new PrismaProductRepository();
  }

  static getCategoryRepository(): ICategoryRepository {
    return process.env.DEMO_MODE === 'true'
      ? new DemoCategoryRepository()
      : new PrismaCategoryRepository();
  }

  static getUserRepository(): IUserRepository {
    return process.env.DEMO_MODE === 'true'
      ? new DemoUserRepository()
      : new PrismaUserRepository();
  }

  static getOrderRepository(): IOrderRepository {
    return process.env.DEMO_MODE === 'true'
      ? new DemoOrderRepository()
      : new PrismaOrderRepository();
  }

  static getVoucherRepository(): IVoucherRepository {
    return process.env.DEMO_MODE === 'true'
      ? new DemoVoucherRepository()
      : new PrismaVoucherRepository();
  }
}
