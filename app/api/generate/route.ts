import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAdsBundle } from "@/lib/ai";
import { getEnv } from "@/lib/env";

const bodySchema = z.object({
  input: z.string().min(3).max(4000),
  platform: z.string().min(2).max(50)
});

function dayStartUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function POST(req: Request) {
  const env = getEnv();
  if (!env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "AI generation is not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const today = dayStartUTC();

  if (user.plan !== "pro") {
    if (user.lastCreditReset < today) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: 5,
          lastCreditReset: today
        }
      });
    }

    const latestUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!latestUser || latestUser.credits <= 0) {
      return NextResponse.json({ error: "No credits left for today. Upgrade to Pro for unlimited usage." }, { status: 403 });
    }

    const usage = await prisma.usageLog.upsert({
      where: { userId_date: { userId: user.id, date: today } },
      update: {},
      create: { userId: user.id, date: today, count: 0 }
    });

    if (usage.count >= 5) {
      return NextResponse.json({ error: "Free plan limit reached (5/day). Upgrade to Pro." }, { status: 403 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } }
      }),
      prisma.usageLog.update({
        where: { userId_date: { userId: user.id, date: today } },
        data: { count: { increment: 1 } }
      })
    ]);
  }

  const generated = await generateAdsBundle(parsed.data.input, parsed.data.platform);

  const saved = await prisma.ad.create({
    data: {
      userId: user.id,
      input: parsed.data.input,
      platform: parsed.data.platform,
      ads: generated.ads,
      images: generated.images,
      video: generated.video
    }
  });

  return NextResponse.json({
    id: saved.id,
    ads: generated.ads,
    images: generated.images,
    video: generated.video
  });
}
