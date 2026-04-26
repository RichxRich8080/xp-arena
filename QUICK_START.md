# XP Arena - Quick Start Guide

## Prerequisites
- Node.js 20+ installed
- TiDB Cloud account with valid credentials

## Step 1: Configure Database

Edit `.env` file with your TiDB Cloud credentials:

```env
DB_HOST=your-gateway-host.tidbcloud.com
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=xp_arena
DB_PORT=4000
DB_SSL=true
DB_SSL_INSECURE=false          # Set to false in production
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Step 2: Verify Database Connection

```bash
npm run db:test
```

You should see: `✓ Database connection successful`

## Step 3: Run Database Migrations

```bash
npm run migrate
```

This creates all necessary tables in your TiDB Cloud database.

## Step 4: Start Development Servers

### Option A: Run Backend & Frontend Together
```bash
npm run dev:all
```

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev
```
Backend runs on: `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev --workspace=frontend
```
Frontend runs on: `http://localhost:5173`

## Step 5: Test the Application

1. Open `http://localhost:5173` in your browser
2. Click "Sign up" to create an account
3. After signup, you should be redirected to Dashboard
4. Dashboard should load your user profile

## What's Been Fixed

✓ Frontend proxy configuration (was pointing to wrong port)
✓ API error handling with automatic retries
✓ Missing `/api/user/status` endpoint
✓ Environment variable validation
✓ Database SSL configuration
✓ Database migration script
✓ Better error messages throughout

## Troubleshooting

### Database Connection Error
```
Error: Access denied for user...
```
**Solution:** Check your TiDB Cloud credentials in `.env` file

### API Requests Failing
```
Error: Cannot find module '../config/db'
```
**Solution:** Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Frontend Can't Reach Backend
**Solution:** Ensure backend is running on port 3001:
```bash
# Terminal 1 - verify this is running
npm run dev

# Terminal 2 - should connect successfully
npm run dev --workspace=frontend
```

### Port Already in Use
```bash
# Kill process on port 3001 (macOS/Linux)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (macOS/Linux)
lsof -ti:5173 | xargs kill -9
```

## Development Tips

- Frontend hot-reloads automatically on file changes
- Backend requires manual restart after code changes
- Check browser console for API errors (F12 or Cmd+Option+I)
- Check server logs for backend errors
- Database logs available in TiDB Cloud dashboard

## Next Steps

1. **Create Test User:** Sign up with test account
2. **Explore Dashboard:** View your profile and stats
3. **Test Features:** Try different app sections
4. **Run Integration Tests:** `npm run test:integration`

## Useful Commands

```bash
npm run dev              # Start backend
npm run dev:all         # Start backend + frontend
npm run migrate         # Run database migrations
npm run db:test         # Test database connection
npm run build           # Build frontend for production
```

## Common Endpoints

- `GET /api/user/status` - Get current user status
- `GET /api/user/profile` - Get full user profile
- `POST /api/user/daily-login` - Record daily login
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login user
- `GET /health` - Server health check

## Architecture

```
Request Flow:
Browser → Vite Dev Server (5173) 
        → Proxy to Backend (3001)
        → Express Routes
        → MySQL (TiDB Cloud)
```

## Support

For issues, check:
1. `FIXES_AND_IMPROVEMENTS.md` - Detailed fix documentation
2. Console logs (browser: F12, server: terminal output)
3. Environment variables in `.env`
4. Database connection status: `npm run db:test`

---

Ready to build? Start with `npm run dev:all` 🚀

