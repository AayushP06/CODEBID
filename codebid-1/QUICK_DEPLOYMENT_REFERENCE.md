# Quick Deployment Reference Card

## 5-Minute Quick Start

### 1. Set Up Database (5 min)

**Neon** (Easiest):
```
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create project "codebid"
4. Copy connection string
5. Save it
```

### 2. Deploy Backend (5 min)

```
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import GitHub repo
4. Set root directory: codebid-1/backend
5. Add environment variables (see below)
6. Click Deploy
7. Copy backend URL
```

**Environment Variables for Backend:**
```
PORT=3000
NODE_ENV=production
FRONTEND_ORIGIN=https://codebid.vercel.app
JWT_SECRET=any-random-string-here
DB_HOST=your-neon-host.neon.tech
DB_PORT=5432
DB_NAME=codebid
DB_USER=your-user
DB_PASSWORD=your-password
```

### 3. Set Up Database Schema (5 min)

**Using Neon Console:**
```
1. Go to Neon dashboard
2. Click "SQL Editor"
3. Copy-paste backend/sql/001_init.sql
4. Click Execute
5. Repeat for 002, 003_add_team_details, 003_add_user_details
```

### 4. Deploy Frontend (5 min)

```
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import GitHub repo
4. Set root directory: codebid-1
5. Add environment variables (see below)
6. Click Deploy
7. Copy frontend URL
```

**Environment Variables for Frontend:**
```
VITE_API_BASE=https://your-backend-url.vercel.app
VITE_WS_BASE=https://your-backend-url.vercel.app
```

### 5. Update Backend CORS (2 min)

```
1. Go to backend project in Vercel
2. Settings → Environment Variables
3. Update FRONTEND_ORIGIN to your frontend URL
4. Redeploy backend
```

### 6. Test Connection (2 min)

**In browser console:**
```javascript
// Test API
fetch('https://your-backend-url.vercel.app/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Backend Error:', e))

// Test WebSocket
const socket = io('https://your-backend-url.vercel.app', {
  auth: { token: localStorage.getItem('token') }
});
socket.on('connect', () => console.log('✅ WebSocket OK'));
socket.on('error', (err) => console.error('❌ WebSocket Error:', err));
```

---

## Environment Variables Cheat Sheet

### Frontend
```
VITE_API_BASE=https://codebid-api.vercel.app
VITE_WS_BASE=https://codebid-api.vercel.app
```

### Backend
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

---

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| "Failed to fetch" | Check `VITE_API_BASE` in frontend |
| WebSocket fails | Check `VITE_WS_BASE` and `FRONTEND_ORIGIN` |
| Database error | Run SQL migrations again |
| Login fails | Check database tables exist |
| Bids not updating | Check WebSocket connection in console |

---

## URLs After Deployment

```
Frontend:  https://codebid.vercel.app
Backend:   https://codebid-api.vercel.app
Health:    https://codebid-api.vercel.app/health
```

---

## Database Connection String Format

```
postgresql://user:password@host:port/database

Example from Neon:
postgresql://neon_user:neon_pass@ep-cool-name.neon.tech:5432/codebid?sslmode=require
```

---

## SQL Migration Files

Run in order:
1. `backend/sql/001_init.sql` - Create tables
2. `backend/sql/002_seed.sql` - Add seed data
3. `backend/sql/003_add_team_details.sql` - Add team columns
4. `backend/sql/003_add_user_details.sql` - Add user columns

---

## Vercel Dashboard Links

- **Frontend Project**: https://vercel.com/dashboard
- **Backend Project**: https://vercel.com/dashboard
- **Environment Variables**: Project → Settings → Environment Variables
- **Logs**: Project → Deployments → [Latest] → Logs
- **Redeploy**: Project → Deployments → [Latest] → Redeploy

---

## Test Commands

```bash
# Test backend health
curl https://your-backend-url.vercel.app/health

# Test login endpoint
curl https://your-backend-url.vercel.app/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'

# Test database connection (from local machine)
psql "postgresql://user:password@host/database" -c "SELECT 1"
```

---

## Common Mistakes to Avoid

❌ **Don't**: Forget to set `FRONTEND_ORIGIN` in backend  
✅ **Do**: Update it after frontend deployment

❌ **Don't**: Use `localhost` in production URLs  
✅ **Do**: Use full Vercel URLs (https://...)

❌ **Don't**: Skip database migrations  
✅ **Do**: Run all SQL files in order

❌ **Don't**: Commit `.env` files to GitHub  
✅ **Do**: Use Vercel environment variables

❌ **Don't**: Use weak JWT secrets  
✅ **Do**: Use random, strong secrets

---

## Success Checklist

- [ ] Backend deployed and health check works
- [ ] Database created and migrated
- [ ] Frontend deployed
- [ ] API calls work (test login)
- [ ] WebSocket connects
- [ ] Real-time updates work
- [ ] No console errors
- [ ] Can register and login
- [ ] Can place bids
- [ ] Leaderboard updates live

---

## Need Help?

1. Check browser console (F12)
2. Check Vercel logs
3. Check database logs
4. Read `BACKEND_DEPLOYMENT_STEPS.md`
5. Read `VERCEL_DEPLOYMENT.md`

---

**Total Time**: ~25 minutes  
**Difficulty**: Easy  
**Success Rate**: 95%+
