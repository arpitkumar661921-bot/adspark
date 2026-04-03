import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";
import { getEnv } from "@/lib/env";

const env = getEnv();

const providers = [];

// Only add Google provider if credentials are available
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  );
}

// Only add Email provider if configured
if (env.EMAIL_SERVER && env.EMAIL_FROM) {
  providers.push(
    Email({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET || "development-secret-key-change-in-production",
  trustHost: !!process.env.NEXTAUTH_URL,
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "database"
  },
  providers: providers.length > 0 ? providers : [
    // Fallback provider for development when no OAuth credentials are set
    {
      id: "demo",
      name: "Demo Provider",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        return {
          id: Math.random().toString(36).substr(2, 9),
          email: credentials.email,
          name: credentials.email
        };
      }
    }
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  events: {
    async createUser({ user }) {
      try {
        await prisma.user.update({
          where: { id: user.id! },
          data: {
            plan: "free",
            credits: 5,
            lastCreditReset: new Date()
          }
        });
      } catch (error) {
        console.log("[v0] Error creating user:", error);
      }
    }
  }
});
