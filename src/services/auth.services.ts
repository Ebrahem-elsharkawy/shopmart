import { loginSchemaType } from "@/lib/validationSchema/auth.schema";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const AUTH_ENDPOINTS = { signin: "/auth/signin" };

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