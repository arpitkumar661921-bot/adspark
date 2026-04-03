import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";
import { getEnv } from "@/lib/env";

const env = getEnv();

const providers = [
  Google({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET
  })
];

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
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "database"
  },
  providers,
  pages: {
    signIn: "/login"
  },
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
      await prisma.user.update({
        where: { id: user.id! },
        data: {
          plan: "free",
          credits: 5,
          lastCreditReset: new Date()
        }
      });
    }
  }
});
