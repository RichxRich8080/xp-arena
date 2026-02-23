# Vercel Environment Variables Guide

To run the XP Arena backend on Vercel with MySQL, you must add the following variables in your **Vercel Project Settings**.

### Option A: The "Quick" Way (Recommended)
You can copy the content of the `.env` file I created in your project folder and paste it directly into Vercel:
1. Open the `.env` file in VS Code.
2. Copy all the text.
3. In the Vercel screenshot you sent, look at the bottom and click **"Import .env"** (or just paste the text into the first box). It will automatically fill in all the keys for you!

### Option B: Hand-type one by one
If you prefer to type them, here are the **Keys** you need:

| Key | Description |
| :--- | :--- |
| `DB_HOST` | Your MySQL database host |
| `DB_USER` | Your database username |
| `DB_PASSWORD` | Your database password |
| `DB_NAME` | Your database name |
| `DB_PORT` | Usually `3306` |
| `JWT_SECRET` | A random string (e.g., `xparena123!`) |
| `NODE_ENV` | `production` |

### Database Providers
Since Vercel is serverless, you need a cloud MySQL provider. Recommended options:
- **TiDB Cloud**
- **Aiven**
- **PlanetScale**

Once these are set, go to the **Deployments** tab and redeploy!

