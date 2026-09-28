# VitalFlow Deployment Errors - Complete Troubleshooting Guide

## Summary of Fixed Issues

### ✅ Issue 1: Manifest Syntax Error
**Error:** `Manifest: Line: 1, column: 1, Syntax error` & `icons/logo.svg: Manifest: Line: 1, column: 1, Syntax error`

**Root Cause:** The metadata configuration had invalid icon declarations with wrong `rel` attribute.

**Fixed:** 
- Updated `src/utils/generate-metadata.ts` to use correct icon configuration
- Created `public/manifest.json` with proper PWA manifest structure
- Added `manifest: "/manifest.json"` to metadata

---

### ✅ Issue 2: 404 Errors on Static Assets
**Errors:** 
- `icons/logo.png:1 Failed to load resource: 404`
- `favicon.ico:1 Failed to load resource: 404`

**Root Cause:** 
- Referenced `logo.png` which doesn't exist (you only have `logo.svg`)
- No favicon.ico in public folder

**Fixed:**
- Created `public/favicon.ico` 
- Created `public/manifest.json`
- Updated metadata to reference correct assets (`.svg` only)

---

### ✅ Issue 3: Server Components Render Error
**Error:** `Error: An error occurred in the Server Components render. The specific message is omitted in production builds...`

**Root Causes & Fixes:**

#### A. Missing Environment Variables
Your Server Components call database queries:
```typescript
// In src/app/dashboard/layout.tsx & pages
const dbUser = await db.user.findUnique({...})
const symptoms = await db.symptom.findMany({...})
const medications = await db.medication.findMany({...})
```

**Action Required:**
1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Add ALL variables from your `.env` file:
   ```
   NEXT_PUBLIC_APP_NAME=VitalFlow
   NEXT_PUBLIC_APP_URL=https://your-production-url.vercel.app
   DATABASE_URL=mongodb+srv://...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   NEXT_PUBLIC_GOOGLE_API_KEY=...
   GROQ_API_KEY=...
   STRIPE_SECRET_KEY=...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
   STRIPE_WEBHOOK_SECRET=...
   ```

#### B. MongoDB Connection Issues
**Problem:** Database queries fail because MongoDB doesn't accept connections from Vercel

**Solution:**
1. Go to **MongoDB Atlas** → Your Cluster
2. Click **Network Access** → **IP Access List**
3. Add `0.0.0.0/0` to allow all IPs (for development)
   - OR add Vercel's IP range (for production security)
4. Click **Add IP Address** and save

**Test locally first:**
```bash
npm run dev
# Navigate to /dashboard
# If database queries work, the MongoDB connection is valid
```

#### C. Clerk Authentication Issues
**Problem:** Clerk keys invalid or not synced

**Solution:**
1. Verify keys in **Clerk Dashboard** → **API Keys**
2. In **Clerk Dashboard** → **Domains**, add your Vercel domain:
   - Production: `https://your-domain.vercel.app`
   - Allow redirect URIs from your domain
3. Redeploy after updating Clerk settings

---

### ✅ Issue 4: Service Worker & Port Errors
**Errors:**
- `Unchecked runtime.lastError: The message port closed before a response was received`
- `Error: A listener indicated an asynchronous response by returning true, but the message channel closed`
- `Video element not found for attaching listeners` (content.js:1454)

**Root Cause:** These are typically from browser extensions (ad blockers, privacy tools) trying to inject scripts into your page.

**Solution:**
1. **Not a critical app issue** - Safe to ignore
2. Test in **Incognito/Private window** where extensions are disabled
3. If you need to handle this in code, add error boundaries:

```typescript
// Add to src/components/global/providers.tsx if needed
try {
    // Your async message handling
} catch (error) {
    console.warn("Message handler error:", error);
    // Don't throw, just warn
}
```

---

## Step-by-Step Deployment Fix

### Step 1: Build Locally (Catch Errors Early)
```bash
cd d:\projects\cura-main
npm run build
```
If there are errors, they'll show now instead of on Vercel.

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Fix deployment errors: manifest, favicon, metadata"
git push origin main
```

### Step 3: Set Environment Variables on Vercel
1. Go to your Vercel project dashboard
2. **Settings** → **Environment Variables**
3. Add each variable from `.env`
4. Click **Save**

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on latest deployment
3. Wait for build to complete

### Step 5: Verify Deployment
```bash
# Check logs for errors
vercel logs --prod
```

Visit: `https://your-domain.vercel.app` and:
- [ ] Check browser console (F12) - should be mostly clean
- [ ] Sign in works
- [ ] Dashboard loads without "Server Components render" error
- [ ] No 404s on favicon, manifest, or icons

---

## Files Changed & Created

### Modified Files:
- ✅ `src/utils/generate-metadata.ts` - Fixed metadata icons & added manifest reference

### Created Files:
- ✅ `public/favicon.ico` - Favicon for browser tab
- ✅ `public/manifest.json` - PWA manifest configuration
- ✅ `VERCEL_ENV_VARS.md` - Environment variables documentation
- ✅ `DEPLOYMENT_CHECKLIST.sh` - Deployment checklist
- ✅ `DEPLOYMENT_TROUBLESHOOTING.md` - This file

---

## Quick Reference: What Each Error Means

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| Manifest syntax error | Invalid manifest.json | ✅ Fixed - created proper manifest |
| 404 favicon.ico | Missing file | ✅ Fixed - created favicon.ico |
| 404 icons/logo.png | File doesn't exist | ✅ Fixed - use logo.svg instead |
| Server Components render error | Missing env vars or DB error | Set env vars on Vercel, check DB connection |
| Message port closed error | Browser extension | Safe to ignore, test in Incognito |
| Video element not found | Browser extension injecting code | Safe to ignore |

---

## Common Vercel Debugging Commands

```bash
# View production logs
vercel logs --prod

# View live/preview logs
vercel logs

# Check deployment status
vercel status

# Redeploy current commit
vercel redeploy

# View environment variables (won't show values)
vercel env list
```

---

## MongoDB Connection String Format

Your DATABASE_URL should look like:
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?appName=...
```

Make sure:
- `username` and `password` are URL-encoded if they contain special characters
- `@cluster-name.mongodb.net` is your actual cluster
- Database name matches your setup

---

## Need More Help?

1. **Check Vercel Logs**: `vercel logs --prod`
2. **Check Browser Console**: F12 → Console tab → Look for red errors
3. **Check Network Tab**: F12 → Network → Look for 404 status codes
4. **Local Testing**: Run `npm run dev` and reproduce the issue locally first

If Server Components error still occurs:
1. Run `npm run build` locally and share the output
2. Check if all env vars are set on Vercel
3. Verify MongoDB allows Vercel IP addresses
