import { Router } from "express";
import health from "./modules/route/health.route.js";
import bookRoutes from "./modules/route/book.route.js";
import userRoutes from "./modules/route/user.route.js";
import orderRoutes from "./modules/route/order.route.js";
import cartRoutes from "./modules/route/cart.route.js";

const router = Router();
router.use("/health", health);
router.use("/book", bookRoutes);
router.use("/user", userRoutes);
router.use("/order", orderRoutes);
router.use("/cart", cartRoutes);

export default router;