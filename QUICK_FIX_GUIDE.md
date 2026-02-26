# Quick Fix Guide - Cart/Wishlist 401 Error

## 🚨 SEEING EMPTY ERROR `{}`? READ DEBUG_INSTRUCTIONS.md FIRST!

If you see `Wishlist API Error [load wishlist]: {}`, the updated code now shows MORE details. Check the console for:
- `status` - The HTTP status code (401, 404, 500, etc.)
- `rawText` - The actual response from your API
- `url` - The endpoint being called

See `DEBUG_INSTRUCTIONS.md` for detailed debugging steps.

## TL;DR - Most Common Fixes

### Fix #1: Check Environment Variables (90% of issues)

```bash
# In shopmart/.env.local - make sure these are set:
NEXT_PUBLIC_BASE_URL=https://your-api-url.com/api/v1
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

**Important:** No trailing slash on `NEXT_PUBLIC_BASE_URL`!

### Fix #2: Verify You're Logged In

```javascript
// Open browser console (F12) and run:
fetch('/api/auth/session').then(r => r.json()).then(console.log)

// Should show:
// { user: {...}, token: "eyJ..." }
// If token is missing, logout and login again
```

### Fix #3: Check Authorization Header Format

Your API might expect a different format. Check Network tab in DevTools:

**Current format (most common):**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**If your API uses different format**, edit `shopmart/src/services/cart.services.ts` and `wishlist.services.ts`:

```typescript
// Option A: No "Bearer" prefix
function headers(token: string) {
  return {
    "Content-Type": "application/json",
    "Authorization": token,  // Remove "Bearer"
  };
}

// Option B: Custom header name
function headers(token: string) {
  return {
    "Content-Type": "application/json",
    "x-auth-token": token,  // Different header name
  };
}

// Option C: Token in body instead of header
// (Less common, not recommended)
```

### Fix #4: Token Expired

```bash
# If token expired, just logout and login again
# Or check token expiration in console:

const session = await fetch('/api/auth/session').then(r => r.json());
const payload = JSON.parse(atob(session.token.split('.')[1]));
console.log('Expires:', new Date(payload.exp * 1000));
console.log('Is expired:', Date.now() > payload.exp * 1000);
```

## Quick Debugging Checklist

Run through these in order:

1. ✅ **Environment variables set?**
   - Check `.env.local` file exists
   - Check `NEXT_PUBLIC_BASE_URL` is correct
   - Restart dev server after changing env vars

2. ✅ **Logged in?**
   - Check session in console (see Fix #2)
   - Try logout → login again

3. ✅ **API running?**
   - Can you access API directly in browser?
   - Check API logs for incoming requests

4. ✅ **Network request correct?**
   - Open DevTools → Network tab
   - Click "Add to Cart"
   - Check request headers include Authorization

5. ✅ **CORS configured?**
   - Check console for CORS errors
   - API must allow requests from your Next.js domain

## What Changed in the Fix

The code now:
- ✅ Shows clear error messages (not just "Failed to update cart")
- ✅ Validates token before making requests
- ✅ Prevents button spam with loading states
- ✅ Logs detailed error info to console
- ✅ Handles session loading state
- ✅ Shows specific errors for 401, 403, 404

## Still Not Working?

See `TROUBLESHOOTING.md` for detailed debugging steps.

## Test Your Fix

```typescript
// Add this to any component temporarily to test:
const testCart = async () => {
  try {
    const { addToCart } = useCart();
    await addToCart("test-product-id", 1);
    console.log("✅ Cart working!");
  } catch (error) {
    console.error("❌ Cart error:", error);
  }
};
```

## Common API Variations

### If your API returns different response format:

**Example 1: Direct array**
```json
// API returns: [{ product: {...}, quantity: 1 }]
// Instead of: { data: { cartItems: [...] } }
```

**Example 2: Different field names**
```json
// API uses "items" instead of "cartItems"
// API uses "total" instead of "totalCartPrice"
```

**Solution:** Update parsing functions in context files (see TROUBLESHOOTING.md)

### If your API uses different endpoints:

```typescript
// Edit shopmart/src/services/cart.services.ts

// Change from:
fetch(`${API_URL}/cart`)

// To your API's endpoint:
fetch(`${API_URL}/api/cart`)
fetch(`${API_URL}/user/cart`)
fetch(`${API_URL}/v1/shopping-cart`)
```

## Need Help?

1. Check browser console for detailed errors
2. Check Network tab for actual API responses
3. Read `TROUBLESHOOTING.md` for detailed guide
4. Check `CART_WISHLIST_FIXES.md` for what was changed
