import { Router } from "express";
import health from "./modules/route/health.route.js";
import bookRoutes from "./modules/route/book.route.js";
import userRoutes from "./modules/route/user.route.js";
import orderRoutes from "./modules/route/order.route.js";
import cartRoutes from "./modules/route/cart.route.js";
import authRoutes from "./modules/route/auth.routes.js";

const router = Router();
router.use("/health", health);
router.use("/book", bookRoutes);
router.use("/user", userRoutes);
router.use("/order", orderRoutes);
router.use("/cart", cartRoutes);
router.use("/auth", authRoutes);

export default router;