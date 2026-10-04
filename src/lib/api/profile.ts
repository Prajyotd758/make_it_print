import { get, post, patch, del } from "./client";

export interface Address {
  _id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  isDefault?: boolean;
}

export interface OrderSummary {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: { name: string; image?: string }[];
}

export interface Profile {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  addresses: Address[];
  stats: { orders: number; addresses: number };
  recentOrders: OrderSummary[];
}

export const getProfile = (token: string, signal?: AbortSignal) =>
  get<Profile>("/profile/me", { token, signal });

export const deleteAddress = (id: string, token: string) =>
  del<void>(`/addresses/${id}`, { token });


export type AddressInput = Omit<Address, "_id">;

export const createAddress = (b: AddressInput, token: string) =>
  post<Address>("/addresses", b, { token });
export const updateAddress = (id: string, b: AddressInput, token: string) =>
  patch<Address>(`/addresses/${id}`, b, { token });
export const updateProfile = (b: { name: string }, token: string) =>
  patch<Pick<Profile, "name" | "email">>("/profile/me", b, { token });
export const changePassword = (
  b: { currentPassword: string; newPassword: string },
  token: string
) => post<void>("/auth/change-password", b, { token });
