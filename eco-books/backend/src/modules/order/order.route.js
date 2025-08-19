import { Router } from "express";
import * as orderController from "./order.controller.js";

const router = Router();

router.get("/", orderController.getOrders);
router.post("/", orderController.createOrder);

export default router;