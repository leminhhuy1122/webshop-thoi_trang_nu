export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  findById(id: string): Promise<any>;
  create(data: { name: string; email: string; passwordHash: string; role?: string }): Promise<any>;
  update(id: string, data: any): Promise<any>;
}
