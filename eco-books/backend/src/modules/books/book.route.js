import { Router } from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const BookController = require("./book.controller.js"); // CJS -> require()

const router = Router();

router.get("/", BookController.getAll);
router.get("/:id", BookController.getById);
router.post("/", BookController.create);

export default router;