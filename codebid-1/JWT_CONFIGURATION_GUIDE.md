# JWT Configuration Guide

## What is JWT?

**JWT** (JSON Web Token) is used to securely authenticate users. It's a token that contains encoded user information and is signed with a secret key.

```
JWT Token Structure:
┌─────────────────────────────────────────────────────────────┐
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.                      │
│ eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ. │
│ SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c                │
│ └─────────────────────────────────────────────────────────────┘
│   Header              Payload                Signature
```

## Why JWT_SECRET is Important

The `JWT_SECRET` is the key used to:
- **Sign** tokens when users login
- **Verify** tokens when users make requests
- **Prevent** token tampering

**If someone knows your JWT_SECRET, they can forge tokens and impersonate any user!**

---

## How to Generate a Strong JWT_SECRET

### Option 1: Using Node.js (Recommended)

**Run this in your terminal:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output example:**
```
a7f3c9e2b1d4f6a8c5e7b9d1f3a5c7e9b2d4f6a8c5e7b9d1f3a5c7e9b2d4f6
```

**Copy this value** - this is your JWT_SECRET!

### Option 2: Using OpenSSL

```bash
openssl rand -hex 32
```

**Output example:**
```
f8e2c9a1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b2d4f6
```

### Option 3: Using Python

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### Option 4: Online Generator (Less Secure)

Go to: https://www.random.org/strings/

- **Number of strings**: 1
- **Length of each string**: 64
- **Characters to use**: 0-9, a-f (hexadecimal)
- **Click "Get Strings"**

---

## Where to Use JWT_SECRET

### 1. Local Development (.env file)

**File**: `codebid-1/backend/.env`

```env
JWT_SECRET=your-generated-secret-key-here
```

**Example:**
```env
JWT_SECRET=a7f3c9e2b1d4f6a8c5e7b9d1f3a5c7e9b2d4f6a8c5e7b9d1f3a5c7e9b2d4f6
```

### 2. Production (Vercel Environment Variables)

**Steps:**

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Select Backend Project**
   - Click on `codebid-api` project

3. **Go to Settings**
   - Click "Settings" tab

4. **Environment Variables**
   - Click "Environment Variables"

5. **Add New Variable**
   - **Name**: `JWT_SECRET`
   - **Value**: Paste your generated secret
   - **Click "Save"**

6. **Redeploy Backend**
   - Go to "Deployments"
   - Click latest deployment
   - Click "Redeploy"

---

## How JWT Works in CodeBid

### Login Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    LOGIN PROCESS                            │
└─────────────────────────────────────────────────────────────┘

1. User enters team name
   ↓
2. Frontend sends: POST /auth/login
   {
     "name": "Team Alpha"
   }
   ↓
3. Backend receives request
   ├─ Finds or creates team
   ├─ Creates JWT token using JWT_SECRET
   │  jwt.sign(
   │    { teamId: 1, teamName: "Team Alpha" },
   │    process.env.JWT_SECRET,
   │    { expiresIn: "7d" }
   │  )
   └─ Returns token to frontend
   ↓
4. Frontend receives token
   ├─ Stores in localStorage
   └─ Sends with every request
   ↓
5. Backend verifies token
   ├─ Decodes using JWT_SECRET
   ├─ Checks if valid
   └─ Allows request if valid
```

### Code Implementation

**Backend (Express):**

```javascript
import jwt from "jsonwebtoken";

// Login endpoint
router.post("/auth/login", async (req, res) => {
  const { name } = req.body;
  
  // Find or create team
  let team = await Team.findByName(name);
  if (!team) {
    team = await Team.create({ name });
  }

  // Create JWT token
  const token = jwt.sign(
    { teamId: team.id, teamName: team.name },
    process.env.JWT_SECRET,  // ← Uses JWT_SECRET
    { expiresIn: "7d" }      // Token expires in 7 days
  );

  res.json({ token, team });
});

// Middleware to verify token
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  
  try {
    // Verify using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}
```

**Frontend (React):**

```javascript
// Login
async function login(teamName) {
  const response = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ name: teamName })
  });

  // Store token
  localStorage.setItem("token", response.token);
}

// Send token with requests
export async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  return res.json();
}
```

---

## JWT_SECRET Best Practices

### ✅ DO:

- ✅ Use a **random, long string** (at least 32 characters)
- ✅ Use **hexadecimal characters** (0-9, a-f)
- ✅ **Store securely** in environment variables
- ✅ **Never commit** to GitHub
- ✅ **Rotate periodically** (every 6-12 months)
- ✅ Use **different secrets** for dev and production
- ✅ **Keep it secret** - don't share with anyone

### ❌ DON'T:

- ❌ Use simple passwords like `password123`
- ❌ Use predictable strings like `secret` or `key`
- ❌ Commit to GitHub or version control
- ❌ Share in emails or chat
- ❌ Use the same secret for multiple environments
- ❌ Use short strings (less than 32 characters)
- ❌ Hardcode in source code

---

## JWT_SECRET for Different Environments

### Development (Local)

**File**: `codebid-1/backend/.env`

```env
JWT_SECRET=dev-secret-key-12345678901234567890123456789012
```

**Note**: Can be simpler for local development

### Staging (Test Server)

**Vercel Environment Variables** (staging branch):

```
JWT_SECRET=staging-secret-key-abcdefghijklmnopqrstuvwxyz123456
```

### Production (Live)

**Vercel Environment Variables** (main branch):

```
JWT_SECRET=prod-secret-key-xyz9876543210abcdefghijklmnopqrst
```

**Note**: Must be strong and random

---

## How to Set JWT_SECRET in Vercel

### Step-by-Step:

1. **Open Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **Select Backend Project**
   ```
   Click on "codebid-api" project
   ```

3. **Go to Settings**
   ```
   Click "Settings" tab at top
   ```

4. **Click Environment Variables**
   ```
   Left sidebar → Environment Variables
   ```

5. **Add New Variable**
   ```
   Click "Add New"
   ```

6. **Fill in Details**
   ```
   Name: JWT_SECRET
   Value: a7f3c9e2b1d4f6a8c5e7b9d1f3a5c7e9b2d4f6a8c5e7b9d1f3a5c7e9b2d4f6
   ```

7. **Select Environment**
   ```
   Choose: Production, Preview, Development
   (Usually select all three)
   ```

8. **Click Save**
   ```
   Button at bottom right
   ```

9. **Redeploy Backend**
   ```
   Go to Deployments
   Click latest deployment
   Click "Redeploy"
   ```

---

## Verify JWT_SECRET is Working

### Test Locally

```bash
# Start backend
cd codebid-1/backend
npm run dev

