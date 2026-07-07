export interface ICategoryRepository {
  findMany(): Promise<any[]>;
  findByName(name: string): Promise<any>;
  create(name: string): Promise<any>;
}
