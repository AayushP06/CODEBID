# Deployment Visual Guide

## Step-by-Step Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PROCESS                           │
└─────────────────────────────────────────────────────────────────┘

STEP 1: Set Up Database
┌──────────────────────────────────────────────────────────────┐
│ Neon / Supabase / AWS RDS                                    │
│ ├─ Create account                                            │
│ ├─ Create project "codebid"                                  │
│ ├─ Get connection string                                     │
│ └─ Save credentials                                          │
└──────────────────────────────────────────────────────────────┘
                            ↓

STEP 2: Deploy Backend
┌──────────────────────────────────────────────────────────────┐
│ Vercel Backend Project                                       │
│ ├─ Import GitHub repo                                        │
│ ├─ Set root: codebid-1/backend                              │
│ ├─ Add environment variables                                 │
│ │  ├─ DB_HOST, DB_PORT, DB_NAME                            │
│ │  ├─ DB_USER, DB_PASSWORD                                 │
│ │  ├─ JWT_SECRET                                            │
│ │  └─ FRONTEND_ORIGIN (placeholder)                         │
│ ├─ Deploy                                                    │
│ └─ Get backend URL: https://codebid-api.vercel.app         │
└──────────────────────────────────────────────────────────────┘
                            ↓

STEP 3: Set Up Database Schema
┌──────────────────────────────────────────────────────────────┐
│ Run SQL Migrations                                           │
│ ├─ 001_init.sql (create tables)                             │
│ ├─ 002_seed.sql (seed data)                                 │
│ ├─ 003_add_team_details.sql                                 │
│ └─ 003_add_user_details.sql                                 │
└──────────────────────────────────────────────────────────────┘
                            ↓

STEP 4: Deploy Frontend
┌──────────────────────────────────────────────────────────────┐
│ Vercel Frontend Project                                      │
│ ├─ Import GitHub repo                                        │
│ ├─ Set root: codebid-1                                       │
│ ├─ Add environment variables                                 │
│ │  ├─ VITE_API_BASE=https://codebid-api.vercel.app         │
│ │  └─ VITE_WS_BASE=https://codebid-api.vercel.app          │
│ ├─ Deploy                                                    │
│ └─ Get frontend URL: https://codebid.vercel.app            │
└──────────────────────────────────────────────────────────────┘
                            ↓

STEP 5: Update Backend CORS
┌──────────────────────────────────────────────────────────────┐
│ Backend Environment Variables                                │
│ ├─ Update FRONTEND_ORIGIN                                    │
│ │  └─ https://codebid.vercel.app                            │
│ └─ Redeploy backend                                          │
└──────────────────────────────────────────────────────────────┘
                            ↓

STEP 6: Test Connection
┌──────────────────────────────────────────────────────────────┐
│ Verify Everything Works                                      │
│ ├─ Test API: /health endpoint                               │
│ ├─ Test WebSocket: Connect and join auction                 │
│ ├─ Test Login: Register and login                           │
│ └─ Test Real-time: Place bid and see leaderboard update    │
└──────────────────────────────────────────────────────────────┘
                            ↓
                    ✅ DEPLOYMENT COMPLETE
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCTION SETUP                         │
└─────────────────────────────────────────────────────────────────┘

                    INTERNET (HTTPS)
                          ↓
        ┌─────────────────────────────────────┐
        │                                     │
        ↓                                     ↓
    ┌─────────────┐                  ┌──────────────┐
    │  Frontend   │                  │   Backend    │
    │  (React)    │                  │  (Express)   │
    │             │                  │              │
    │ codebid.    │  REST API        │ codebid-api. │
    │ vercel.app  │ ←──────────────→ │ vercel.app   │
    │             │                  │              │
    │ Port: 443   │  WebSocket       │ Port: 443    │
    │ (HTTPS)     │ ←──────────────→ │ (HTTPS)      │
    └─────────────┘                  └──────────────┘
                                            ↓
                                    ┌──────────────┐
                                    │ PostgreSQL   │
                                    │ Database     │
                                    │              │
                                    │ Neon /       │
                                    │ Supabase /   │
                                    │ AWS RDS      │
                                    └──────────────┘
