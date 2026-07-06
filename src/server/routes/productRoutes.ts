import { Router } from "express";
import { getProducts, createProduct, updateProduct, deleteProduct, addReview } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/reviews", addReview);

export default router;
