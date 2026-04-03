type Video = {
  frames: string[];
  narration: string;
  fallback: string;
};

export function VideoPreview({ video }: { video: Video }) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <h2 className="text-xl font-semibold">Video Preview</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-300">
        {video.frames.map((frame) => (
          <li key={frame}>{frame}</li>
        ))}
      </ul>
      <p className="mt-3 text-sm">Narration: {video.narration}</p>
      <p className="mt-2 text-xs text-zinc-400">{video.fallback}</p>
    </section>
  );
}
