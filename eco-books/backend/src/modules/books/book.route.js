import { Router } from "express";
const router = Router();

//Ruta de prueba
router.get("/", (_req,res)=>res.json({ message: "List books (stub)" }));

export default router;