```

---

## Environment Variables Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  ENVIRONMENT VARIABLES                          │
└─────────────────────────────────────────────────────────────────┘

FRONTEND (.env or Vercel)
┌──────────────────────────────────────┐
│ VITE_API_BASE                        │
│ ↓                                    │
│ https://codebid-api.vercel.app       │
│                                      │
│ VITE_WS_BASE                         │
│ ↓                                    │
│ https://codebid-api.vercel.app       │
└──────────────────────────────────────┘
            ↓
    ┌───────────────────┐
    │  API Calls        │
    │  WebSocket        │
    └───────────────────┘
            ↓
BACKEND (.env or Vercel)
┌──────────────────────────────────────┐
│ FRONTEND_ORIGIN                      │
│ ↓                                    │
│ https://codebid.vercel.app           │
│ (Used for CORS)                      │
│                                      │
│ DB_HOST, DB_PORT, DB_NAME            │
│ DB_USER, DB_PASSWORD                 │
│ ↓                                    │
│ postgresql://user:pass@host/db       │
│                                      │
│ JWT_SECRET                           │
│ ↓                                    │
│ Token signing & verification         │
└──────────────────────────────────────┘
            ↓
    ┌───────────────────┐
    │  PostgreSQL       │
    │  Database         │
    └───────────────────┘
```

---

## Data Flow During Auction

```
┌─────────────────────────────────────────────────────────────────┐
│                    REAL-TIME BID FLOW                           │
└─────────────────────────────────────────────────────────────────┘

USER PLACES BID
    ↓
┌─────────────────────────────────────┐
│ Frontend (React)                    │
│ ├─ User enters bid amount           │
│ ├─ Clicks "BID" button              │
│ └─ Emits "PLACE_BID" via WebSocket  │
└─────────────────────────────────────┘
    ↓ (WebSocket)
┌─────────────────────────────────────┐
│ Backend (Express)                   │
│ ├─ Receives "PLACE_BID" event       │
│ ├─ Validates bid amount             │
│ ├─ Checks team coins                │
│ ├─ Updates database                 │
│ └─ Broadcasts to all clients        │
└─────────────────────────────────────┘
    ↓ (Database)
┌─────────────────────────────────────┐
│ PostgreSQL Database                 │
│ ├─ Updates bids table               │
│ ├─ Updates events table             │
│ └─ Updates teams table              │
└─────────────────────────────────────┘
    ↓ (WebSocket Broadcast)
┌─────────────────────────────────────┐
│ All Connected Clients               │
│ ├─ Receive "BID_UPDATED" event      │
│ ├─ Receive "LEADERBOARD_UPDATED"    │
│ ├─ Update UI in real-time           │
│ └─ Show new highest bid             │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ User Sees                           │
│ ├─ New highest bid amount           │
│ ├─ Highest bidder name              │
│ ├─ Updated leaderboard              │
│ └─ Activity log entry               │
└─────────────────────────────────────┘
```

---

## Deployment Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTIMATED TIMELINE                           │
└─────────────────────────────────────────────────────────────────┘

Task                          Time    Status
─────────────────────────────────────────────────────────────────
1. Set up database            5 min   ⏱️
2. Deploy backend             5 min   ⏱️
3. Run migrations             5 min   ⏱️
4. Deploy frontend            5 min   ⏱️
5. Update CORS                2 min   ⏱️
6. Test connection            3 min   ⏱️
─────────────────────────────────────────────────────────────────
TOTAL                        25 min   ✅

Parallel tasks (can do simultaneously):
- Deploy backend & frontend at same time
- Set up database while deploying
```

---

## Vercel Dashboard Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL DASHBOARD                             │
└─────────────────────────────────────────────────────────────────┘

https://vercel.com/dashboard
    ↓
┌─────────────────────────────────────┐
│ Your Projects                       │
│ ├─ codebid (Frontend)               │
│ └─ codebid-api (Backend)            │
└─────────────────────────────────────┘
    ↓
Click on project
    ↓
┌─────────────────────────────────────┐
│ Project Dashboard                   │
│ ├─ Deployments                      │
│ ├─ Settings                         │
│ ├─ Analytics                        │
│ └─ Logs                             │
└─────────────────────────────────────┘
    ↓
Settings → Environment Variables
    ↓
┌─────────────────────────────────────┐
│ Add/Edit Variables                  │
│ ├─ Name: VITE_API_BASE              │
│ ├─ Value: https://...               │
│ └─ Save                             │
└─────────────────────────────────────┘
```

