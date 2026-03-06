# XP Arena Architecture & Upgrade Notes

## Technical scan report (short)

- Integration tests were creating one Express server per test and did not explicitly close DB resources from the shared MySQL pool, which is a CI hang risk when test count grows.
- The repository has a mixed frontend shell (`public/js/layout.js` for most pages and `public/js/site-shell.js` for index), which causes visual drift.
- There is a broad page surface in `public/*.html`; shared UI consistency is best achieved through common layout/CSS layers instead of per-page rewrites.
- One dependency (`serverless-http`) was present but unused.
- Static assets and pages are still flat under `public/`; this is acceptable for legacy compatibility but should continue migrating toward grouped page/component assets.

## Current structure

```text
config/            environment loading and validation
middleware/        auth and API response helpers
routes/            domain route modules
services/          economy/security/idempotency/email/push
public/            static pages + CSS + JS layout shells
tests/integration/ API integration tests
scripts/           build/syntax scripts
```

## Target scalable structure (incremental migration)

```text
src/
  api/
  components/
  layouts/
  pages/
  services/
  utils/
  assets/
  styles/
  config/
```

Use aliases and move modules gradually while keeping existing route paths stable.

## Game-style UI component system

Shared reusable shell components are now centered around:

- **TopBar** (`layout.js` + `.rebirth-top-bar`) with level badge and XP progress bar.
- **CommandDock** (`.command-dock` + `.game-nav-item`) for game-like navigation.
- **Game Cards** (`.card`, `.pulse-card`, `.feature-card`) with neon border/glow overlays.
- **Buttons/Inputs** upgraded with interactive hover/focus motion and contrast.

## Runbook

### Local

```bash
npm ci
cp .env.example .env
npm run migrate
npm run dev
```

### Validation

```bash
npm run build
npm run test:integration
npm test
```

### Deploy

1. Set production env vars (`JWT_SECRET`, DB, CORS origins).
2. Run `npm run migrate` on target database.
3. Run `npm start`.
4. Verify `/health`, `/api/health`, `/api/health/details`.
