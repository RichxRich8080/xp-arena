# TiDB Cloud Connection Setup Guide

## Current Status
Your XP Arena application is configured to use TiDB Cloud for the database. The environment variables have been set up in your Vercel project.

## Connection Issue: Server Closing Connection

If you're experiencing "Connection lost: The server closed the connection" errors, this is typically due to **TiDB Cloud's IP Whitelist** not allowing connections from your network or Vercel's deployment servers.

## How to Fix This

### Option 1: Whitelist Vercel IPs (Recommended for Production)

TiDB Cloud requires you to whitelist IP addresses that are allowed to connect. Vercel has multiple deployment regions with different IPs.

**Steps:**
1. Go to https://tidbcloud.com and log in
2. Navigate to your cluster → Security → IP Whitelist
3. Add these Vercel IP ranges:
   - `76.223.84.0/24` (Vercel Edge Network - Primary)
   - `173.245.48.0/20` (Cloudflare - Vercel Uses)
   - Or select "Allow All" for development (⚠️ NOT recommended for production)

### Option 2: Whitelist Your Local IP (For Local Development)

1. Go to https://tidbcloud.com → Your Cluster → Security → IP Whitelist
2. Find your current IP at https://whatismyipaddress.com
3. Add your IP address to the whitelist
4. Wait 1-2 minutes for the change to take effect
5. Try connecting again: `npm run db:test`

### Option 3: Use TiDB Proxy (Alternative)

TiDB Cloud offers a proxy endpoint that may have better compatibility:
1. In TiDB Cloud, find your cluster's **Proxy Endpoint** (different from the standard endpoint)
2. Update `DB_HOST` in your `.env` to use the proxy endpoint
3. Ensure the proxy IP is whitelisted

## Current Configuration

Your application is currently using:
- **Host**: `gateway01.eu-central-1.prod.aws.tidbcloud.com`
- **Port**: `4000`
- **User**: `2jDJxDFphxNiy1x.root`
- **Database**: `xp_arena`
- **SSL**: Required (Amazon RDS certificate)

## Testing the Connection

Once you've whitelisted the necessary IPs:

```bash
# Test connection locally
npm run db:test

# Run migrations to set up schema
npm run migrate

# Start the server
npm run dev
```

## Database Initialization

After connection is successful, the migration script will:
1. Create all required tables (users, tournaments, guilds, etc.)
2. Set up relationships and constraints
3. Initialize any default data

## SSL/TLS Settings

TiDB Cloud enforces SSL/TLS connections. Your configuration automatically includes:
- SSL mode enabled
- Certificate verification (can be relaxed for development with `rejectUnauthorized: false`)

## Still Having Issues?

If you've whitelisted IPs but still can't connect:

1. **Verify credentials**: Double-check username and password in TiDB Cloud console
2. **Check database exists**: Ensure `xp_arena` database is created in TiDB Cloud
3. **Verify port**: TiDB Cloud uses port `4000` (not standard MySQL 3306)
4. **Check user permissions**: Ensure the `2jDJxDFphxNiy1x.root` user has permissions for `xp_arena` database
5. **Contact TiDB Support**: https://support.tidbcloud.com

## Vercel Deployment

Your environment variables are already set in Vercel. The deployment will:
1. Use the whitelisted IP ranges from Vercel's infrastructure
2. Connect to TiDB Cloud during build time for migrations
3. Run migrations automatically before starting the application

Once IP whitelist is configured, simply push your code or redeploy from Vercel dashboard.
