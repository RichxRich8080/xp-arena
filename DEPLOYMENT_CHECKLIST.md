# XP Arena Deployment Checklist

## Pre-Deployment Requirements

### 1. TiDB Cloud IP Whitelist Configuration
- [ ] Log in to https://tidbcloud.com
- [ ] Navigate to your cluster settings → Security → IP Whitelist
- [ ] Add Vercel IPs or "Allow All" for testing:
  - For production: Add specific Vercel IP ranges (see TIDB_SETUP_GUIDE.md)
  - For development: Add your local IP from https://whatismyipaddress.com
- [ ] Wait 1-2 minutes for changes to take effect

### 2. Environment Variables in Vercel
- [ ] Go to your Vercel project → Settings → Environment Variables
- [ ] Verify these are set (they should already be configured):
  ```
  DB_HOST = gateway01.eu-central-1.prod.aws.tidbcloud.com
  DB_USER = 2jDJxDFphxNiy1x.root
  DB_PASSWORD = Drb0ljTi0tX4wOzF
  DB_NAME = xp_arena
  DB_PORT = 4000
  DB_SSL = true
  DB_SSL_INSECURE = true (for development, remove for production)
  JWT_SECRET = xparena_ultra_secure_777
  NODE_ENV = production
  ```

### 3. GitHub Repository Status
- [ ] All code changes are committed
- [ ] No uncommitted changes in your branch
- [ ] Latest changes are pushed to your GitHub branch

### 4. Local Testing (Optional but Recommended)
```bash
# After whitelisting your local IP:
npm run db:test          # Test database connection
npm run migrate          # Run database migrations
npm run dev              # Start dev servers
```

## Deployment Steps

### Option A: Deploy from Vercel Dashboard (Easiest)
1. Go to https://vercel.com/dashboard
2. Find your XP Arena project
3. Click the latest deployment or push a new commit
4. Vercel will automatically:
   - Install dependencies
   - Run the build
   - Deploy to production
   - Run any configured post-deployment scripts

### Option B: Deploy from GitHub
1. Make sure all changes are committed: `git add .`
2. Commit changes: `git commit -m "Fix: Complete XP Arena setup with TiDB integration"`
3. Push to your branch: `git push`
4. Vercel will automatically detect the push and deploy

### Option C: Manual Vercel CLI Deployment
```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

## Post-Deployment Verification

### 1. Check Deployment Status
- [ ] Go to https://vercel.com/dashboard/your-project
- [ ] Verify all deployments show green checkmarks
- [ ] No failed CI/CD checks

### 2. Test the Live Application
- [ ] Visit your production URL
- [ ] Test login functionality
- [ ] Check if dashboard loads
- [ ] Verify API calls work (check browser console)

### 3. Check Application Logs
- [ ] In Vercel dashboard, go to Deployments → Select latest → Functions
- [ ] Look for any connection errors or failed migrations
- [ ] Check the server logs for warnings

### 4. Verify Database Operations
- [ ] Create a new user account
- [ ] Log in with the account
- [ ] Check user profile loads data
- [ ] Verify daily login streak increments

## Troubleshooting

### Deployment Fails with Connection Error
**Cause**: TiDB Cloud IP whitelist not configured
**Solution**: 
1. Check TIDB_SETUP_GUIDE.md
2. Whitelist Vercel IPs in TiDB Cloud
3. Redeploy from Vercel

### 502 Bad Gateway Error
**Cause**: Backend server not starting due to DB connection
**Solution**:
1. Check Vercel function logs
2. Verify environment variables are set
3. Check TiDB connection is working
4. Verify database credentials are correct

### Application Loads but No Data
**Cause**: Database migration didn't run
**Solution**:
1. Run `npm run migrate` locally to test
2. Check migration script for errors
3. Verify database tables exist in TiDB Cloud

## Rollback Plan

If something goes wrong:
1. Go to Vercel dashboard
2. Select your project
3. Find the last working deployment
4. Click the three dots menu → Promote to Production
5. The previous working version will be restored

## Success Criteria

Your deployment is successful when:
- [ ] Application loads without errors
- [ ] User can log in
- [ ] Dashboard displays user data
- [ ] API calls complete successfully
- [ ] No 502/500 errors in browser console
- [ ] Database tables exist and contain data

## Notes

- Database migrations run automatically during deployment
- All environment variables are securely stored in Vercel
- SSL is enforced for TiDB connections
- The application will retry failed database connections up to 3 times

For detailed guides, see:
- `TIDB_SETUP_GUIDE.md` - TiDB Cloud configuration
- `FIXES_AND_IMPROVEMENTS.md` - All code changes made
- `CHANGES_SUMMARY.md` - File-by-file modification list
