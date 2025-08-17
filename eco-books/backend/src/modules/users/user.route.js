import { Router } from "express";
const router = Router();

//Ruta de prueba
router.get("/", (_req,res)=>res.json({ message: "List users (stub)" }));

export default router;
