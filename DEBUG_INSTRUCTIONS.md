# Debug Instructions for Empty Error Response

## What's Happening

You're seeing `Wishlist API Error [load wishlist]: {}` which means:
- ✅ The request is being made
- ✅ The response is coming back with an error status
- ❌ The response body is empty or not being parsed correctly

## Immediate Debugging Steps

### Step 1: Check the Enhanced Console Logs

With the updated code, you should now see MORE detailed logs. Look for:

```
🔍 Wishlist GET Request: {
  url: "...",
  hasToken: true/false,
  tokenPreview: "...",
  headers: {...}
}
```

And then:

```
Wishlist API Error [load wishlist]: {
  status: 401,  // <-- This is the key!
  statusText: "Unauthorized",
  contentType: "...",
  data: {...},
  rawText: "...",  // <-- This shows the actual response
  url: "...",
}
```

### Step 2: What to Look For

**Check the `status` field:**
- `401` = Authentication problem (token invalid/expired/wrong format)
- `404` = Wrong API endpoint URL
- `500` = Server error
- `0` = CORS error or network failure

**Check the `rawText` field:**
- This shows the ACTUAL response from your API
- Even if it's not JSON, you'll see what the server sent

**Check the `url` field:**
- Verify it's pointing to the correct API endpoint
- Should be something like: `https://your-api.com/api/v1/wishlist`

### Step 3: Common Issues Based on Status Code

#### Status 401 (Most Common)

**Problem:** Token format or authentication issue

**Solutions to try:**

1. **Check if your API expects a different header format**

Open `shopmart/src/services/wishlist.services.ts` and try these alternatives:

```typescript
// Current (most common):
function headers(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Alternative 1: No "Bearer" prefix
function headers(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: token,  // Just the token
  };
}

// Alternative 2: Custom header name
function headers(token: string) {
  return {
    "Content-Type": "application/json",
    "x-auth-token": token,  // Different header name
  };
}

// Alternative 3: Lowercase "bearer"
function headers(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,  // Lowercase
  };
}
```

2. **Verify token is valid**

Open browser console and run:
```javascript
// Get current session
const session = await fetch('/api/auth/session').then(r => r.json());
console.log('Session:', session);

// Try to decode token
if (session.token) {
  const parts = session.token.split('.');
  if (parts.length === 3) {
    const payload = JSON.parse(atob(parts[1]));
    console.log('Token payload:', payload);
    console.log('Expires:', new Date(payload.exp * 1000));
    console.log('Is expired:', Date.now() > payload.exp * 1000);
  }
}
```

3. **Test API directly**

```javascript
// In browser console
const session = await fetch('/api/auth/session').then(r => r.json());
const API_URL = "YOUR_API_URL_HERE"; // e.g., https://api.example.com/api/v1

// Test with current format
const response1 = await fetch(`${API_URL}/wishlist`, {
  headers: {
    'Authorization': `Bearer ${session.token}`,
    'Content-Type': 'application/json'
  }
});
console.log('Test 1 (Bearer):', response1.status, await response1.text());

// Test without Bearer
const response2 = await fetch(`${API_URL}/wishlist`, {
  headers: {
    'Authorization': session.token,
    'Content-Type': 'application/json'
  }
});
console.log('Test 2 (No Bearer):', response2.status, await response2.text());

// Test with custom header
const response3 = await fetch(`${API_URL}/wishlist`, {
  headers: {
    'x-auth-token': session.token,
    'Content-Type': 'application/json'
  }
});
console.log('Test 3 (x-auth-token):', response3.status, await response3.text());
```

#### Status 404

**Problem:** Wrong API endpoint

**Solution:** Check your `.env.local`:

```bash
# Make sure this is correct and has NO trailing slash
NEXT_PUBLIC_BASE_URL=https://your-api.com/api/v1

# NOT like this:
# NEXT_PUBLIC_BASE_URL=https://your-api.com/api/v1/
```

Also verify your API actually has a `/wishlist` endpoint. It might be:
- `/api/wishlist`
- `/user/wishlist`
- `/v1/wishlist`
- `/wishlist/items`

#### Status 0 or Network Error

**Problem:** CORS or network issue

**Solutions:**
1. Check browser console for CORS errors
2. Verify API is running and accessible
3. Check if API allows requests from your domain
4. Try accessing API URL directly in browser

### Step 4: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for the request to `/wishlist`
5. Click on it and check:
   - **Headers tab:** See what was sent
   - **Response tab:** See what was received
   - **Preview tab:** See parsed response

### Step 5: Verify Environment Variables

```bash
# In your terminal, from the shopmart directory:
cat .env.local

# Should show:
# NEXT_PUBLIC_BASE_URL=https://...
# NEXTAUTH_SECRET=...
# NEXTAUTH_URL=http://localhost:3000
```

**Important:** After changing `.env.local`, you MUST restart the dev server!

```bash
# Stop the server (Ctrl+C) and restart:
npm run dev
```

## Quick Test Script

Add this to any component temporarily to test the API:

```typescript
"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function DebugComponent() {
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session?.token) {
      console.log("=== DEBUG INFO ===");
      console.log("Has token:", !!session.token);
      console.log("Token length:", session.token.length);
      console.log("API URL:", process.env.NEXT_PUBLIC_BASE_URL);
      
      // Test the API
      const testAPI = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist`, {
          headers: {
            'Authorization': `Bearer ${session.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));
        
        const text = await response.text();
        console.log("Response body:", text);
        
        try {
          const json = JSON.parse(text);
          console.log("Parsed JSON:", json);
        } catch (e) {
          console.log("Response is not JSON");
        }
      };
      
      testAPI();
    }
  }, [session]);
  
  return null;
}
```

## What to Report

If you're still stuck, provide these details:

1. **Status code** from the error log
2. **rawText** from the error log (the actual API response)
3. **url** from the error log (verify it's correct)
4. **Your API documentation** - what auth format does it expect?
5. **Token format** - is it a JWT? (starts with "eyJ...")
6. **Environment variables** - is NEXT_PUBLIC_BASE_URL set correctly?

## Most Likely Solution

Based on the empty response, the most likely issues are:

1. **Wrong Authorization header format** - Try the alternatives in Step 3
2. **Token expired** - Logout and login again
3. **Wrong API URL** - Check NEXT_PUBLIC_BASE_URL
4. **API not running** - Verify backend is accessible

Try these in order and check the enhanced console logs after each attempt!
