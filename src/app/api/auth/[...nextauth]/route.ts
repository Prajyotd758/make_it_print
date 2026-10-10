import NextAuth, { type NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

interface LoginData extends Tokens {
  user: { id: string; name: string | null; phone: string };
}

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

type AuthResult<T> = { ok: true; data: T } | { ok: false; status: number };

async function callAuth<T>(
  path: string,
  body: unknown
): Promise<AuthResult<T>> {
  try {
    const res = await fetch(`${API_URL}/auth/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": process.env.INTERNAL_API_KEY!,
      },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => null);
    if (res.ok && json?.success) return { ok: true, data: json.data as T };
    return { ok: false, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

async function doRefresh(token: JWT): Promise<JWT> {
  const r = await callAuth<Tokens>("refresh", {
    refreshToken: token.refreshToken,
  });

  if (r.ok) {
    return {
      ...token,
      accessToken: r.data.accessToken,
      refreshToken: r.data.refreshToken ?? token.refreshToken,
      accessExpires: expOf(r.data.accessToken),
      error: undefined,
    };
  }
  if (r.status === 0 || r.status >= 500) return token; // transient: retry next time
  return { ...token, error: "RefreshFailed" }; // rejected: really expired
}

// one refresh per refresh token; late parallel callers reuse the result for 10s
const inflight = new Map<string, Promise<JWT>>();
function refresh(token: JWT): Promise<JWT> {
  const key = token.refreshToken!;
  let p = inflight.get(key);
  if (!p) {
    p = doRefresh(token).finally(() =>
      setTimeout(() => inflight.delete(key), 10_000)
    );
    inflight.set(key, p);
  }
  return p;
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
        const r = await callAuth<LoginData>("login", {
          phone: creds.phone,
          ...(creds.name?.trim() && { name: creds.name.trim() }),
        });
        if (!r.ok) return null;
        const data = r.data;
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
          error: undefined,
        };
      }
      if (token.error) return token; // already failed, don't retry a dead token
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
  events: {
    async signOut({ token }) {
      if (token?.refreshToken) {
        await callAuth("logout", { refreshToken: token.refreshToken });
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
