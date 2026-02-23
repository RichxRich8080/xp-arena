# Netlify Environment Variables Template

To run the XP Arena backend on Netlify with MySQL, you must add the following **Environment Variables** in your [Netlify Site Settings](https://app.netlify.com/):

| Variable | Description |
| :--- | :--- |
| `DB_HOST` | Your MySQL database host (e.g., `aws.connect.planetscale.com`) |
| `DB_USER` | Your database username |
| `DB_PASSWORD` | Your database password |
| `DB_NAME` | Your database name (e.g., `xp_arena`) |
| `DB_PORT` | Usually `3306` |
| `JWT_SECRET` | A long random string for securing login tokens |
| `NODE_ENV` | Set to `production` |

### Database Providers
Since Netlify is serverless, you need a cloud MySQL provider. Recommended options:
- **PlanetScale** (Highly recommended for serverless)
- **Supabase** (Choose the MySQL compatible mode)
- **Aiven / DigitalOcean Managed DB**

Once these are set, your site will connect automatically!
