/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL, AUTH_ENDPOINTS } from "@/lib/api";
import { apiCall } from "@/lib/api-utils";
import {
  changePasswordSchemaType,
  forgotPasswordSchemaType,
  loginSchemaType,
  registerSchemaType,
  resetPasswordSchemaType,
} from "@/lib/validationSchema/auth.schema";

export async function signInUser(formData: loginSchemaType): Promise<any> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");

  return apiCall<any>(`${API_URL}${AUTH_ENDPOINTS.signin}`, {
    method: "POST",
    body: JSON.stringify(formData),
    operation: "sign in",
  });
}

export async function signUpUser(formData: registerSchemaType): Promise<any> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");

  return apiCall<any>(`${API_URL}${AUTH_ENDPOINTS.signup}`, {
    method: "POST",
    body: JSON.stringify(formData),
    operation: "sign up",
  });
}

export async function forgotPassword(formData: forgotPasswordSchemaType): Promise<any> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");

  return apiCall<any>(`${API_URL}${AUTH_ENDPOINTS.forgotPassword}`, {
    method: "POST",
    body: JSON.stringify(formData),
    operation: "request password reset",
  });
}

export async function resetPassword(formData: resetPasswordSchemaType): Promise<any> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");

  return apiCall<any>(`${API_URL}${AUTH_ENDPOINTS.resetPassword}`, {
    method: "PUT",
    body: JSON.stringify(formData),
    operation: "reset password",
  });
}

export async function changePassword(formData: changePasswordSchemaType, token: string): Promise<any> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  if (!token) throw new Error("Authentication token is required");

  return apiCall<any>(`${API_URL}${AUTH_ENDPOINTS.changeMyPassword}`, {
    method: "PUT",
    token,
    body: JSON.stringify(formData),
    operation: "change password",
  });
}
