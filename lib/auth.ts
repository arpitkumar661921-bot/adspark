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
