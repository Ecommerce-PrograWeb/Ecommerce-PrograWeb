import { Router } from "express";
const router = Router();

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({ message: "Cart route working!" });});

export default router;