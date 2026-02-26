# How to Debug the Cart/Wishlist Issue

## Step-by-Step Instructions

### Step 1: Clear Cache and Restart

The changes haven't taken effect because Next.js is using cached code.

```bash
# In your terminal, from the shopmart directory:

# Stop the dev server (Ctrl+C if running)

# Delete the .next cache folder (already done)
# rm -rf .next  (on Mac/Linux)
# Remove-Item -Recurse -Force .next  (on Windows PowerShell)

# Start the dev server
npm run dev
```

### Step 2: Use the Debug Page

I've created a special debug page to test your API authentication.

1. **Make sure you're logged in** to your app

2. **Navigate to:** `http://localhost:3000/debug-auth`

3. **Click "Run API Tests"**

4. **Check the results** - It will test 4 different authentication formats:
   - Test 1: `Authorization: Bearer <token>` (most common)
   - Test 2: `Authorization: <token>` (no Bearer)
   - Test 3: `x-auth-token: <token>` (custom header)
   - Test 4: `token: <token>` (custom header)

5. **Look for which test PASSES** (status 200)

### Step 3: Update Your Code

Once you know which format works, update the `headers()` function in both:
- `shopmart/src/services/cart.services.ts`
- `shopmart/src/services/wishlist.services.ts`

#### If Test 1 Passes (Bearer format):
```typescript
// This is already the default - no changes needed!
function headers(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
```

#### If Test 2 Passes (No Bearer):
```typescript
function headers(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: token,  // Remove "Bearer "
  };
}
```

#### If Test 3 Passes (x-auth-token):
```typescript
function headers(token: string) {
  return {
    "Content-Type": "application/json",
    "x-auth-token": token,  // Different header name
  };
}
```

#### If Test 4 Passes (token):
```typescript
function headers(token: string) {
  return {
    "Content-Type": "application/json",
    "token": token,  // Different header name
  };
}
```

### Step 4: What If All Tests Fail?

If all 4 tests fail, check the error messages in the debug page. Common issues:

#### Status 404 - Wrong URL
```
❌ Problem: API endpoint doesn't exist
✅ Solution: Check NEXT_PUBLIC_BASE_URL in .env.local

# Should be something like:
NEXT_PUBLIC_BASE_URL=https://your-api.com/api/v1

# Make sure:
# - No trailing slash
# - Correct domain
# - Correct path
```

#### Status 0 - CORS or Network Error
```
❌ Problem: Can't reach the API
✅ Solutions:
1. Check if API is running
2. Check for CORS errors in browser console
3. Verify API allows requests from localhost:3000
4. Try accessing API URL directly in browser
```

#### Status 500 - Server Error
```
❌ Problem: API is crashing
✅ Solutions:
1. Check API server logs
2. Verify token format is correct
3. Check if API expects additional headers
```

#### Token Expired
```
❌ Problem: Token is expired
✅ Solution: Logout and login again

The debug page will show:
"Token expired: ❌ YES"
```

### Step 5: Check Environment Variables

Make sure your `.env.local` file exists and has the correct values:

```bash
# View your .env.local
cat .env.local  # Mac/Linux
type .env.local  # Windows CMD
Get-Content .env.local  # Windows PowerShell
```

Should contain:
```
NEXT_PUBLIC_BASE_URL=https://your-api-url.com/api/v1
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

**IMPORTANT:** After changing `.env.local`, you MUST restart the dev server!

### Step 6: Verify the Enhanced Logging Works

After restarting the dev server:

1. Go to any page with cart/wishlist
2. Open browser console (F12)
3. Try to add something to cart
4. You should now see detailed logs like:

```
🔍 Cart POST Request: {
  url: "...",
  productId: "...",
  quantity: 1,
  hasToken: true,
  body: "..."
}

Cart API Error [add to cart]: {
  status: 401,
  statusText: "Unauthorized",
  contentType: "application/json",
  data: { message: "Invalid token" },
  rawText: "{\"message\":\"Invalid token\"}",
  url: "https://..."
}
```

If you still see empty `{}`, the cache wasn't cleared properly. Try:
```bash
# Delete cache again
Remove-Item -Recurse -Force .next

# Delete node_modules/.cache if it exists
Remove-Item -Recurse -Force node_modules/.cache

# Restart dev server
npm run dev
```

## Quick Checklist

- [ ] Dev server restarted after clearing cache
- [ ] Logged in to the app
- [ ] Visited `/debug-auth` page
- [ ] Ran API tests
- [ ] Identified which test passes
- [ ] Updated `headers()` function in service files
- [ ] Restarted dev server after changes
- [ ] Tested cart/wishlist functionality

## Common Solutions Summary

### 90% of issues are one of these:

1. **Wrong auth header format** → Use debug page to find correct format
2. **Token expired** → Logout and login again
3. **Wrong API URL** → Check NEXT_PUBLIC_BASE_URL
4. **Cache not cleared** → Delete .next folder and restart
5. **Env vars not loaded** → Restart dev server after changing .env.local

## Still Not Working?

If you've tried everything above and it still doesn't work:

1. **Share the debug page results** - Copy the entire output
2. **Share your API documentation** - What auth format does it expect?
3. **Share the Network tab** - Screenshot of the failed request
4. **Share your .env.local** - (Hide sensitive values)
5. **Share API logs** - What does your backend show?

## Next Steps

Once you identify the working auth format:

1. Update both service files
2. Test cart and wishlist
3. Delete the debug page if you want (optional)
4. Deploy with confidence!

The debug page at `/debug-auth` will remain available for future troubleshooting.
