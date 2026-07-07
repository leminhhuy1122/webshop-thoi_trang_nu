import fs from 'fs';
import path from 'path';
import { IOrderRepository } from '../IOrderRepository';

const jsonFilePath = path.join(process.cwd(), 'src/demo/orders.json');

export class DemoOrderRepository implements IOrderRepository {
  private readData(): any[] {
    try {
      if (!fs.existsSync(jsonFilePath)) {
        return [];
      }
      return JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    } catch (error) {
      console.error('Lỗi khi đọc orders.json:', error);
      return [];
    }
  }

  private writeData(data: any[]): void {
    try {
      fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Lỗi khi ghi orders.json:', error);
    }
  }

  async findMany(): Promise<any[]> {
    return this.readData();
  }

  async findManyByUserId(userId: string): Promise<any[]> {
    const list = this.readData();
    return list.filter(o => o.userId === userId);
  }

  async create(data: any): Promise<any> {
    const list = this.readData();
    const newOrder = {
      ...data,
      id: `ord-${Date.now()}`,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newOrder);
    this.writeData(list);

    // Khấu trừ số lượng tồn kho ảo trong products.json để Demo hoạt động chuẩn
    try {
      const productsPath = path.join(process.cwd(), 'src/demo/products.json');
      if (fs.existsSync(productsPath)) {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        for (const item of data.items) {
          const prod = products.find((p: any) => p.id === item.productId);
          if (prod) {
            prod.stock = Math.max(0, prod.stock - item.quantity);
          }
        }
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('Lỗi khấu trừ tồn kho ảo trong Demo:', err);
    }

    // Tăng lượt dùng voucher ảo trong vouchers.json
    if (data.voucherCode) {
      try {
        const vouchersPath = path.join(process.cwd(), 'src/demo/vouchers.json');
        if (fs.existsSync(vouchersPath)) {
          const vouchers = JSON.parse(fs.readFileSync(vouchersPath, 'utf-8'));
          const v = vouchers.find((voc: any) => voc.code.toUpperCase() === data.voucherCode.toUpperCase());
          if (v) {
            v.usedCount += 1;
          }
          fs.writeFileSync(vouchersPath, JSON.stringify(vouchers, null, 2), 'utf-8');
        }
      } catch (err) {
        console.error('Lỗi cập nhật voucher ảo trong Demo:', err);
      }
    }

    return newOrder;
  }

  async updateStatus(id: string, status: string): Promise<any> {
    const list = this.readData();
    const idx = list.findIndex(o => o.id === id);
    if (idx === -1) throw new Error('Không tìm thấy đơn hàng');

    const updated = {
      ...list[idx],
      status,
      updatedAt: new Date().toISOString()
    };
    list[idx] = updated;
    this.writeData(list);
    return updated;
  }

  async findById(id: string): Promise<any> {
    const list = this.readData();
    return list.find(o => o.id === id) || null;
  }
}
