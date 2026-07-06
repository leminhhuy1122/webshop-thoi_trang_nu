import express from "express";
import cors from "cors";
import productRoutes from "../src/server/routes/productRoutes";
import categoryRoutes from "../src/server/routes/categoryRoutes";
import orderRoutes from "../src/server/routes/orderRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use(["/api/products", "/products"], productRoutes);
app.use(["/api/categories", "/categories"], categoryRoutes);
app.use(["/api/orders", "/orders"], orderRoutes);

export default app;
