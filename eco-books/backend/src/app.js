﻿import express from "express";
import morgan from "morgan";
import router from "./index.js";
import { errorHandler } from "./core/errors/error-handler.js";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
//CORS configured to send/receive cookies from the front end
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());   
app.use(cookieParser());   // to read the httpOnly cookie
app.use(morgan("dev"));    

app.use("/", router);
app.use(errorHandler);

export default app;