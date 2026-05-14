# Deploying to Vercel

## Architecture

```
Vercel (Next.js)         Render / Railway / Fly.io        MongoDB Atlas
┌──────────────────┐     ┌──────────────────────┐         ┌─────────────┐
│  Frontend         │────▶│  Backend API         │────────▶│  Database   │
│  (apps/web)       │     │  (services/api)      │         │             │
│  next@14 / TS     │     │  Express / Node      │         └─────────────┘
└──────────────────┘     └──────────────────────┘
```

**Vercel limitation:** Next.js serverless functions can't maintain persistent WebSocket or long-running server processes. The Express backend runs separately on a Node host (Render, Railway, Fly.io, or a VPS). Frontend communicates via API calls over HTTP.

---

## Step 1 — Deploy Backend API

### Option A: Render (recommended — free tier available)

1. Sign up at [render.com](https://render.com)
2. Connect your GitHub repo (or upload the `services/api` folder directly)
3. Create a **Web Service**
   - **Root Directory:** `services/api`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

4. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.xxxxx.mongodb.net/african-realestate
   JWT_SECRET=your-secure-random-string-min-32-chars
   NODE_ENV=production
   PORT=3001
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

5. Deploy — copy the deployed URL (e.g., `https://african-realestate-api.onrender.com`)

---

### Option B: Railway

1. Sign up at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Set root directory to `services/api`
4. Add env vars (same as above)
5. Deploy

---

### Option C: Fly.io

```bash
cd services/api
fly launch
fly secrets set JWT_SECRET="your-secret" MONGODB_URI="mongodb+srv://..." CLOUDINARY_CLOUD_NAME="..." ...
fly deploy
```

---

## Step 2 — Update Frontend Env

After backend is deployed, update `apps/web/.env.vercel`:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

Push to GitHub / redeploy.

---

## Step 3 — Deploy Frontend to Vercel

### Via GitHub (recommended)

1. Push the entire `african-realestate-platform` repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the repo
4. Framework: **Next.js**
5. Root Directory: `apps/web`
6. Add Environment Variables (from `.env.vercel`):
   - `NEXT_PUBLIC_API_URL` = your backend URL
7. Deploy

### Via Vercel CLI

```bash
cd apps/web
vercel --prod
```

---

## Step 4 — MongoDB Atlas Setup

1. Sign up at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster (AWS, closest region to your users)
3. Create a database user:
   - Username + password (save these!)
4. Network Access → Add `0.0.0.0/0` (allow all IPs for now)
5. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/african-realestate
   ```
6. Add to backend env vars on Render

---

## Step 5 — Seed the Database

Once backend is running:

```bash
curl -X POST https://your-backend-url.onrender.com/api/seed
# OR
npm run seed-simple  # if using the repo locally
```

Or create a simple seed endpoint by adding to `server.js`:

```javascript
// Add temporarily for deployment seed
if (process.env.SEED_ON_START === 'true') {
  require('./seed-simple')();
}
```

---

## Step 6 — Verify Deployment

1. Open your Vercel frontend URL
2. Check browser console for API errors
3. Test: browse properties, register a user, list a property
4. Check Render logs if something breaks

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `api/properties 500` | Check backend logs on Render — usually MongoDB URI wrong |
| `401 Unauthorized` on all requests | JWT_SECRET differs between backend deploy and frontend; set `JWT_SECRET` env var on backend |
| CORS errors | Update `CORS_ORIGINS` env var on backend to include your Vercel domain |
| Images not uploading | Add Cloudinary env vars on backend |
| Page loads but no data | Check `NEXT_PUBLIC_API_URL` points to deployed backend URL (not localhost) |

---

## Production Checklist

- [ ] Backend URL updated in `apps/web/.env.vercel`
- [ ] `JWT_SECRET` set on backend (at least 32 random chars)
- [ ] `CORS_ORIGINS` includes Vercel frontend URL
- [ ] MongoDB Atlas cluster IP whitelist includes backend server IP
- [ ] Cloudinary env vars set on backend
- [ ] Seed script run to populate demo data
- [ ] HTTPS forced (Vercel does this automatically)

---

## Recommended: Custom Domain

Vercel (free tier) gives you a URL like: `african-realestate-platform.vercel.app`

You can add a custom domain (e.g., `propertyplatformgh.com`) via:
- Vercel Dashboard → Project → Settings → Domains
- Point your domain's DNS to Vercel as instructed

Backend can get a custom domain too (Render paid plans or use Cloudflare to proxy a subdomain to the Render URL).