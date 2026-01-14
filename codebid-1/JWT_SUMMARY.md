# JWT Configuration Summary

## What I Wrote in BACKEND_DEPLOYMENT_STEPS.md

In the environment variables section, I mentioned:

```
JWT_SECRET=your-super-secret-key-change-this-12345
```

And explained:
- **JWT_SECRET**: Create any random string (e.g., `abc123xyz789def456`)

This was a **placeholder** - you need to replace it with a real, secure secret.

---

## What JWT_SECRET Does

JWT_SECRET is used to:

1. **Sign tokens** when users login
   ```
   User logs in → Backend creates JWT token → Signs with JWT_SECRET
   ```

2. **Verify tokens** when users make requests
   ```
   User makes request → Backend checks token → Verifies with JWT_SECRET
   ```

3. **Prevent tampering**
   ```
   If someone modifies the token → Verification fails → Request rejected
   ```

---

## How to Configure JWT_SECRET

### For Local Development

**File**: `codebid-1/backend/.env`

```env
JWT_SECRET=your-generated-secret-key-here
```

### For Production (Vercel)

**Steps**:
1. Go to Vercel Dashboard
2. Select backend project
3. Settings → Environment Variables
4. Add: `JWT_SECRET=your-secret`
5. Redeploy backend

---

## How to Generate a Strong JWT_SECRET

**Run this command:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output example:**
```
a7f3c9e2b1d4f6a8c5e7b9d1f3a5c7e9b2d4f6a8c5e7b9d1f3a5c7e9b2d4f6
```

**Use this value** as your JWT_SECRET

---

## Where JWT_SECRET is Used in Code

### Backend (Express)

**File**: `codebid-1/backend/src/routes/auth.routes.js`

```javascript
// When user logs in
const token = jwt.sign(
  { teamId: team.id, teamName: team.name },
  process.env.JWT_SECRET,  // ← Uses JWT_SECRET here
  { expiresIn: "7d" }
);

// When verifying token
const decoded = jwt.verify(token, process.env.JWT_SECRET);  // ← And here
```

### Backend (Socket.io)

**File**: `codebid-1/backend/src/socket/socket.js`

```javascript
// When verifying WebSocket connection
const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
```

---

## Complete Setup Checklist

- [ ] Generate JWT_SECRET using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Add to local `.env`: `JWT_SECRET=your-generated-secret`
- [ ] Add to Vercel environment variables
- [ ] Redeploy backend
- [ ] Test login endpoint
- [ ] Verify token works

---

## Quick Reference

### Generate
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Local Setup
```env
JWT_SECRET=a7f3c9e2b1d4f6a8c5e7b9d1f3a5c7e9b2d4f6a8c5e7b9d1f3a5c7e9b2d4f6
```

### Vercel Setup
1. Project Settings
2. Environment Variables
3. Add `JWT_SECRET`
4. Redeploy

### Test
```bash
curl https://your-backend.vercel.app/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

---

## Important Notes

✅ **DO**:
- Use a random, long string (32+ characters)
- Store in environment variables
- Keep it secret
- Use different secrets for dev/prod

❌ **DON'T**:
- Use simple passwords
- Commit to GitHub
- Share with anyone
- Use the same secret everywhere

---

## Files to Read

1. **JWT_QUICK_SETUP.md** - 5-minute setup guide
2. **JWT_CONFIGURATION_GUIDE.md** - Detailed explanation
3. **BACKEND_DEPLOYMENT_STEPS.md** - Full deployment guide

---

## Support

- **JWT.io**: https://jwt.io (decode tokens)
- **Node.js Crypto**: https://nodejs.org/api/crypto.html
- **jsonwebtoken npm**: https://www.npmjs.com/package/jsonwebtoken

---

**Status**: ✅ Ready to configure JWT
