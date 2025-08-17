import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    port: +process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false
  }
);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✓ DB connected");
  } catch (e) {
    console.error("✗ DB error:", e.message);
    process.exit(1);
  }
}
