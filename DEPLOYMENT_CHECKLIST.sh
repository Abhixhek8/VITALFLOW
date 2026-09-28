#!/bin/bash

# Deployment Checklist for VitalFlow on Vercel

echo "🚀 VitalFlow Deployment Checklist"
echo "================================"
echo ""

# 1. Environment Variables Check
echo "1️⃣  Environment Variables Setup"
echo "   ✓ NEXT_PUBLIC_APP_NAME"
echo "   ✓ NEXT_PUBLIC_APP_URL (use your Vercel domain)"
echo "   ✓ DATABASE_URL (MongoDB connection string)"
echo "   ✓ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "   ✓ CLERK_SECRET_KEY"
echo "   ✓ NEXT_PUBLIC_GOOGLE_API_KEY"
echo "   ✓ GROQ_API_KEY"
echo "   ✓ STRIPE_SECRET_KEY"
echo "   ✓ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "   ✓ STRIPE_WEBHOOK_SECRET"
echo ""

# 2. MongoDB Configuration
echo "2️⃣  MongoDB Atlas Configuration"
echo "   ✓ Enable Network Access: 0.0.0.0/0 or add Vercel IP"
echo "   ✓ DATABASE_URL includes correct credentials"
echo "   ✓ Test connection locally: npm run dev"
echo ""

# 3. Static Files
echo "3️⃣  Static Files (public/)"
echo "   ✓ favicon.ico created"
echo "   ✓ manifest.json created"
echo "   ✓ icons/logo.svg exists"
echo "   ✓ images/thumbnail.png exists"
echo ""

# 4. Build Check
echo "4️⃣  Build Verification"
echo "   Run: npm run build"
echo "   (This catches most Server Component errors before deployment)"
echo ""

# 5. Clerk Configuration
echo "5️⃣  Clerk Setup"
echo "   ✓ Allowed URLs in Clerk Dashboard includes Vercel domain"
echo "   ✓ Allowed URLs includes http://localhost:3000 for testing"
echo "   ✓ Webhook URL configured (if using webhooks)"
echo ""

# 6. Stripe Configuration
echo "6️⃣  Stripe Setup (if payment enabled)"
echo "   ✓ Get STRIPE_WEBHOOK_SECRET from Webhook settings"
echo "   ✓ Set webhook URL: https://your-domain.vercel.app/api/webhooks/stripe"
echo "   ✓ Use test keys for preview deployments"
echo ""

# 7. Deployment
echo "7️⃣  Final Deployment Steps"
echo "   1. Push code to GitHub: git push"
echo "   2. Vercel auto-deploys on main branch"
echo "   3. Check Vercel Deployments tab for status"
echo "   4. View logs if errors occur"
echo ""

# 8. Post-Deployment Tests
echo "8️⃣  Post-Deployment Verification"
echo "   ✓ Visit https://your-domain.vercel.app"
echo "   ✓ Check Browser Console for errors (F12)"
echo "   ✓ Try signing in with Clerk"
echo "   ✓ Navigate to Dashboard (requires auth)"
echo "   ✓ Check Network tab for 404s on static assets"
echo ""

# 9. Troubleshooting
echo "9️⃣  If You See Errors:"
echo ""
echo "   'Syntax error in Manifest':"
echo "   → Already fixed in generate-metadata.ts and manifest.json created"
echo ""
echo "   '404 favicon.ico' or '404 icons/logo.png':"
echo "   → favicon.ico and manifest.json created in public/"
echo ""
echo "   'Server Components render error':"
echo "   → Check Vercel logs: vercel logs --prod"
echo "   → Verify DATABASE_URL in Environment Variables"
echo "   → Ensure MongoDB allows Vercel IP addresses"
echo "   → Run 'npm run build' locally to catch errors early"
echo ""
echo "   'Service worker port error':"
echo "   → This is usually from browser extensions, not your app"
echo "   → Safe to ignore in browser console"
echo ""

echo ""
echo "✅ Deployment checklist complete!"
echo ""
echo "For detailed setup instructions, see VERCEL_ENV_VARS.md"
