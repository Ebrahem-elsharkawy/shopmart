/**
 * API base URL from environment. Must not include trailing slash.
 * Example: https://your-api.com or https://your-api.com/api/v1
 */
export const API_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

/**
 * Auth endpoints (relative to API_URL). Adjust if your backend uses different paths.
 * Some backends use /auth/register and /auth/login instead of signup/signin.
 */
export const AUTH_ENDPOINTS = {
  signup: "/auth/signup",
  signin: "/auth/signin",
  forgotPassword: "/auth/forgotPassword",
  resetPassword: "/auth/resetPassword",
  changeMyPassword: "/auth/changeMyPassword",
} as const;
