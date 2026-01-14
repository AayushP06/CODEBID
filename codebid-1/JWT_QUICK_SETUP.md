# JWT Quick Setup (5 Minutes)

## Step 1: Generate JWT_SECRET (1 minute)

**Run this command in your terminal:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**You'll get something like:**
```
a7f3c9e2b1d4f6a8c5e7b9d1f3a5c7e9b2d4f6a8c5e7b9d1f3a5c7e9b2d4f6
```

**Copy this value** ← You'll need it in next steps

---

## Step 2: Add to Local .env (1 minute)

**File**: `codebid-1/backend/.env`

```env
JWT_SECRET=a7f3c9e2b1d4f6a8c5e7b9d1f3a5c7e9b2d4f6a8c5e7b9d1f3a5c7e9b2d4f6
```

**Replace** `a7f3c9e2...` with your generated secret

---

## Step 3: Add to Vercel (2 minutes)

1. **Go to**: https://vercel.com/dashboard
2. **Click**: Backend project (`codebid-api`)
3. **Click**: Settings tab
4. **Click**: Environment Variables
5. **Click**: Add New
6. **Fill in**:
   - Name: `JWT_SECRET`
   - Value: `a7f3c9e2b1d4f6a8c5e7b9d1f3a5c7e9b2d4f6a8c5e7b9d1f3a5c7e9b2d4f6`
7. **Click**: Save

---

## Step 4: Redeploy Backend (1 minute)

1. **Go to**: Deployments
2. **Click**: Latest deployment
3. **Click**: Redeploy

---

## Step 5: Test (1 minute)

**In browser console:**

```javascript
fetch('https://your-backend-url.vercel.app/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'test' })
})
.then(r => r.json())
.then(d => console.log('✅ JWT Working:', d.token ? 'YES' : 'NO'))
.catch(e => console.error('❌ Error:', e))
```

**Expected output**: `✅ JWT Working: YES`

---

## Done! ✅

Your JWT is now configured and working!

---

## Cheat Sheet

| What | Where | How |
|------|-------|-----|
| Generate | Terminal | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| Local | `.env` | `JWT_SECRET=your-secret` |
| Production | Vercel | Settings → Environment Variables → Add |
| Test | Browser | `fetch('/auth/login', ...)` |

---

## Common Issues

| Issue | Fix |
|-------|-----|
| "Unauthorized" | Check JWT_SECRET is set in Vercel |
| Token not working | Redeploy backend after changing JWT_SECRET |
| Login fails | Verify JWT_SECRET is same in .env and Vercel |

---

## Remember

🔐 **Keep JWT_SECRET secret!**
- Don't share it
- Don't commit to GitHub
- Don't put in emails
- Use different secrets for dev/prod

---

**Total Time**: 5 minutes  
**Difficulty**: Easy  
**Success Rate**: 99%
