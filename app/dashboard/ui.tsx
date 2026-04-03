"use client";

import { useState } from "react";
import { AdCard } from "@/components/AdCard";
import { ImageGrid } from "@/components/ImageGrid";
import { VideoPreview } from "@/components/VideoPreview";

type Result = {
  id: string;
  ads: { headline: string; body: string; cta: string }[];
  images: string[];
  video: { frames: string[]; narration: string; fallback: string };
};

export function DashboardGenerator() {
  const [input, setInput] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const onGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, platform })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Ad Generator</h1>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste product URL or product details..." className="h-32 w-full rounded-lg border border-zinc-700 bg-black p-3" />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="rounded-lg border border-zinc-700 bg-black px-3 py-2">
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube-shorts">YouTube Shorts</option>
            <option value="google-display">Google Display</option>
          </select>
          <button disabled={loading || !input.trim()} onClick={onGenerate} className="rounded-lg bg-white px-4 py-2 font-semibold text-black disabled:opacity-50">
            {loading ? "Generating..." : "Generate Ads"}
          </button>
          {result && (
            <button onClick={() => navigator.clipboard.writeText(result.ads.map((a) => `${a.headline}\n${a.body}\nCTA: ${a.cta}`).join("\n\n"))} className="rounded-lg border border-zinc-700 px-4 py-2">
              Copy all ads
            </button>
          )}
        </div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {loading && <div className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-zinc-500">Generating ads, images, and video frames...</div>}

      {result && (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-xl font-semibold">Generated Ads</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {result.ads.map((ad, index) => (
                <div key={`${ad.headline}-${index}`} className="space-y-2">
                  <AdCard ad={ad} />
                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(`${ad.headline}\n\n${ad.body}\n\nCTA: ${ad.cta}`)}`}
                    download={`adspark-ad-${index + 1}.txt`}
                    className="block text-center text-xs text-zinc-300 underline"
                  >
                    Download ad
                  </a>
                </div>
              ))}
            </div>
          </section>

          <ImageGrid images={result.images} />
          <VideoPreview video={result.video} />
        </div>
      )}
    </div>
  );
}
