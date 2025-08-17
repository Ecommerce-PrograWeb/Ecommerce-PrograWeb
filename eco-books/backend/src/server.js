import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/database.js";

const PORT = process.env.APP_PORT || 3000;

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
})();
