import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HistoryPage() {
  const session = await auth();
  const rows = await prisma.ad.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Generation History</h1>
      <div className="space-y-3">
        {rows.map((row) => (
          <Link key={row.id} href={`/dashboard/${row.id}`} className="block rounded-xl border border-zinc-800 bg-zinc-950 p-4 hover:border-zinc-600">
            <p className="text-sm text-zinc-400">{row.createdAt.toISOString()}</p>
            <p className="mt-1 line-clamp-2">{row.input}</p>
            <p className="mt-1 text-sm text-zinc-400">Platform: {row.platform}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
