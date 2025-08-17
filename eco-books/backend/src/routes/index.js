import { Router } from "express";
import health from "./health.route.js";
import bookRoutes from "../modules/books/book.route.js";
import userRoutes from "../modules/users/user.route.js";
import orderRoutes from "../modules/order/order.route.js";
import cartRoutes from "../modules/cart/cart.route.js";

const router = Router();
router.use("/health", health);
router.use("/books", bookRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/cart", cartRoutes);

export default router;