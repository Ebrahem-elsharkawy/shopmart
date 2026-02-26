import { signInUser } from "@/services/auth.services";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

interface DecodedTokenType {
  id?: string;
  sub?: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const response = await signInUser({
          email: credentials.email,
          password: credentials.password,
        });

        if (!response || typeof response !== "object") {
          throw new Error("Invalid response from server");
        }

        const r = response as { token?: string; message?: string; statusMsg?: string };

        // ✅ أهم تعديل: تحقق من وجود token فقط
        if (!r?.token) {
          throw new Error(r?.message || r?.statusMsg || "Incorrect email or password");
        }

        const token = r.token;

        // Decode token safely
        let decoded: DecodedTokenType;
        try {
          decoded = jwtDecode(token);
        } catch {
          throw new Error("Invalid token received from server");
        }

        const userId = decoded?.id || decoded?.sub || decoded?.userId;
        if (!userId) throw new Error("Invalid token: missing user id");

        const userInfo = {
          name: decoded?.name || "",
          email: decoded?.email || credentials.email,
          role: decoded?.role || "user",
        };

        return {
          id: String(userId),
          user: userInfo,
          token: token,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.token = user.token;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session && token) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user = token.user as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).token = token.token;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).id = token.id;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};