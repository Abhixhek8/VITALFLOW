# Vercel Environment Variables Setup

This document lists all environment variables needed for deployment on Vercel.

## Required Environment Variables

### App Configuration
- **NEXT_PUBLIC_APP_NAME** = `VitalFlow`
- **NEXT_PUBLIC_APP_URL** = `https://your-app.vercel.app` (your production URL)

### Database
- **DATABASE_URL** = Your MongoDB connection string (from `.env` file)
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?appName=...`
  - ⚠️ **Critical**: Ensure MongoDB network access allows Vercel IPs

### Authentication (Clerk)
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** = Your Clerk publishable key
- **CLERK_SECRET_KEY** = Your Clerk secret key
- Set in Vercel Dashboard under Settings > Environment Variables

### APIs
- **NEXT_PUBLIC_GOOGLE_API_KEY** = Your Google Generative AI key
- **GROQ_API_KEY** = Your GROQ API key (free LLM)

### Payment Processing (Stripe)
- **STRIPE_SECRET_KEY** = Your Stripe secret key
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** = Your Stripe publishable key
- **STRIPE_WEBHOOK_SECRET** = Your Stripe webhook signing secret (get from Webhook settings)

## Steps to Configure on Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - For production: add to `Production` environment
   - For preview/staging: add to `Preview` environment
4. Click "Save"
5. Redeploy your application

## Important Notes

### Database Connection Issues
- **MongoDB Atlas**: Ensure your cluster allows Vercel's IP addresses
  - Go to MongoDB Atlas → Network Access
  - Add `0.0.0.0/0` (allows all IPs) or Vercel's IP range
  - Consider using VPC Peering for production

### Sensitive Variables
- Keep `CLERK_SECRET_KEY` and `STRIPE_SECRET_KEY` in Production only
- Don't expose in client-side code (use `NEXT_PUBLIC_*` prefix for public keys only)

### Testing in Production
- Deploy and check Vercel logs if Server Component render errors occur
- Use `vercel logs` CLI command to debug:
  ```bash
  vercel logs --prod
  ```

## Environment Variable Validation

Your app uses these environment variables in Server Components:
- Dashboard pages query database using `db.user`, `db.symptom`, `db.medication`, `db.mentalWellness`
- Auth pages use Clerk middleware
- Health tips & recommendations use GROQ/Google APIs
- Checkout uses Stripe

If any are missing, you'll see: "An error occurred in the Server Components render"

## Quick Verification Checklist

- [ ] DATABASE_URL is valid and MongoDB accepts Vercel connections
- [ ] CLERK keys are set and valid
- [ ] STRIPE keys match your account (test vs. production)
- [ ] GROQ and Google API keys are active
- [ ] NEXT_PUBLIC_APP_URL matches your Vercel domain
- [ ] All variables are marked for the correct environment (Production/Preview)
