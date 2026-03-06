# Environment Variables

Use `.env.example` as the source of truth for local + production configuration.

## Core variables

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `development`, `test`, or `production`. |
| `PORT` | No | HTTP port (`3000` default). |
| `JWT_SECRET` | Yes in production | JWT signing secret. App exits in production when missing. |
| `ALLOWED_ORIGINS` | Yes in production | Comma-separated CORS allowlist. |
| `ADMIN_USERNAME` | No | Optional owner/admin username override. |

## Database variables

| Variable | Required | Description |
|---|---|---|
| `DB_HOST` | Yes | Database host. |
| `DB_PORT` | No | Database port (`3306` default). |
| `DB_USER` | Yes | Database username. |
| `DB_PASSWORD` | Yes | Database password. |
| `DB_NAME` | Yes | Database/schema name. |
| `DB_CONNECTION_LIMIT` | No | Pool size (`10` default). |
| `DB_SSL_REJECT_UNAUTHORIZED` | No | `true`/`false` for TLS certificate verification. |

## Local setup

```bash
cp .env.example .env
npm ci
npm run migrate
npm run dev
```

## Production setup

1. Add all variables from `.env.example` in your platform.
2. Set `NODE_ENV=production`.
3. Set a strong `JWT_SECRET`.
4. Restrict `ALLOWED_ORIGINS` to trusted domains.
5. Run `npm run migrate` during deployment.
