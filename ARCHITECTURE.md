# XP Arena - Architecture Notes

## Overview
XP Arena is a monorepo with an Express backend and a React + Vite frontend.

## Project Structure
- `server/`: Express API, middleware, services, and route modules.
- `frontend/`: React SPA (Vite, Tailwind CSS, react-router-dom).
- `tests/integration/`: Jest + Supertest integration tests against the Express app.

## Frontend
- Routing is handled with `react-router-dom` (current dependency v7).
- Auth-gated pages use a `PrivateRoute` wrapper.
- API communication is centralized in `frontend/src/services/api.js`.
- Optional mock mode can be enabled with `VITE_USE_MOCK_API=true`.

## Backend
- Entry point: `server/app.js`.
- Common hardening: Helmet, CORS policy, compression, and API rate limiting.
- Auth endpoints are mounted under `/api/auth` and include dedicated rate limits.
- Database access is handled via a MySQL/TiDB connection pool in `server/config/db.js`.

## Local Development
### Install
```bash
npm install
npm install --workspace frontend
```

### Run backend
```bash
npm run dev
```

### Run frontend
```bash
npm run dev --workspace frontend
```

## Testing
Run integration tests from repository root:
```bash
npm run test:integration
```

## Production Configuration
- Do not commit real secrets.
- Use deployment secret managers for DB credentials, JWT secrets, and VAPID keys.
- TLS certificate verification is enabled by default for DB SSL.
