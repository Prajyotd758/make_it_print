import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: "RefreshFailed";
  }
  interface User {
    phone?: string;
    accessToken?: string;
    refreshToken?: string;
    accessExpires?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessExpires?: number;
    error?: "RefreshFailed";
  }
}
