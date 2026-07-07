import { Request, Response } from 'express';
import { RepositoryFactory } from '../../repositories/RepositoryFactory';

const categoryRepo = RepositoryFactory.getCategoryRepository();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryRepo.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Lỗi khi lấy danh mục sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};
