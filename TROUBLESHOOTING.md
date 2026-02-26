# Cart & Wishlist Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to update cart" / 401 Unauthorized

**Symptoms:**
- Error message: "Session expired. Please log in again."
- HTTP 401 status code
- Cart/wishlist operations fail immediately after login

**Possible Causes:**
- Token not being sent in Authorization header
- Token expired or invalid
- Session not fully loaded when button clicked
- API expects different auth format

**Solutions:**

#### Check 1: Verify Environment Variable
```bash
# Make sure NEXT_PUBLIC_BASE_URL is set correctly
# Check .env.local file
NEXT_PUBLIC_BASE_URL=https://your-api-url.com/api/v1
```

#### Check 2: Verify Token in Browser Console
Open browser DevTools (F12) and run:
```javascript
// Check if session has token
const session = await fetch('/api/auth/session').then(r => r.json());
console.log('Session:', session);
console.log('Has token:', !!session.token);
```

#### Check 3: Inspect Network Request
1. Open DevTools → Network tab
2. Click "Add to Cart"
3. Find the POST request to `/cart`
4. Check Headers tab:
   - Should have: `Authorization: Bearer <your-token>`
   - Should have: `Content-Type: application/json`

#### Check 4: Verify API Expectations
Some APIs expect different formats:
- `Authorization: Bearer <token>` (most common) ✅
- `Authorization: <token>` (no Bearer prefix)
- `x-auth-token: <token>` (custom header)
- `token: <token>` (custom header)

**If your API uses a different format**, update `shopmart/src/services/cart.services.ts`:
```typescript
function headers(token: string) {
  return {
    "Content-Type": "application/json",
    // Change this line to match your API:
    "x-auth-token": token,  // Example for custom header
  };
}
```

### 2. Token is Undefined

**Symptoms:**
- Console shows: "Authentication token is missing"
- Session status is "loading" when clicking button

**Solution:**
The updated code now:
- Checks if session is still loading
- Shows "Please wait..." message
- Disables buttons during loading
- Throws clear error if token is missing

### 3. Race Condition / Multiple Requests

**Symptoms:**
- Multiple API calls when clicking once
- Duplicate items in cart

**Solution:**
The updated code now:
- Uses loading states (`isAddingToCart`, `isTogglingWishlist`)
- Disables buttons during operations
- Prevents duplicate requests

### 4. Silent Failures

**Symptoms:**
- No error message shown
- Console shows generic "Failed to add to cart"

**Solution:**
The updated code now:
- Logs detailed error information to console
- Shows specific error messages to users
- Includes HTTP status codes and response data

## Debugging Steps

### Step 1: Enable Debug Logging

Add this to your component to see detailed token info:

```typescript
import { debugToken, debugSession } from "@/lib/debug-auth";

// In your component
const { data: session } = useSession();
debugSession(session, "ProductCardActions");
debugToken(session?.token, "Before API call");
```

### Step 2: Check Browser Console

Look for these log messages:
- `Cart API Error [add to cart]:` - Shows full error details
- `Token Debug:` - Shows token status (if using debug utils)
- `Session Debug:` - Shows session structure

### Step 3: Test Authentication

```typescript
// Add this temporarily to test if auth works
const testAuth = async () => {
  const session = await fetch('/api/auth/session').then(r => r.json());
  console.log('Session:', session);
  
  if (session.token) {
    const response = await fetch('YOUR_API_URL/cart', {
      headers: {
        'Authorization': `Bearer ${session.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Cart response:', response.status, await response.json());
  }
};
```

### Step 4: Verify NextAuth Configuration

Check `shopmart/src/lib/authOption.ts`:
- Ensure `token` is being stored in JWT callback
- Ensure `token` is being passed to session callback
- Verify `NEXTAUTH_SECRET` is set in `.env.local`

## API Response Format Issues

If your API returns data in a different format, you may need to adjust the parsing logic.

### Current Expected Formats:

**Cart:**
```json
{
  "data": {
    "cart": { ... },
    "cartItems": [...],
    "totalCartPrice": 100
  }
}
```

**Wishlist:**
```json
{
  "data": {
    "wishlist": [...]
  }
}
```

### If Your API Format is Different:

Update the parsing functions in context files:
- `getItemsAndTotal()` in `cart-context.tsx`
- `getItems()` in `wishlist-context.tsx`

## Still Having Issues?

1. Check the browser console for detailed error logs
2. Check the Network tab for actual API responses
3. Verify your API is running and accessible
4. Test API endpoints directly with Postman/curl
5. Ensure CORS is configured correctly on your API
6. Check if your API token has expired (JWT expiration)

## Quick Checklist

- [ ] `NEXT_PUBLIC_BASE_URL` is set in `.env.local`
- [ ] `NEXTAUTH_SECRET` is set in `.env.local`
- [ ] User is logged in (session status is "authenticated")
- [ ] Token exists in session (`session.token` is not undefined)
- [ ] API is running and accessible
- [ ] Authorization header format matches API expectations
- [ ] API returns expected response format
- [ ] No CORS errors in console
- [ ] Token is not expired
