import fs from 'fs';
import path from 'path';
import { IProductRepository } from '../IProductRepository';

const jsonFilePath = path.join(process.cwd(), 'src/demo/products.json');

export class DemoProductRepository implements IProductRepository {
  private readData(): any[] {
    try {
      if (!fs.existsSync(jsonFilePath)) {
        return [];
      }
      const data = fs.readFileSync(jsonFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Lỗi khi đọc file products.json:', error);
      return [];
    }
  }

  private writeData(data: any[]): void {
    try {
      fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Lỗi khi ghi file products.json:', error);
    }
  }

  async findMany(filters: {
    category?: string;
    search?: string;
    skip?: number;
    take?: number;
  }): Promise<{ products: any[]; total: number }> {
    let products = this.readData();

    if (filters.category) {
      products = products.filter(
        p => p.category?.name.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    const total = products.length;
    const skip = filters.skip || 0;
    const take = filters.take || 12;
    const paginated = products.slice(skip, skip + take);

    return { products: paginated, total };
  }

  async findById(id: string): Promise<any> {
    const products = this.readData();
    return products.find(p => p.id === id) || null;
  }

  async create(data: any): Promise<any> {
    const products = this.readData();
    const newProduct = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    this.writeData(products);
    return newProduct;
  }

  async update(id: string, data: any): Promise<any> {
    const products = this.readData();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Không tìm thấy sản phẩm');

    const updated = {
      ...products[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    products[idx] = updated;
    this.writeData(products);
    return updated;
  }

  async delete(id: string): Promise<any> {
    let products = this.readData();
    products = products.filter(p => p.id !== id);
    this.writeData(products);
    return { message: 'Deleted' };
  }

  async addReview(productId: string, review: { name: string; rating: number; content: string }): Promise<any> {
    const products = this.readData();
    const idx = products.findIndex(p => p.id === productId);
    if (idx === -1) throw new Error('Không tìm thấy sản phẩm');

    const product = products[idx];
    if (!product.reviews) {
      product.reviews = [];
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      ...review,
      date: new Date().toLocaleDateString('vi-VN')
    };

    product.reviews.push(newReview);

    // Tính điểm trung bình
    const totalRating = product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    product.rating = totalRating / product.reviews.length;

    products[idx] = product;
    this.writeData(products);
    return newReview;
  }
}
