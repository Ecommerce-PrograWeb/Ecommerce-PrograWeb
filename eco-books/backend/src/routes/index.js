import { Router } from "express";
import health from "./health.route.js";
import bookRoutes from "../modules/books/book.route.js";
import userRoutes from "../modules/users/user.route.js";

const router = Router();
router.use("/health", health);
router.use("/books", bookRoutes);
router.use("/users", userRoutes);

export default router;
