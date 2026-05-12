export function ImageGrid({ images }: { images: string[] }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">Images</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {images.map((src) => (
          <img key={src} src={src} alt="Generated ad visual" className="h-56 w-full rounded-lg object-cover" />
        ))}
      </div>
    </section>
  );
}
