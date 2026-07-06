import { Request, Response } from "express";
import { categories } from "../models/categories";

export const getCategories = (req: Request, res: Response) => {
  res.json(categories);
};
