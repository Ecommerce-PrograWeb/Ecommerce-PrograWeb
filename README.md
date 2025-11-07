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

## Structure

Top-level layout (important files/folders):

- `eco-books/frontend` — Next.js app (App Router). Pages/components under `src/app`.
- `eco-books/backend` — Express API source under `src/` with migrations in `migrations/`.
- `.github/workflows` — GitHub Actions workflows for backend tests, frontend build, and Docker publish.
- `docker-compose.yml` — Compose definition to run frontend and backend together.

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
- Copy any env example you have (e.g. `.env.example` → `.env`) and configure `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` as needed. The backend respects `SKIP_DB` to skip DB connection during local dev.

## Docker (docker-compose)

You can run both services together using the repository `docker-compose.yml`.

From the repository root:

```powershell
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
