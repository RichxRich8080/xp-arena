# XP Arena - Project Architecture & Documentation

## Overview
The `xp-arena` project has been completely overhauled from a vanilla HTML/JS monolith into a modern, decoupled **React (Vite) + Express** application. The UI has been transformed into an immersive **game-style dashboard** utilizing glowing neon effects, dark mode aesthetics, and modular components.

---

## 🏗️ New Project Architecture

### Frontend (`/frontend`)
Powered by **React + Vite**, **Tailwind CSS**, and **React Router v6**.
- **`/src/pages/`**: 
  - `Dashboard.jsx`: The main landing hub mimicking the `.html` files.
  - `Tool.jsx`: The upgraded **Sensitivity Tool Engine** equipped with virtualization/debounce logic to support real-time searches across **11,900+ devices** without DOM lag.
- **Routing & Performance**: We implemented `react-router-dom` using `<Suspense>` and `React.lazy()` to automatically code-split the application. Initial payloads are tiny, and paths `/` and `/tool` load seamlessly without hard refreshes.
- **`/src/components/`**: Houses all our modular game UI elements (Navbar, XPBar, ErrorBoundary, GameCard).
- **Environment**: A `.env.example` is provided; `VITE_API_URL` handles backend target resolution.

### Backend (`/`)
The original robust **Express.js API** serves as the backend logic.
- **`server.js`**: Core entry point, configured with rate-limiting, CORS, and Helmet for security.
- **`tests/integration/`**: Newly added Jest + Supertest integration tests to ensure continuous stability without hanging connection leaks.
- **Security Hardening**: All known vulnerabilities (e.g., outdated `nodemailer`) have been patched, and unused dependencies (`serverless-http`) purged.

---

## 🚀 How to Run Locally

### 1. Start the Backend API
From the root directory (`/xp-arena/`):
```bash
npm install
npm run dev
```
*The Express API will run on `http://localhost:3000`.*

### 2. Start the Frontend Vite Server
Open a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
*The React UI will run on `http://localhost:5173`. API requests are automatically proxied to the backend.*

---

## 🧪 How to Run Tests

### Integration Tests
We've integrated a robust **Jest + Supertest** testing pipeline.
From the root directory (`/xp-arena/`), run:
```bash
npm run test:integration
```
This tests the API endpoints (e.g., `/health`) and ensures database connections are gracefully closed upon completion.

### GitHub Actions (CI/CD)
Whenever code is pushed to `main` or a Pull Request is opened, the automated workflow defined in `.github/workflows/ci.yml` will run the integration tests to prevent broken code from being merged.

---

## 🚢 Deployment Strategy

1. **Frontend**: Build the React app for production:
   ```bash
   cd frontend
   npm run build
   ```
   *This outputs optimized, minified static files into `frontend/dist/`.*
2. **Backend**: Keep running `server.js` via Node, but ensure `NODE_ENV=production`.
3. **Serving**: You can deploy the `frontend/dist` folders to Vercel/Netlify, and host the Express API on Render/Heroku/AWS. Ensure `CORS` is updated with your production URLs domain.
