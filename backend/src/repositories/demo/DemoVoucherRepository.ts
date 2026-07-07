import fs from 'fs';
import path from 'path';
import { IVoucherRepository } from '../IVoucherRepository';

const jsonFilePath = path.join(process.cwd(), 'src/demo/vouchers.json');

export class DemoVoucherRepository implements IVoucherRepository {
  private readData(): any[] {
    try {
      if (!fs.existsSync(jsonFilePath)) {
        return [];
      }
      return JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    } catch (error) {
      console.error('Lỗi khi đọc vouchers.json:', error);
      return [];
    }
  }

  private writeData(data: any[]): void {
    try {
      fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Lỗi khi ghi vouchers.json:', error);
    }
  }

  async findMany(): Promise<any[]> {
    return this.readData();
  }

  async findByCode(code: string): Promise<any> {
    const list = this.readData();
    return list.find(v => v.code.toLowerCase() === code.toLowerCase()) || null;
  }

  async incrementUsedCount(code: string): Promise<any> {
    const list = this.readData();
    const idx = list.findIndex(v => v.code.toLowerCase() === code.toLowerCase());
    if (idx === -1) throw new Error('Không tìm thấy voucher');

    list[idx].usedCount += 1;
    this.writeData(list);
    return list[idx];
  }

  async create(data: any): Promise<any> {
    const list = this.readData();
    const newVoucher = {
      id: `v-${Date.now()}`,
      ...data
    };
    list.push(newVoucher);
    this.writeData(list);
    return newVoucher;
  }
}
