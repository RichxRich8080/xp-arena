# XP Arena Frontend

React + Vite frontend for XP Arena.

## Scripts
- `npm run dev` - start Vite dev server.
- `npm run build` - production build.
- `npm run preview` - preview built app.
- `npm run lint` - run ESLint.

## Environment Variables
- `VITE_API_URL` - backend base URL (default: `/api`).
- `VITE_USE_MOCK_API` - optional (`true`/`false`), uses mocked API responses when `true`.

## Notes
- Routing uses `react-router-dom`.
- Auth/session and setup submission calls are handled via `src/services/api.js`.
