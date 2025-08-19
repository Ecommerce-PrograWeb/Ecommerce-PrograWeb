// src/modules/users/user.route.js
import { Router } from "express";
import * as controller from "./user.controller.js";

const router = Router();

router.get("/", controller.getUsers);
router.get("/:id", controller.getUserById);
router.post("/", controller.createUser);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

// auth
router.post("/auth/login", controller.login);

export default router; // ← importante para que el import por default funcione
