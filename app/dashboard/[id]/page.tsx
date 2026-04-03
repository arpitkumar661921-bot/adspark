import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdCard } from "@/components/AdCard";
import { ImageGrid } from "@/components/ImageGrid";
import { VideoPreview } from "@/components/VideoPreview";

export default async function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  const row = await prisma.ad.findFirst({
    where: { id, userId: session!.user!.id }
  });

  if (!row) notFound();

  const ads = row.ads as { headline: string; body: string; cta: string }[];
  const images = row.images as string[];
  const video = row.video as { frames: string[]; narration: string; fallback: string };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Saved Generation</h1>
      <p className="text-zinc-400">Input: {row.input}</p>
      <section>
        <h2 className="mb-3 text-xl font-semibold">Ads</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {ads.map((ad, i) => (
            <AdCard key={`${ad.headline}-${i}`} ad={ad} />
          ))}
        </div>
      </section>
      <ImageGrid images={images} />
      <VideoPreview video={video} />
    </div>
  );
}
