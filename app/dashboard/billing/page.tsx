"use client";

import { useState } from "react";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Billing</h1>
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-2xl font-semibold">Pro Plan</h2>
        <p className="mt-2 text-zinc-300">₹999/month · Unlimited generations · Priority support</p>
        <button disabled={loading} onClick={upgrade} className="mt-4 rounded-lg bg-white px-5 py-2 font-semibold text-black disabled:opacity-50">
          {loading ? "Redirecting..." : "Upgrade to Pro"}
        </button>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
