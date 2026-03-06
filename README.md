# XP Arena

Production-hardened Node.js + Express platform for competitive gaming features (auth, guilds, tournaments, shop, profiles) with a static frontend served from `public/`.

## Project structure

- `server.js` – API bootstrap, middleware, routing, health checks.
- `config/env.js` – centralized environment loading and validation.
- `db.js` – MySQL pool + query helper wrappers.
- `routes/` – feature route modules (`auth`, `user`, `guilds`, etc.).
- `middleware/` – shared middleware (`auth`, error response formatting).
- `services/` – domain services (economy, season, idempotency, security, push, email).
- `public/` – static frontend assets (HTML/CSS/JS).
- `tests/integration/` – API integration tests.
- `.github/workflows/ci.yml` – CI workflow for migrations + syntax + integration tests.

## Local development

### 1) Install dependencies

```bash
npm ci
```

### 2) Configure environment variables

```bash
cp .env.example .env
# then edit .env with your DB + JWT settings
```

### 3) Prepare the database schema

```bash
npm run migrate
```

### 4) Start the app

```bash
npm run dev
```

Then open: <http://localhost:3000>

## Build and test

```bash
npm run build            # syntax validation
npm run test             # all test files
npm run test:integration # integration health checks
```

## Deployment guide

### Required environment variables

Set all values from `.env.example` in your deployment platform (Vercel/Render/Fly/etc.).

At minimum in production:

- `NODE_ENV=production`
- `JWT_SECRET` (required, app exits if missing)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `ALLOWED_ORIGINS` (comma-separated list of trusted front-end origins)

### Deploy steps

1. Provision a MySQL-compatible database.
2. Configure environment variables in the host.
3. Run migration step: `npm run migrate`.
4. Start app with: `npm start`.
5. Verify health:
   - `/health`
   - `/api/health`
   - `/api/health/details`

## CI

CI runs on every push/PR and performs:

1. dependency install,
2. MySQL readiness check,
3. migrations,
4. syntax build check,
5. integration tests.
