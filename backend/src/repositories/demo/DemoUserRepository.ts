import fs from 'fs';
import path from 'path';
import { IUserRepository } from '../IUserRepository';

const jsonFilePath = path.join(process.cwd(), 'src/demo/users.json');

export class DemoUserRepository implements IUserRepository {
  private readData(): any[] {
    try {
      if (!fs.existsSync(jsonFilePath)) {
        return [];
      }
      return JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    } catch (error) {
      console.error('Lỗi khi đọc users.json:', error);
      return [];
    }
  }

  private writeData(data: any[]): void {
    try {
      fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Lỗi khi ghi users.json:', error);
    }
  }

  async findByEmail(email: string): Promise<any> {
    const list = this.readData();
    return list.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findById(id: string): Promise<any> {
    const list = this.readData();
    return list.find(u => u.id === id) || null;
  }

  async create(data: { name: string; email: string; passwordHash: string; role?: string }): Promise<any> {
    const list = this.readData();
    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role || 'CUSTOMER',
      createdAt: new Date().toISOString()
    };
    list.push(newUser);
    this.writeData(list);
    return newUser;
  }

  async update(id: string, data: any): Promise<any> {
    const list = this.readData();
    const idx = list.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('Không tìm thấy người dùng');

    const updated = {
      ...list[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    list[idx] = updated;
    this.writeData(list);
    return updated;
  }
}
