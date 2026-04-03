import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-full border-b border-zinc-800 p-4 md:w-60 md:border-b-0 md:border-r">
      <nav className="flex flex-row gap-2 md:flex-col">
        <Link href="/dashboard" className="rounded bg-zinc-900 px-3 py-2">Dashboard</Link>
        <Link href="/dashboard/history" className="rounded bg-zinc-900 px-3 py-2">History</Link>
        <Link href="/dashboard/billing" className="rounded bg-zinc-900 px-3 py-2">Billing</Link>
      </nav>
    </aside>
  );
}
