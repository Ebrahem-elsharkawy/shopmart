/**
 * Debugging utilities for authentication issues
 * Use these in development to troubleshoot token problems
 */

export function debugToken(token: string | undefined, context: string) {
    if (process.env.NODE_ENV !== "development") return;

    console.group(`🔍 Token Debug: ${context}`);
    console.log("Token exists:", !!token);
    console.log("Token length:", token?.length ?? 0);

    if (token) {
        // Show first and last 10 chars for verification without exposing full token
        const preview = `${token.slice(0, 10)}...${token.slice(-10)}`;
        console.log("Token preview:", preview);

        // Try to decode JWT (if it's a JWT)
        try {
            const parts = token.split(".");
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                console.log("Token payload:", {
                    exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : "N/A",
                    iat: payload.iat ? new Date(payload.iat * 1000).toISOString() : "N/A",
                    userId: payload.id || payload.sub || payload.userId || "N/A",
                    isExpired: payload.exp ? Date.now() > payload.exp * 1000 : false,
                });
            }
        } catch (e) {
            console.log("Token is not a valid JWT or cannot be decoded");
        }
    } else {
        console.warn("⚠️ Token is missing!");
    }

    console.groupEnd();
}

export function debugSession(session: unknown, context: string) {
    if (process.env.NODE_ENV !== "development") return;

    console.group(`🔍 Session Debug: ${context}`);
    console.log("Session exists:", !!session);
    console.log("Session structure:", {
        hasUser: !!(session as { user?: unknown })?.user,
        hasToken: !!(session as { token?: unknown })?.token,
        keys: session ? Object.keys(session) : [],
    });
    console.groupEnd();
}
