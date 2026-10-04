import { post } from "./client";

export interface RegisterInput {
  name: string;
  phone: string;
  email?: string;
}

export interface ApiUser {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
}

export async function registerUser({ name, phone, email }: RegisterInput): Promise<ApiUser> {
  const data = await post<{ user: ApiUser }>("/auth/register", {
    name,
    phone,
    email: email?.trim() || undefined, // blank = not provided
  });
  return data.user;
}

/** Decides whether to show sign-in or sign-up fields. */
export async function checkPhone(phone: string): Promise<boolean> {
  const data = await post<{ exists: boolean }>("/auth/check-phone", { phone });
  return data.exists;
}