---

## Database Connection String Breakdown

```
postgresql://user:password@host:port/database?sslmode=require
             ↑    ↑        ↑    ↑    ↑         ↑
             │    │        │    │    │         └─ SSL Mode
             │    │        │    │    └─ Database Name
             │    │        │    └─ Port (5432)
             │    │        └─ Host/Server
             │    └─ Password
             └─ Username

Example from Neon:
postgresql://neon_user:neon_pass@ep-cool-name.neon.tech:5432/codebid?sslmode=require
             ↑         ↑         ↑                        ↑    ↑
             user      pass      host                     port db
```

---

## Error Diagnosis Flowchart

```
┌─────────────────────────────────────────────────────────────────┐
│                    TROUBLESHOOTING FLOW                         │
└─────────────────────────────────────────────────────────────────┘

Error: "Failed to fetch"
    ↓
Is backend deployed?
    ├─ NO → Deploy backend
    └─ YES → Check VITE_API_BASE
        ↓
Is VITE_API_BASE correct?
    ├─ NO → Update environment variable
    └─ YES → Check backend logs
        ↓
Are there errors in backend logs?
    ├─ YES → Fix errors and redeploy
    └─ NO → Check CORS settings

Error: WebSocket fails
    ↓
Is VITE_WS_BASE correct?
    ├─ NO → Update environment variable
    └─ YES → Check FRONTEND_ORIGIN
        ↓
Is FRONTEND_ORIGIN correct?
    ├─ NO → Update and redeploy backend
    └─ YES → Check Socket.io logs

Error: Database connection fails
    ↓
Is connection string correct?
    ├─ NO → Fix connection string
    └─ YES → Is database running?
        ↓
Is database running?
    ├─ NO → Start database
    └─ YES → Check firewall rules
```

---

## Success Indicators

```
✅ BACKEND DEPLOYED
   └─ https://codebid-api.vercel.app/health returns {"ok":true}

✅ DATABASE CONNECTED
   └─ Can query tables from backend

✅ FRONTEND DEPLOYED
   └─ https://codebid.vercel.app loads without errors

✅ API CONNECTED
   └─ Login endpoint works: POST /auth/login

✅ WEBSOCKET CONNECTED
   └─ Socket.io connects and joins auction room

✅ REAL-TIME WORKING
   └─ Bids update in real-time on all clients

✅ LEADERBOARD LIVE
   └─ Leaderboard updates when bids are placed

✅ READY FOR PRODUCTION
   └─ All tests pass, no console errors
```

---

## Quick Reference URLs

```
Frontend:           https://codebid.vercel.app
Backend:            https://codebid-api.vercel.app
Health Check:       https://codebid-api.vercel.app/health
Login Endpoint:     https://codebid-api.vercel.app/auth/login
Admin Dashboard:    https://codebid.vercel.app/admin
Auction View:       https://codebid.vercel.app/auction
Leaderboard:        https://codebid.vercel.app/leaderboard
```

---

## File Structure After Deployment

```
GitHub Repository
├── codebid-1/
│   ├── src/                    (Frontend React code)
│   ├── public/                 (Static assets)
│   ├── package.json            (Frontend dependencies)
│   ├── vite.config.js          (Vite config)
│   ├── vercel.json             (Frontend Vercel config)
│   ├── .env                    (Frontend env - local only)
│   │
│   └── backend/
│       ├── src/                (Backend Express code)
│       ├── sql/                (Database migrations)
│       ├── package.json        (Backend dependencies)
│       ├── vercel.json         (Backend Vercel config)
│       ├── .env                (Backend env - local only)
│       └── setup-db.js         (Database setup script)
│
└── .git/                       (Git repository)

Deployed to Vercel:
Frontend Project:  codebid-1/
Backend Project:   codebid-1/backend/
```

---

This visual guide should help you understand the deployment process at a glance!
