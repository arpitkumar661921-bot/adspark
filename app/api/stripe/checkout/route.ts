import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PRO_PLAN_PRICE_ID, stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  if (!stripe || !PRO_PLAN_PRICE_ID) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { plan: true } });
  if (dbUser?.plan === "pro") {
    return NextResponse.json({ error: "You are already on the Pro plan." }, { status: 400 });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email,
    line_items: [{ price: PRO_PLAN_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
    metadata: {
      userId: session.user.id
    }
  });

  return NextResponse.json({ url: checkout.url });
}
