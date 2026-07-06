import { Request, Response } from "express";
import { orders } from "../models/orders";

export const getOrders = (req: Request, res: Response) => {
  res.json(orders);
};