# In another terminal, test login
curl http://localhost:4000/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'

# Should return:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "team": { "id": 1, "name": "test", "coins": 1000 }
# }
```

### Test in Production

```bash
# Test login endpoint
curl https://codebid-api.vercel.app/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'

# Should return token if JWT_SECRET is configured correctly
```

### Test Token Verification

```bash
# Get token from login
TOKEN=$(curl https://codebid-api.vercel.app/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}' | jq -r '.token')

# Use token to access protected endpoint
curl https://codebid-api.vercel.app/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Should return user info if token is valid
```

---

## Troubleshooting JWT Issues

### Issue: "Unauthorized" error on login

**Cause**: JWT_SECRET not set or wrong

**Solution**:
1. Check JWT_SECRET is set in Vercel
2. Verify it's the same in all environments
3. Redeploy backend after changing

### Issue: Token expires immediately

**Cause**: JWT_SECRET changed after token was created

**Solution**:
1. Clear localStorage: `localStorage.clear()`
2. Login again to get new token
3. Don't change JWT_SECRET in production

### Issue: "Invalid token" error

**Cause**: Token was signed with different JWT_SECRET

**Solution**:
1. Check JWT_SECRET matches between frontend and backend
2. Verify token wasn't modified
3. Clear browser cache and try again

### Issue: WebSocket authentication fails

**Cause**: JWT_SECRET not used for Socket.io auth

**Solution**:
1. Verify Socket.io middleware uses JWT_SECRET
2. Check token is being sent with WebSocket connection
3. Verify CORS settings

---

## JWT Token Expiration

### Default: 7 Days

```javascript
jwt.sign(
  { teamId: team.id, teamName: team.name },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }  // ← 7 days
);
```

### Change Expiration

**In backend code** (`src/routes/auth.routes.js`):

```javascript
// Change to 30 days
{ expiresIn: "30d" }

// Change to 24 hours
{ expiresIn: "24h" }

// Change to 1 hour
{ expiresIn: "1h" }

// No expiration (not recommended)
// (don't include expiresIn)
```

---

## Security Checklist

- [ ] JWT_SECRET is at least 32 characters
- [ ] JWT_SECRET is random and unique
- [ ] JWT_SECRET is stored in environment variables
- [ ] JWT_SECRET is NOT in GitHub
- [ ] JWT_SECRET is different for dev/staging/prod
- [ ] JWT_SECRET is set in Vercel
- [ ] Backend is redeployed after changing JWT_SECRET
- [ ] Token verification works in production
- [ ] WebSocket authentication uses JWT_SECRET
- [ ] CORS is configured correctly

---

## Quick Reference

### Generate JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Set in .env (Local)
```env
JWT_SECRET=your-generated-secret-here
```

### Set in Vercel
1. Project Settings → Environment Variables
2. Add: `JWT_SECRET=your-secret`
3. Redeploy backend

### Test JWT
```bash
curl https://your-backend.vercel.app/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

### Verify Token
```bash
curl https://your-backend.vercel.app/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Common JWT_SECRET Values (Examples)

**DO NOT USE THESE - Generate your own!**

These are just examples to show the format:

```
✅ Good format (use these as reference):
a7f3c9e2b1d4f6a8c5e7b9d1f3a5c7e9b2d4f6a8c5e7b9d1f3a5c7e9b2d4f6
f8e2c9a1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b2d4f6
c5e7b9d1f3a5c7e9b2d4f6a8c5e7b9d1f3a5c7e9b2d4f6a8c5e7b9d1f3a5c7

❌ Bad format (don't use):
password123
secret
key
admin
12345678
```

---

## Next Steps

1. ✅ Generate a strong JWT_SECRET
2. ✅ Add to local `.env` file
3. ✅ Add to Vercel environment variables
4. ✅ Redeploy backend
5. ✅ Test login endpoint
6. ✅ Verify token works
7. ✅ Test WebSocket authentication

---

## Support

- **JWT.io**: https://jwt.io (decode tokens)
- **Node.js Crypto**: https://nodejs.org/api/crypto.html
- **jsonwebtoken npm**: https://www.npmjs.com/package/jsonwebtoken
- **Vercel Docs**: https://vercel.com/docs/concepts/projects/environment-variables
