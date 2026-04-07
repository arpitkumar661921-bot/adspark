"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        setError("Sign in failed. Please try again.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <h1 className="text-3xl font-bold">Login to AdSpark</h1>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="rounded-lg bg-red-950 px-4 py-2 text-red-200">{error}</div>}
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg border border-zinc-600 px-4 py-3 font-semibold disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in with Email"}
        </button>
      </form>
    </main>
  );
}
