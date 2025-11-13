# Ecommerce-PrograWeb

Full-stack example project for the Eco-Books e-commerce app. The repository contains two main apps inside `eco-books/`:

- `eco-books/frontend` — Next.js + React (App Router) frontend written in TypeScript/JSX with CSS Modules.
- `eco-books/backend` — Node.js + Express backend with a feature-first layout (Sequelize configured for MySQL migrations).

This README summarizes how to run both apps locally, how the Docker compose and GitHub Actions are wired, and common troubleshooting steps.

## Table of contents

- [Structure](#structure)
- [Local development](#local-development)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Docker (docker-compose)](#docker-docker-compose)
- [CI / GitHub Actions](#ci--github-actions)
- [Testing](#testing)
- [Troubleshooting & tips](#troubleshooting--tips)
- [Contributing](#contributing)
- [Database (migrations, seeds & rollbacks)](#database-migrations-seeds--rollbacks)


## Structure

Top-level layout (important files/folders):

- `eco-books/frontend` — Next.js app (App Router). Pages/components under `src/app`.
- `eco-books/backend` — Express API source under `src/` with migrations in `migrations/`.
- `.github/workflows` — GitHub Actions workflows for backend tests, frontend build, and Docker publish.
- `eco-books/docker-compose.yml` — Compose definition to run frontend and backend together.

## Local development

General note: the frontend requires Node 18+ and the backend uses Node (see package.json for exact versions used during development). The frontend build is configured to run TypeScript and linting during `next build` (some commands suppress linting in CI). Use `npm install` in each app before running.

### Frontend

1. Open a terminal in `eco-books/frontend`.
2. Install dependencies:

```powershell
cd eco-books/frontend; npm install
```

3. Run the dev server:

```powershell
npm run dev
```

4. Build for production (the Docker build also runs this step):

```powershell
npm run build
```

Notes:
- The frontend uses the App Router; some pages are client components (`"use client"`).
- If `next build` fails with SSR/prerender errors mentioning hooks like `useSearchParams()` or `useRouter()` — ensure those hooks are used only inside client components or inside client-safe effects. See `eco-books/frontend/src/app/login/page.tsx` for an example fix.

### Backend

1. Open a terminal in `eco-books/backend`.
2. Install dependencies and run dev server:

```powershell
cd eco-books/backend; npm install
npm run dev
```

3. Run migrations (if you have a configured MySQL instance):

```powershell
npm run migrate
```

Environment variables:
- Copy any env example you have (e.g. `.env.example` → `.env`) and configure `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` as needed. 

## Docker (docker-compose)

You can run both services together using the repository `docker-compose.yml`.

From the repository root:

```powershell
cd eco-books
docker-compose up --build
```

Behavior:
- The Docker build runs `npm run build` for the frontend. If you get build errors inside Docker, reproduce them locally in `eco-books/frontend` with `npm run build` to obtain clearer logs.
- The repository CI is configured so that the Docker workflow only runs when the compose file or Dockerfiles change (see `.github/workflows/ci.yml`). This avoids rebuilding/pushing images on every code change.

## CI / GitHub Actions

Workflows are in `.github/workflows`:

- `backend-tests.yml` — runs backend unit/routes tests; triggers when files under `eco-books/backend/**` change.
- `frontend-build.yml` — runs frontend build/test steps; triggers when files under `eco-books/frontend/**` change.
- `ci.yml` — Docker build & push pipeline; configured to run only when Dockerfiles or `docker-compose.yml` change.

If you need the Docker pipeline to run for more changes, adjust the `paths` section in `.github/workflows/ci.yml`.

## Testing

- Backend tests (Vitest + Jest for route tests):

```powershell
cd eco-books/backend
npm run test:unit
npm run test:routes
```

- Frontend UI tests (Vitest):

```powershell
cd eco-books/frontend
npm run test
```


## Database (migrations, seeds, rollbacks & resets)

Stack: MySQL 8 + Sequelize CLI
Safe FK order: Role → User → Author/Publisher/Category → Book → Cart → Inventory → Address → OrderDetail → Order → Payment
MySQL (Docker): host=localhost port=3307 user=root pass=MySQL db=eco_books

### Running with Docker (recommended)

The backend runs db:migrate at startup and, if SEED_DB=true, also runs db:seed:all.

```powershell
# start everything
docker compose up -d --build

# (optional) run manually inside the container
docker compose exec backend npx sequelize-cli db:migrate
docker compose exec backend npx sequelize-cli db:seed:all
```

### Toggle seeding without rebuild
```powershell
# reseed manually
docker compose exec backend npx sequelize-cli db:seed:undo:all
docker compose exec backend npx sequelize-cli db:seed:all
```
Tip: after populating data, set SEED_DB=false to avoid reseeding on each start.


### Rollback

```powershell
# last batch
docker compose exec backend npx sequelize-cli db:migrate:undo
# all
docker compose exec backend npx sequelize-cli db:migrate:undo:all
# up to a specific file (inclusive)
docker compose exec backend npx sequelize-cli db:migrate:undo:all --to 20250101-06-create-book.cjs
# seeds
docker compose exec backend npx sequelize-cli db:seed:undo:all
docker compose exec backend npx sequelize-cli db:seed:undo --seed 20250102-02-books.cjs

```

### Quick reset (keep volume)

```powershell
docker compose exec backend npx sequelize-cli db:migrate:undo:all
docker compose exec backend npx sequelize-cli db:migrate
docker compose exec backend npx sequelize-cli db:seed:all
```


### Hard reset (from scratch)

Option A (recommended): remove MySQL volume

```powershell
docker compose down -v
docker compose up -d --build
```

Option B: drop & recreate the DB

```powershell
docker compose exec db mysql -uroot -pMySQL -e "DROP DATABASE IF EXISTS eco_books; CREATE DATABASE eco_books CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
docker compose exec backend npx sequelize-cli db:migrate
docker compose exec backend npx sequelize-cli db:seed:all
```


### Verification
```powershell
# migrations applied (should return 12)
docker compose exec db mysql -uroot -pMySQL -D eco_books -e "SELECT COUNT(*) AS migrations FROM SequelizeMeta;"

# tables
docker compose exec db mysql -uroot -pMySQL -D eco_books -e "SHOW TABLES;"

# expected seeded counts
docker compose exec db mysql -uroot -pMySQL -D eco_books -e ^
"SELECT COUNT(*) roles FROM Role;
 SELECT COUNT(*) authors FROM Author;
 SELECT COUNT(*) books FROM Book;"
# Expected: roles=2, authors=15, books=18
```


### (Optional) Running outside Docker

If you have local MySQL/Node:

```powershell
# .env
# DB_HOST=localhost
# DB_PORT=3307
# DB_NAME=eco_books
# DB_USER=root
# DB_PASS=MySQL
cd eco-books/backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```