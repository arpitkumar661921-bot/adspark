import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { getEnv } from "@/lib/env";

const env = getEnv();

export const { handlers, signIn, signOut, auth } = NextAuth({
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
        
        // Create or get user in database
        const user = await prisma.user.upsert({
          where: { email: credentials.email },
          update: {},
          create: {
            email: credentials.email,
            name: credentials.email,
            plan: "free",
            credits: 5,
            lastCreditReset: new Date()
          }
        });
        
        return {
          id: user.id,
          email: user.email,
          name: user.name
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
