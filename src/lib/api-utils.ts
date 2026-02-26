import { signOut, useSession } from "next-auth/react";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

/**
 * Global 401 handler - clears auth state and redirects to login
 */
export function handleGlobal401() {
  if (typeof window !== 'undefined') {
    // Clear any additional storage if needed
    localStorage.removeItem('cart-redirect');
    localStorage.removeItem('wishlist-redirect');
    
    // Sign out and redirect
    signOut({ redirect: false }).then(() => {
      window.location.href = '/login';
    });
  }
}

/**
 * Enhanced error handler that manages 401 responses and auth state
 */
export function handleApiError(error: unknown, context: string): ApiError {
  const err = error as { message?: string; status?: number; code?: string };
  // Normalize error to consistent format
  const apiError: ApiError = {
    message: typeof err?.message === 'string' ? err.message : 'Unknown error occurred',
    status: err?.status,
    code: err?.code,
  };

  // Log detailed error in development
  if (process.env.NODE_ENV === "development") {
    console.error(`🔴 API Error [${context}]:`, {
      message: apiError.message,
      status: apiError.status,
      code: apiError.code,
      originalError: error,
    });
  }

  // Handle 401 globally
  if (apiError.status === 401) {
    handleGlobal401();
  }

  return apiError;
}

/**
 * Safe response validation with fallback defaults
 */
export function safeResponseParse<T>(response: unknown, fallback: T): T {
  if (!response || typeof response !== 'object') {
    return fallback;
  }

  const res = response as { data?: T };
  // Handle common API response wrappers
  const candidate = res.data ?? response;
  
  // If candidate is the expected type, return it
  if (Array.isArray(candidate) && Array.isArray(fallback)) {
    return candidate as T;
  }
  
  if (typeof candidate === typeof fallback) {
    return candidate as T;
  }

  return fallback;
}

/**
 * Enhanced response handler with proper 401 management
 */
export async function handleApiResponse(
  response: Response,
  operation: string,
  options: {
    on401?: () => void;
    skipErrorLogging?: boolean;
  } = {}
): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  let data: Record<string, unknown> = {};
  let rawText = "";

  try {
    rawText = await response.text();
    if (rawText) {
      data = JSON.parse(rawText);
    }
  } catch {
    if (!options.skipErrorLogging) {
      console.error(`Failed to parse response for ${operation}:`, rawText);
    }
  }

  // Log all responses in development for debugging
  if (process.env.NODE_ENV === "development" && !options.skipErrorLogging) {
    console.log(`🔍 API Response [${operation}]:`, {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      contentType,
      rawTextLength: rawText.length,
      rawText: rawText.substring(0, 500),
    });
  }

  if (!response.ok) {
    // Handle 401 Unauthorized - trigger global auth cleanup
    if (response.status === 401) {
      if (options.on401) {
        options.on401();
      } else {
        handleGlobal401();
      }
      const error = new Error("Session expired. Please log in again.");
      (error as Error & { status?: number }).status = 401;
      throw error;
    }

    // Handle other specific error cases
    if (response.status === 403) {
      throw new Error("Access denied. Please check your permissions.");
    }
    if (response.status === 404) {
      throw new Error("Resource not found.");
    }
    if (response.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }

    const message = (data?.message as string) || (data?.error as string) || `Failed to ${operation} (${response.status})`;
    const error = new Error(message);
    (error as { status?: number }).status = response.status;
    throw error;
  }

  return data;
}

/**
 * Hook for API operations with automatic auth handling
 */
export function useApiAuth() {
  const { data: session, status } = useSession();

  const handle401 = () => {
    handleGlobal401();
  };

  const isAuthenticated = status === "authenticated" && !!session?.token;
  const isLoading = status === "loading";

  return {
    session,
    status,
    token: session?.token,
    isAuthenticated,
    isLoading,
    handle401,
  };
}

/**
 * Common headers factory with auth token
 */
export function createApiHeaders(token: string, additionalHeaders: Record<string, string> = {}) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...additionalHeaders,
  };
}

/**
 * Wrapper for API calls with consistent error handling
 */
export async function apiCall<T>(
  url: string,
  options: RequestInit & {
    token?: string;
    on401?: () => void;
    operation?: string;
    fallback?: T;
  } = {}
): Promise<T> {
  const { token, on401, operation = "API call", fallback, ...fetchOptions } = options;

  if (!token) {
    throw new Error("Authentication token is required");
  }

  const response = await fetch(url, {
    headers: createApiHeaders(token),
    ...fetchOptions,
  });

  try {
    const data = await handleApiResponse(response, operation, { on401 });
    return data as T;
  } catch (error) {
    if (fallback && (error as { status?: number }).status !== 401) {
      return fallback;
    }
    throw error;
  }
}
