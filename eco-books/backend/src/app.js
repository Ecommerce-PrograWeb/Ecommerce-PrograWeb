﻿import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./index.js";
import { errorHandler } from "./core/errors/error-handler.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use((req, _res, next) => {
  console.log("→", req.method, req.path);
  next();
});

app.use("/", router);
app.use((req, res) =>
  res.status(404).json({ message: "Not Found", path: req.path })
);
app.use(errorHandler);

export default app;
