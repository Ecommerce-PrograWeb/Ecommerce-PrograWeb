import { Router } from "express";
const router = Router();

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({ message: "Orders route working!" });
});

export default router;