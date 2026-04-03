import Link from "next/link";
import { signOut } from "@/lib/auth";

type Props = {
  name?: string | null;
  email?: string | null;
  plan: string;
  creditsLabel: string;
};

export function Navbar({ name, email, plan, creditsLabel }: Props) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
      <Link href="/dashboard" className="text-xl font-bold">AdSpark</Link>
      <div className="flex items-center gap-4 text-sm">
        <span className="rounded bg-zinc-900 px-3 py-1">Plan: {plan.toUpperCase()}</span>
        <span className="rounded bg-zinc-900 px-3 py-1">Credits: {creditsLabel}</span>
        <span className="hidden text-zinc-400 md:block">{name ?? email}</span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="rounded border border-zinc-700 px-3 py-1">Logout</button>
        </form>
      </div>
    </header>
  );
}
