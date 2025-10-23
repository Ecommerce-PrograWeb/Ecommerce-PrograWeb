import { Router } from "express";
import {
  getOrders,
  getOrderById,
  getOrdersByUserId,
  createOrder,
  patchOrder,
  putOrder,
  deleteOrder,
  historyForUser,              // 👈 AGREGA ESTA LÍNEA
} from "../controller/order.controller.js";
import { verifyJWT } from "../../core/middlewares/auth.js";

const router = Router();

router.get("/", getOrders);
router.get("/user/:userId", getOrdersByUserId);

// ¡Mantén /history antes de "/:id"!
router.get("/history", verifyJWT, historyForUser);   // 👈 REEMPLAZA EL STUB

router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id", patchOrder);
router.put("/:id", putOrder);
router.delete("/:id", deleteOrder);

export default router;
