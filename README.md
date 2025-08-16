# Ecommerce-PrograWeb

# Ecommerce-PrograWeb — Backend (Eco-Books)

Base project for **Node.js + Express API** following **feature-first best practices**, prepared to expand with services, controllers, models, and migrations.  

> !!! Business logic and real migrations are **not implemented yet**. The project currently provides a working structure with stub routes and is ready to be dockerized by another team member.

---

## Current Status

- Node.js (ESM) project with Express and basic middlewares (`express.json`, `morgan`).
- **Feature-first modular structure** (`modules/<feature>/{model,repo,service,controller,route}`).
- Base routes:
  - `GET /health` → healthcheck
  - `GET /books` → stub (returns message)
  - `GET /users` → stub (returns message)
- MySQL connection configured via Sequelize (can be skipped with `SKIP_DB` env var).
- `sequelize-cli` configuration ready (`.sequelizerc` + `src/config/sequelize-cli-config.js`).
- Empty folders created for **migrations/seeders/scripts**.
