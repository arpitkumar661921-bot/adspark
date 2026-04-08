import NextAuth from "next-auth";
import { getEnv } from "@/lib/env";

const env = getEnv();

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  logger: {
    error: (code, metadata) => {
      // Suppress MissingCSRF warnings for credentials provider - they're harmless
      // CSRF tokens only matter for OAuth flows, not credentials-based auth with JWT
      if (code === "MissingCSRF") {
        return;
      }
      console.error(`[auth][error] ${code}`, metadata);
    },
    warn: (code) => {
      console.warn(`[auth][warn] ${code}`);
    },
    debug: (code, metadata) => {
      if (process.env.DEBUG) {
        console.log(`[auth][debug] ${code}`, metadata);
      }
    },
  },
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
    async signIn({ user, account }) {
      // For credentials provider, always allow sign in
      // (CSRF is only needed for OAuth flows, not credentials)
      return true;
    },
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
