export interface IProductRepository {
  findMany(filters: {
    category?: string;
    search?: string;
    skip?: number;
    take?: number;
  }): Promise<{ products: any[]; total: number }>;

  findById(id: string): Promise<any>;

  create(data: any): Promise<any>;

  update(id: string, data: any): Promise<any>;

  delete(id: string): Promise<any>;

  addReview(productId: string, data: { name: string; rating: number; content: string }): Promise<any>;
}
