#!/bin/bash

# VitalFlow Deployment Validation Script
# Run this to verify all fixes are in place

echo "🔍 VitalFlow Deployment Validation"
echo "===================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASSED=0
FAILED=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 NOT FOUND"
        ((FAILED++))
    fi
}

# Function to check content in file
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $3"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $3"
        ((FAILED++))
    fi
}

echo "📁 Checking Files..."
echo ""

# Check created files
check_file "public/favicon.ico"
check_file "public/manifest.json"
check_file ".env.example"
check_file "VERCEL_ENV_VARS.md"
check_file "DEPLOYMENT_TROUBLESHOOTING.md"
check_file "DEPLOYMENT_CHECKLIST.sh"
check_file "DEPLOYMENT_FIXES_SUMMARY.md"
check_file "QUICK_START_DEPLOY.md"

echo ""
echo "📝 Checking Metadata Configuration..."
echo ""

# Check metadata fixes
check_content "src/utils/generate-metadata.ts" 'manifest: "/manifest.json"' "Manifest reference added"
check_content "src/utils/generate-metadata.ts" '"/icons/logo.svg"' "Logo SVG reference correct"
check_content "src/utils/generate-metadata.ts" 'url: "/icons/logo.svg"' "Icon configuration correct"

# Check manifest doesn't have incorrect config
if ! grep -q 'rel: "manifest"' "src/utils/generate-metadata.ts" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Invalid manifest rel removed"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Invalid manifest rel still present"
    ((FAILED++))
fi

echo ""
echo "🔧 Checking Configuration Files..."
echo ""

# Check manifest.json content
check_content "public/manifest.json" '"name": "VitalFlow' "Manifest name configured"
check_content "public/manifest.json" '"start_url": "/"' "PWA start URL configured"
check_content "public/manifest.json" '"/icons/logo.svg"' "Manifest icons configured"

# Check env.example documentation
check_content ".env.example" "NEXT_PUBLIC_APP_NAME" "App name variable documented"
check_content ".env.example" "DATABASE_URL" "Database URL variable documented"
check_content ".env.example" "CLERK_SECRET_KEY" "Clerk secret documented"
check_content ".env.example" "STRIPE_WEBHOOK_SECRET" "Stripe webhook documented"

echo ""
echo "📊 Summary"
echo "=========="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run build"
    echo "2. Push to GitHub: git push origin main"
    echo "3. Set environment variables in Vercel Dashboard"
    echo "4. Allow MongoDB access from Vercel IP"
    echo "5. Redeploy on Vercel"
    echo ""
    echo "For detailed instructions, see:"
    echo "  - QUICK_START_DEPLOY.md"
    echo "  - VERCEL_ENV_VARS.md"
else
    echo -e "${RED}❌ Some checks failed. Please review the items above.${NC}"
fi

exit $FAILED
