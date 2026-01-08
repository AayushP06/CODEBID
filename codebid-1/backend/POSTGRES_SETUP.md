# PostgreSQL Setup Guide

## Quick Start

1. **Start PostgreSQL Service (Run as Administrator)**
   ```cmd
   # Right-click Command Prompt -> Run as Administrator
   net start postgresql-x64-17
   ```

2. **Test Connection**
   ```bash
   node test-postgres.js
   ```

3. **If connection works, run migrations**
   ```bash
   npm run db:migrate
   ```

## Alternative Methods

### Method 1: Using pgAdmin (GUI)
1. Open pgAdmin (should be installed with PostgreSQL)
2. Connect to local server
3. Create database named `codebid`
4. Run the test script: `node test-postgres.js`

### Method 2: Manual Command Line
```bash
# Start PostgreSQL (as admin)
net start postgresql-x64-17

# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE codebid;

# Exit
\q
```

### Method 3: Find Your PostgreSQL Password
If you forgot your PostgreSQL password:
1. Check if there's a password file in: `C:\Program Files\PostgreSQL\17\`
2. Or try common defaults: (empty), `postgres`, `admin`, `password`
3. You might need to reset the password

## Troubleshooting

**"Connection refused"**
- PostgreSQL service is not running
- Run: `net start postgresql-x64-17` as administrator

**"Authentication failed"**
- Wrong password
- Try the test script: `node test-postgres.js`
- It will try common passwords automatically

**"Access denied"**
- Need administrator privileges
- Right-click Command Prompt -> "Run as administrator"

## What Happens Next

Once PostgreSQL is connected:
1. The `codebid` database will be created
2. Tables will be created (teams, problems, events, bids, submissions)
3. Sample data will be inserted (admin user, sample problems)
4. Your backend will use the database instead of memory storage