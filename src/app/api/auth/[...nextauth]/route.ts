import NextAuth, { type NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

async function callAuth<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/auth/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key":
          process.env.INTERNAL_API_KEY ??
          "f6d33283c6313f8fca9ce8006f66f9aa9940dd1302ccdf789b3dbe3a959221270f1d363dd95c6441b5259defa7c80bd7",
      },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => null);
    console.log("[auth]", path, res.status, JSON.stringify(json)); // temporary
    return res.ok && json?.success ? (json.data as T) : null;
  } catch (e) {
    console.log("[auth] fetch failed", e); // temporary
    return null;
  }
}

async function refresh(token: JWT): Promise<JWT> {
  const data = await callAuth<Tokens>("refresh", {
    refreshToken: token.refreshToken,
  });
  if (!data) return { ...token, error: "RefreshFailed" };
  return {
    ...token,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? token.refreshToken,
    accessExpires: expOf(data.accessToken),
    error: undefined,
  };
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Phone",
      credentials: { name: {}, phone: {} },
      async authorize(creds) {
        if (!creds?.phone) return null;
        const data = await callAuth<
          Tokens & { user: { id: string; name: string | null; phone: string } }
        >("login", {
          phone: creds.phone,
          ...(creds.name?.trim() && { name: creds.name.trim() }),
        });
        if (!data) return null;
        return {
          id: data.user.id,
          name: data.user.name,
          phone: data.user.phone,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          accessExpires: expOf(data.accessToken),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessExpires: user.accessExpires,
        };
      }
      // refresh 30s before expiry
      if (Date.now() < (token.accessExpires ?? 0) - 30_000) return token;
      return refresh(token);
    },
    async session({ session, token }) {
      session.accessToken = token.error ? undefined : token.accessToken;
      session.error = token.error;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// expiry straight from the JWT, so we don't depend on the API returning expiresIn
const expOf = (jwt: string): number => {
  try {
    const { exp } = JSON.parse(
      Buffer.from(jwt.split(".")[1], "base64url").toString()
    );
    return exp * 1000;
  } catch {
    return Date.now() + 10 * 60 * 1000;
  }
};
