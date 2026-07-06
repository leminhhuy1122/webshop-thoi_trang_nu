import { Request, Response } from "express";
import { products, setProducts } from "../models/products";
import { categories, setCategories } from "../models/categories";
import { getIo } from "../socket";

export const getProducts = (req: Request, res: Response) => {
  res.json(products);
};

export const createProduct = (req: Request, res: Response) => {
  const { name, description, price, salePrice, image, images, category, sizes, colors, stock, materials, careInstructions, tags, isNew } = req.body;
  
  if (category) {
    const catExists = categories.find(c => c.name.toLowerCase() === category.toLowerCase());
    if (!catExists) {
      const newCat = { id: `cat-${Date.now()}`, name: category, createdAt: new Date().toISOString() };
      setCategories([...categories, newCat]);
      getIo().emit("categories_updated", categories);
    }
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    description,
    price: Number(price),
    salePrice: salePrice ? Number(salePrice) : undefined,
    image,
    images: images || [],
    category,
    sizes: sizes || [],
    colors: colors || [],
    stock: stock || 0,
    materials: materials || [],
    careInstructions,
    tags: tags || [],
    isNew: !!isNew,
    createdAt: new Date().toISOString()
  };
  
  setProducts([...products, newProduct]);
  getIo().emit("products_updated", products);
  res.status(201).json(newProduct);
};

export const updateProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }
  
  const updatedProduct = { ...products[index], ...req.body };
  const newProducts = [...products];
  newProducts[index] = updatedProduct;
  setProducts(newProducts);
  getIo().emit("products_updated", products);
  res.json(updatedProduct);
};

export const deleteProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  setProducts(products.filter(p => p.id !== id));
  getIo().emit("products_updated", products);
  res.json({ message: "Deleted" });
};

export const addReview = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, rating, content } = req.body;
  
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }
  
  const product = products[index];
  if (!product.reviews) {
    product.reviews = [];
  }
  
  const newReview = {
    id: `rev-${Date.now()}`,
    name,
    rating: Number(rating),
    content,
    date: new Date().toLocaleDateString('vi-VN')
  };
  
  product.reviews.push(newReview);
  
  // Update average rating
  const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
  product.rating = totalRating / product.reviews.length;
  
  const newProducts = [...products];
  newProducts[index] = product;
  setProducts(newProducts);
  
  getIo().emit("products_updated", products);
  res.status(201).json(newReview);
};
