import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { STRIPE_WEBHOOK_SECRET, stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const alreadyProcessed = await prisma.stripeEvent.findUnique({ where: { id: event.id } });
  if (alreadyProcessed) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (userId) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: {
            plan: "pro",
            credits: -1
          }
        }),
        prisma.stripeEvent.create({
          data: {
            id: event.id,
            type: event.type
          }
        })
      ]);
    }
  } else {
    await prisma.stripeEvent.create({
      data: {
        id: event.id,
        type: event.type
      }
    });
  }

  return NextResponse.json({ received: true });
}
