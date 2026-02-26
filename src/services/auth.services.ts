import { API_URL, AUTH_ENDPOINTS } from "@/lib/api";
import {
  changePasswordSchemaType,
  forgotPasswordSchemaType,
  loginSchemaType,
  registerSchemaType,
  resetPasswordSchemaType,
} from "@/lib/validationSchema/auth.schema";

async function parseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function signInUser(formData: loginSchemaType) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");

  const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.signin}`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error((data?.message as string) || `Sign in failed (${response.status})`);
  }

  return data;
}

export async function signUpUser(formData: registerSchemaType) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");

  const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.signup}`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error((data?.message as string) || `Sign up failed (${response.status})`);
  }

  return data;
}

export async function forgotPassword(formData: forgotPasswordSchemaType) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");

  const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.forgotPassword}`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error((data?.message as string) || `Forgot password request failed (${response.status})`);
  }

  return data;
}

export async function resetPassword(formData: resetPasswordSchemaType) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");

  const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.resetPassword}`, {
    method: "PUT",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error((data?.message as string) || `Reset password failed (${response.status})`);
  }

  return data;
}

export async function changePassword(formData: changePasswordSchemaType, token: string) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  if (!token) throw new Error("Authentication token is required");

  const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.changeMyPassword}`, {
    method: "PUT",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error((data?.message as string) || `Change password failed (${response.status})`);
  }

  return data;
}
