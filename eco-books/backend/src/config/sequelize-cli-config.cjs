require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: { decimalNumbers: true },
    define: { charset: "utf8mb4", collate: "utf8mb4_0900_ai_ci" },
    logging: console.log
  }
};
