import fs from 'fs';
import path from 'path';
import { ICategoryRepository } from '../ICategoryRepository';

const jsonFilePath = path.join(process.cwd(), 'src/demo/categories.json');

export class DemoCategoryRepository implements ICategoryRepository {
  private readData(): any[] {
    try {
      if (!fs.existsSync(jsonFilePath)) {
        return [];
      }
      return JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    } catch (error) {
      console.error('Lỗi khi đọc categories.json:', error);
      return [];
    }
  }

  private writeData(data: any[]): void {
    try {
      fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Lỗi khi ghi categories.json:', error);
    }
  }

  async findMany(): Promise<any[]> {
    return this.readData();
  }

  async findByName(name: string): Promise<any> {
    const list = this.readData();
    return list.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async create(name: string): Promise<any> {
    const list = this.readData();
    const newCat = {
      id: `cat-${Date.now()}`,
      name,
      createdAt: new Date().toISOString()
    };
    list.push(newCat);
    this.writeData(list);
    return newCat;
  }
}
