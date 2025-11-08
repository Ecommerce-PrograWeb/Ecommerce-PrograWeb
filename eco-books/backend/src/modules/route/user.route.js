
import { Router } from "express";
import * as controller from "../controller/user.controller.js";

const router = Router();

router.get("/", controller.getUsers);
router.get("/:id", controller.getUserById);
router.post("/", controller.createUser);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

// Nota: Los endpoints de autenticación (login, register, logout) están en /auth

export default router; //  para que el import por default funcione
