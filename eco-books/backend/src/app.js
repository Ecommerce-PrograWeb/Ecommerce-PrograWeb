import express from "express";
import morgan from "morgan";
import router from "./index.js";
import { errorHandler } from "./core/errors/error-handler.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/", router);
app.use(errorHandler);

export default app;
