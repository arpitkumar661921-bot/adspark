import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 className="text-5xl font-bold">AdSpark</h1>
      <p className="max-w-2xl text-zinc-300">Generate high-converting ad copy, images, and video frames in one click. Upgrade to Pro for unlimited usage.</p>
      <div className="flex gap-4">
        <Link href="/signup" className="rounded-lg bg-white px-6 py-3 font-semibold text-black">Sign Up</Link>
        <Link href="/login" className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold">Login</Link>
        <Link href="/dashboard" className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold">Open Dashboard</Link>
      </div>
    </main>
  );
}
