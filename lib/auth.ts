import NextAuth from "next-auth";
import { getEnv } from "@/lib/env";

const env = getEnv();

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        // Generate a consistent user ID from email
        const userId = Buffer.from(credentials.email).toString("base64").substring(0, 24);
        
        return {
          id: userId,
          email: credentials.email,
          name: credentials.email
        };
      }
    }
  ],
  secret: env.NEXTAUTH_SECRET || "development-secret-key-change-in-production",
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
});
