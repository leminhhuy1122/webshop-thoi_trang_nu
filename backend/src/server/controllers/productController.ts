import { Request, Response } from 'express';
import { RepositoryFactory } from '../../repositories/RepositoryFactory';
import { deleteLocalFile } from '../../middlewares/uploadMiddleware';
import { getIo } from '../socket';

const productRepo = RepositoryFactory.getProductRepository();
const categoryRepo = RepositoryFactory.getCategoryRepository();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const { products, total } = await productRepo.findMany({
      category: category as string,
      search: search as string,
      skip,
      take: limitNum
    });

    res.json({
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      salePrice,
      category,
      sizes,
      colors,
      stock,
      materials,
      careInstructions,
      tags,
      isNew
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Vui lòng cung cấp name, price, category' });
    }

    // Lọc danh mục hoặc tạo mới nếu chưa tồn tại
    let catRecord = await categoryRepo.findByName(category);
    if (!catRecord) {
      catRecord = await categoryRepo.create(category);
      const allCats = await categoryRepo.findMany();
      getIo().emit('categories_updated', allCats);
    }

    const finalImage = (req as any).savedFileUrl || req.body.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600';

    const newProduct = await productRepo.create({
      name,
      description: description || '',
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      image: finalImage,
      images: [finalImage],
      categoryId: catRecord.id,
      sizes: Array.isArray(sizes) ? sizes : sizes ? [sizes] : [],
      colors: Array.isArray(colors) ? colors : colors ? [colors] : [],
      stock: stock ? Number(stock) : 0,
      materials: Array.isArray(materials) ? materials : materials ? [materials] : [],
      careInstructions: careInstructions || '',
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      isNew: isNew === 'true' || isNew === true,
      category: { id: catRecord.id, name: catRecord.name }
    });

    // Phát sự kiện cập nhật qua socket realtime
    const { products: allProducts } = await productRepo.findMany({ limit: 1000 });
    getIo().emit('products_updated', allProducts);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Lỗi tạo sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existingProduct = await productRepo.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    const updateData: any = {};
    const fields = ['name', 'description', 'price', 'salePrice', 'sizes', 'colors', 'stock', 'materials', 'careInstructions', 'tags', 'isNew'];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'price' || field === 'stock') {
          updateData[field] = Number(req.body[field]);
        } else if (field === 'salePrice') {
          updateData[field] = req.body[field] ? Number(req.body[field]) : null;
        } else if (field === 'isNew') {
          updateData[field] = req.body[field] === 'true' || req.body[field] === true;
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    if (req.body.category) {
      let catRecord = await categoryRepo.findByName(req.body.category);
      if (!catRecord) {
        catRecord = await categoryRepo.create(req.body.category);
        const allCats = await categoryRepo.findMany();
        getIo().emit('categories_updated', allCats);
      }
      updateData.categoryId = catRecord.id;
      updateData.category = { id: catRecord.id, name: catRecord.name };
    }

    if ((req as any).savedFileUrl) {
      updateData.image = (req as any).savedFileUrl;
      updateData.images = [(req as any).savedFileUrl];
      deleteLocalFile(existingProduct.image);
    }

    const updatedProduct = await productRepo.update(id, updateData);

    const { products: allProducts } = await productRepo.findMany({ limit: 1000 });
    getIo().emit('products_updated', allProducts);

    res.json(updatedProduct);
  } catch (error) {
    console.error('Lỗi cập nhật sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existingProduct = await productRepo.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    await productRepo.delete(id);
    deleteLocalFile(existingProduct.image);

    const { products: allProducts } = await productRepo.findMany({ limit: 1000 });
    getIo().emit('products_updated', allProducts);

    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi xóa sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

export const addReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, rating, content } = req.body;

    if (!name || !rating || !content) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ name, rating, content' });
    }

    const newReview = await productRepo.addReview(id, {
      name,
      rating: Number(rating),
      content
    });

    const { products: allProducts } = await productRepo.findMany({ limit: 1000 });
    getIo().emit('products_updated', allProducts);

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Lỗi thêm bình luận:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};
