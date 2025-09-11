import { Router } from "express";
import * as controller from "../controller/user.controller.js";

const router = Router();

router.get("/", controller.getUsers);
router.get("/:id", controller.getUserById);
router.post("/", controller.createUser);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);


router.post("/auth/login", controller.login);

export default router;
