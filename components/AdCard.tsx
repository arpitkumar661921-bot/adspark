type Ad = { headline: string; body: string; cta: string };

export function AdCard({ ad }: { ad: Ad }) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <h3 className="text-lg font-semibold">{ad.headline}</h3>
      <p className="mt-2 text-zinc-300">{ad.body}</p>
      <p className="mt-4 text-sm font-semibold text-emerald-300">CTA: {ad.cta}</p>
    </article>
  );
}
