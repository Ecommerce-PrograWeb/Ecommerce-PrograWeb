﻿import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";   // 👈 NEW
import router from "./index.js";
import { errorHandler } from "./core/errors/error-handler.js";

const app = express();

// CORS: permite enviar/recibir cookies desde el front (http://localhost:3001)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true, // 👈 NECESARIO para cookies
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());          // 👈 NECESARIO antes del router

app.use("/", router);
app.use(errorHandler);

export default app;
