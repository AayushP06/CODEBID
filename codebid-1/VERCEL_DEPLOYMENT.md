# Vercel Deployment Guide

## Overview

This guide covers deploying CodeBid to Vercel with both frontend and backend.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Deployment                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend (React + Vite)                               │
│  ├─ Deployed to: codebid.vercel.app                   │
│  ├─ Build: npm run build                              │
│  └─ Output: dist/                                      │
│                                                         │
│  Backend (Express + Node.js)                           │
│  ├─ Deployed to: codebid-api.vercel.app               │
│  ├─ Build: npm install                                │
│  └─ Runtime: Node.js 24.x                             │
│                                                         │
│  Database (PostgreSQL)                                 │
│  ├─ External: Neon, Supabase, or AWS RDS             │
│  └─ Connection: Environment variables                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Vercel Account** - https://vercel.com
2. **GitHub Repository** - Connected to Vercel
3. **PostgreSQL Database** - Neon, Supabase, or AWS RDS
4. **Environment Variables** - Configured in Vercel

## Step 1: Prepare Your Repository

### Frontend Configuration

**File**: `codebid-1/vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE": "@api_base",
    "VITE_WS_BASE": "@ws_base"
  }
}
```

### Backend Configuration

**File**: `codebid-1/backend/vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm install",
  "env": {
    "PORT": "3000",
    "NODE_ENV": "production",
    "DB_HOST": "@db_host",
    "DB_PORT": "@db_port",
    "DB_NAME": "@db_name",
    "DB_USER": "@db_user",
    "DB_PASSWORD": "@db_password",
    "JWT_SECRET": "@jwt_secret",
    "FRONTEND_ORIGIN": "@frontend_origin"
  }
}
```

## Step 2: Set Up PostgreSQL Database

### Option A: Neon (Recommended)

1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string
4. Run migrations:
   ```bash
   psql "your-connection-string" -f backend/sql/001_init.sql
   psql "your-connection-string" -f backend/sql/002_seed.sql
   psql "your-connection-string" -f backend/sql/003_add_team_details.sql
   psql "your-connection-string" -f backend/sql/003_add_user_details.sql
   ```

### Option B: Supabase

1. Go to https://supabase.com
2. Create a new project
3. Go to SQL Editor
4. Run the SQL files from `backend/sql/`

### Option C: AWS RDS

1. Create RDS PostgreSQL instance
2. Configure security groups
3. Run migrations using psql

## Step 3: Deploy Frontend

### 1. Connect GitHub Repository

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose your GitHub repo
4. Select root directory: `codebid-1`

### 2. Configure Build Settings

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Add Environment Variables

In Vercel Project Settings → Environment Variables:

```
VITE_API_BASE=https://codebid-api.vercel.app
VITE_WS_BASE=https://codebid-api.vercel.app
```

### 4. Deploy

Click "Deploy" and wait for completion.

## Step 4: Deploy Backend

### 1. Create New Vercel Project for Backend

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose your GitHub repo
4. Select root directory: `codebid-1/backend`

### 2. Configure Build Settings

- **Framework**: Other
- **Build Command**: `npm install`
- **Output Directory**: (leave empty)
- **Install Command**: `npm install`

### 3. Add Environment Variables

In Vercel Project Settings → Environment Variables:

```
PORT=3000
NODE_ENV=production
DB_HOST=your-db-host.neon.tech
DB_PORT=5432
DB_NAME=codebid
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_ORIGIN=https://codebid.vercel.app
```

### 4. Deploy

Click "Deploy" and wait for completion.

## Step 5: Update Frontend API URLs

After backend deployment, update frontend environment variables:

```
VITE_API_BASE=https://codebid-api.vercel.app
VITE_WS_BASE=https://codebid-api.vercel.app
```

Redeploy frontend to apply changes.

## Step 6: Test Deployment

### Test Frontend
```bash
curl https://codebid.vercel.app
```

### Test Backend
```bash
curl https://codebid-api.vercel.app/health
```

### Test API Connection
```bash
curl https://codebid-api.vercel.app/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

## Environment Variables Reference

### Frontend (.env)
```
VITE_API_BASE=https://codebid-api.vercel.app
VITE_WS_BASE=https://codebid-api.vercel.app
```

### Backend (.env)
```
PORT=3000
NODE_ENV=production
FRONTEND_ORIGIN=https://codebid.vercel.app
JWT_SECRET=your-secret-key-change-in-production

# Database
DB_HOST=your-db-host.neon.tech
DB_PORT=5432
DB_NAME=codebid
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

## Troubleshooting

### Build Fails: "Cannot find module"

**Solution**: Ensure all dependencies are in `package.json`
```bash
npm install missing-package
```

### Build Fails: "Port already in use"

**Solution**: Vercel assigns dynamic ports. Use `process.env.PORT`
```javascript
const port = process.env.PORT || 4000;
server.listen(port);
```

### API Connection Fails

**Solution**: Check CORS settings in backend
```javascript
cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true
})
```

### WebSocket Connection Fails

**Solution**: Ensure WebSocket is configured in Socket.io
```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
  }
});
```

### Database Connection Fails

**Solution**: Verify connection string format
```
postgresql://user:password@host:port/database
```

### Environment Variables Not Loading

**Solution**: Redeploy after adding environment variables
```bash
vercel --prod
```

## Performance Optimization

### Frontend
- Enable caching headers
- Minify assets
- Use CDN for static files

### Backend
- Enable connection pooling
- Use Redis for caching
- Optimize database queries

### Database
- Add indexes on frequently queried columns
- Use connection pooling
- Monitor query performance

## Monitoring

### Vercel Analytics
- Go to Project Settings → Analytics
- Monitor build times and performance

### Error Tracking
- Check Vercel Logs for errors
- Use Sentry for error tracking

### Database Monitoring
- Use Neon/Supabase dashboard
- Monitor connection count
- Check query performance

## Scaling

### Increase Resources
- Vercel Pro: More build minutes
- Larger database: Upgrade PostgreSQL plan
- CDN: Enable Vercel Edge Network

### Optimize Code
- Code splitting
- Lazy loading
- Database query optimization

## Security

### Secrets Management
- Use Vercel Environment Variables
- Never commit `.env` files
- Rotate secrets regularly

### HTTPS
- Vercel provides free SSL/TLS
- All connections are encrypted

### Database Security
- Use strong passwords
- Enable SSL connections
- Restrict IP access

## Deployment Checklist

- [ ] GitHub repository connected to Vercel
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] PostgreSQL database created and migrated
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] WebSocket connections working
- [ ] CORS configured correctly
- [ ] SSL/TLS enabled
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Database backups enabled

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build timeout | Increase build machine size |
| Out of memory | Optimize dependencies |
| Database connection timeout | Check firewall rules |
| CORS errors | Update FRONTEND_ORIGIN |
| WebSocket fails | Check Socket.io configuration |
| Environment variables not loading | Redeploy after adding variables |

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Socket.io Docs**: https://socket.io/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Express Docs**: https://expressjs.com/

## Next Steps

1. Deploy frontend to Vercel
2. Deploy backend to Vercel
3. Set up PostgreSQL database
4. Configure environment variables
5. Test all endpoints
6. Monitor performance
7. Set up error tracking
8. Enable analytics
