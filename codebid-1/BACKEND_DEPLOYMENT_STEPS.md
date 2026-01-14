# Backend Deployment & Frontend Connection Guide

## Overview

This guide walks you through deploying the backend to Vercel and connecting it with your frontend.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Your Application                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (React)                Backend (Express)       │
│  codebid.vercel.app      ←→      codebid-api.vercel.app │
│  Port: 443 (HTTPS)               Port: 443 (HTTPS)      │
│                                                          │
│  WebSocket Connection                                    │
│  Socket.io Client        ←→      Socket.io Server       │
│                                                          │
│                    ↓                                      │
│                                                          │
│              PostgreSQL Database                         │
│              (Neon/Supabase/AWS RDS)                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Part 1: Set Up PostgreSQL Database

### Option A: Neon (Recommended - Free Tier Available)

1. **Go to Neon**: https://neon.tech
2. **Sign up** with GitHub
3. **Create a new project**
   - Project name: `codebid`
   - Region: Choose closest to you
4. **Copy connection string**
   - Format: `postgresql://user:password@host/database`
5. **Save for later** (you'll need this)

### Option B: Supabase

1. **Go to Supabase**: https://supabase.com
2. **Create new project**
   - Project name: `codebid`
   - Database password: Create strong password
3. **Wait for database to be created** (2-3 minutes)
4. **Get connection string**
   - Go to Settings → Database → Connection String
   - Copy PostgreSQL connection string
5. **Save for later**

### Option C: AWS RDS

1. **Create RDS PostgreSQL instance**
2. **Configure security groups** to allow inbound on port 5432
3. **Get endpoint and credentials**
4. **Save for later**

## Part 2: Deploy Backend to Vercel

### Step 1: Create New Vercel Project

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Click "Add New"** → **"Project"**
3. **Select "Import Git Repository"**
4. **Choose your GitHub repository** (CODEBID)
5. **Click "Import"**

### Step 2: Configure Project Settings

1. **Framework Preset**: Select "Other"
2. **Root Directory**: Click "Edit" and set to `codebid-1/backend`
3. **Build Command**: Leave as `npm install`
4. **Output Directory**: Leave empty
5. **Install Command**: `npm install`

### Step 3: Add Environment Variables

**This is CRITICAL - Don't skip this!**

1. **Click "Environment Variables"**
2. **Add each variable** (copy-paste from below):

```
PORT=3000
NODE_ENV=production
FRONTEND_ORIGIN=https://codebid.vercel.app
JWT_SECRET=your-super-secret-key-change-this-12345
DB_HOST=your-neon-host.neon.tech
DB_PORT=5432
DB_NAME=codebid
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

**Where to get these values:**

- **DB_HOST**: From Neon/Supabase connection string (the hostname part)
- **DB_USER**: From connection string (before the @)
- **DB_PASSWORD**: From connection string (between : and @)
- **DB_NAME**: From connection string (after the last /)
- **JWT_SECRET**: Create any random string (e.g., `abc123xyz789def456`)
- **FRONTEND_ORIGIN**: Will be your frontend URL (we'll update this later)

**Example from Neon connection string:**
```
postgresql://neon_user:neon_password@ep-cool-name.neon.tech/codebid?sslmode=require
                      ↑              ↑                        ↑
                   PASSWORD        HOST                    DATABASE
```

### Step 4: Deploy Backend

1. **Click "Deploy"**
2. **Wait for deployment** (2-5 minutes)
3. **Check for errors** in the build logs
4. **Copy the deployment URL** (e.g., `https://codebid-api.vercel.app`)

### Step 5: Verify Backend is Running

1. **Open in browser**: `https://your-backend-url.vercel.app/health`
2. **Should see**: `{"ok":true}`
3. **If error**: Check logs in Vercel dashboard

## Part 3: Set Up Database Schema

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Run migrations** (from your local machine):
   ```bash
   # Connect to your database
   psql "postgresql://user:password@host/database" < backend/sql/001_init.sql
   psql "postgresql://user:password@host/database" < backend/sql/002_seed.sql
   psql "postgresql://user:password@host/database" < backend/sql/003_add_team_details.sql
   psql "postgresql://user:password@host/database" < backend/sql/003_add_user_details.sql
   ```

### Option B: Using Neon Console

1. **Go to Neon dashboard**
2. **Click "SQL Editor"**
3. **Copy-paste content from** `backend/sql/001_init.sql`
4. **Click "Execute"**
5. **Repeat for all SQL files** (002, 003_add_team_details, 003_add_user_details)

### Option C: Using Supabase Console

1. **Go to Supabase dashboard**
2. **Click "SQL Editor"**
3. **Click "New Query"**
4. **Copy-paste content from** `backend/sql/001_init.sql`
5. **Click "Run"**
6. **Repeat for all SQL files**

## Part 4: Deploy Frontend to Vercel

### Step 1: Create New Vercel Project

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Click "Add New"** → **"Project"**
3. **Select "Import Git Repository"**
4. **Choose your GitHub repository** (CODEBID)
5. **Click "Import"**

### Step 2: Configure Project Settings

1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Click "Edit" and set to `codebid-1`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Step 3: Add Environment Variables

1. **Click "Environment Variables"**
2. **Add these variables**:

```
VITE_API_BASE=https://your-backend-url.vercel.app
VITE_WS_BASE=https://your-backend-url.vercel.app
```

**Replace** `your-backend-url` with your actual backend URL from Part 2, Step 4.

### Step 4: Deploy Frontend

1. **Click "Deploy"**
2. **Wait for deployment** (2-5 minutes)
3. **Copy the frontend URL** (e.g., `https://codebid.vercel.app`)

### Step 5: Update Backend Environment Variable

Now that you have the frontend URL, update the backend:

1. **Go to backend project** in Vercel
2. **Click "Settings"** → **"Environment Variables"**
3. **Edit** `FRONTEND_ORIGIN`
4. **Change to**: `https://your-frontend-url.vercel.app`
5. **Click "Save"**
6. **Redeploy backend**:
   - Click "Deployments"
   - Click the latest deployment
   - Click "Redeploy"

## Part 5: Connect Frontend to Backend

### Step 1: Verify Connection

1. **Open frontend**: `https://codebid.vercel.app`
2. **Open browser console**: F12 → Console tab
3. **Try to login**
4. **Check for errors** in console

### Step 2: Test API Connection

**In browser console**, run:
```javascript
fetch('https://your-backend-url.vercel.app/health')
  .then(r => r.json())
  .then(d => console.log('Backend OK:', d))
  .catch(e => console.error('Backend Error:', e))
```

**Expected output**: `Backend OK: {ok: true}`

### Step 3: Test WebSocket Connection

**In browser console**, run:
```javascript
const socket = io('https://your-backend-url.vercel.app', {
  auth: { token: localStorage.getItem('token') }
});

socket.on('connect', () => console.log('WebSocket Connected!'));
socket.on('disconnect', () => console.log('WebSocket Disconnected'));
socket.on('error', (err) => console.error('WebSocket Error:', err));
```

**Expected output**: `WebSocket Connected!`

## Part 6: Troubleshooting

### Issue: "Failed to fetch" error

**Cause**: Backend URL is wrong or backend is down

**Solution**:
1. Check backend URL in frontend environment variables
2. Verify backend is deployed: `https://backend-url.vercel.app/health`
3. Check CORS settings in backend

### Issue: WebSocket connection fails

**Cause**: WebSocket URL is wrong or CORS not configured

**Solution**:
1. Verify `VITE_WS_BASE` matches backend URL
2. Check `FRONTEND_ORIGIN` in backend environment variables
3. Restart backend deployment

### Issue: Database connection error

**Cause**: Database credentials are wrong

**Solution**:
1. Verify connection string format
2. Check database is running
3. Verify firewall allows connections
4. Test connection locally first

### Issue: Login fails

**Cause**: Database schema not created

**Solution**:
1. Run SQL migrations again
2. Verify tables exist in database
3. Check database logs for errors

### Issue: Bids not updating in real-time

**Cause**: WebSocket not connected

**Solution**:
1. Check WebSocket connection in browser console
2. Verify Socket.io is configured correctly
3. Check backend logs for socket errors

## Part 7: Verify Everything Works

### Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend health check responds
- [ ] Database connected and migrated
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads without errors
- [ ] API calls work (test login)
- [ ] WebSocket connects
- [ ] Real-time updates work (test bid)
- [ ] Leaderboard updates live
- [ ] No console errors

### Test Flow

1. **Open frontend**: `https://codebid.vercel.app`
2. **Register a team**: Fill signup form
3. **Login**: Use team name
4. **Check admin dashboard**: Should see teams
5. **Start auction**: Click "START EVENT"
6. **Place bid**: Enter amount and click BID
7. **Verify leaderboard updates**: Should see bid in real-time

## Part 8: Environment Variables Summary

### Frontend (.env or Vercel)
```
VITE_API_BASE=https://codebid-api.vercel.app
VITE_WS_BASE=https://codebid-api.vercel.app
```

### Backend (.env or Vercel)
```
PORT=3000
NODE_ENV=production
FRONTEND_ORIGIN=https://codebid.vercel.app
JWT_SECRET=your-secret-key
DB_HOST=your-db-host.neon.tech
DB_PORT=5432
DB_NAME=codebid
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

## Part 9: Monitoring & Logs

### View Backend Logs

1. **Go to Vercel backend project**
2. **Click "Deployments"**
3. **Click latest deployment**
4. **Click "Logs"**
5. **Check for errors**

### View Frontend Logs

1. **Go to Vercel frontend project**
2. **Click "Deployments"**
3. **Click latest deployment**
4. **Click "Logs"**
5. **Check for build errors**

### View Database Logs

**Neon**:
1. Go to Neon dashboard
2. Click "Monitoring"
3. Check query logs

**Supabase**:
1. Go to Supabase dashboard
2. Click "Logs"
3. Check database logs

## Part 10: Common Commands

### Test Backend Locally
```bash
cd codebid-1/backend
npm install
npm run dev
```

### Test Frontend Locally
```bash
cd codebid-1
npm install
npm run dev
```

### Run Database Migrations
```bash
psql "postgresql://user:password@host/database" < backend/sql/001_init.sql
```

### Check Backend Health
```bash
curl https://your-backend-url.vercel.app/health
```

### Check API Endpoint
```bash
curl https://your-backend-url.vercel.app/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

## Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Set up PostgreSQL database
3. ✅ Run database migrations
4. ✅ Deploy frontend to Vercel
5. ✅ Connect frontend to backend
6. ✅ Test all features
7. ✅ Monitor logs and performance
8. ✅ Set up error tracking (optional)
9. ✅ Enable analytics (optional)
10. ✅ Go live!

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Express Docs**: https://expressjs.com/
- **Socket.io Docs**: https://socket.io/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Neon Docs**: https://neon.tech/docs/
- **Supabase Docs**: https://supabase.com/docs/

---

**Need help?** Check the troubleshooting section or review the logs in Vercel dashboard.
