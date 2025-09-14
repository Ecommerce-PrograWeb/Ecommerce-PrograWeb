﻿import express from "express";
import morgan from "morgan";
import router from "./index.js";
import { errorHandler } from "./core/errors/error-handler.js";
import cors from 'cors';

const app = express();

app.use(cors()); // Allow requests from frontend
app.use(express.json());
app.use(morgan("dev"));

app.use("/", router);
app.use(errorHandler);

export default app;