export interface IVoucherRepository {
  findMany(): Promise<any[]>;
  findByCode(code: string): Promise<any>;
  incrementUsedCount(code: string): Promise<any>;
  create(data: any): Promise<any>;
}
