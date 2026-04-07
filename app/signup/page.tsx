"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        setError("Sign up failed. Please try again.");
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
      <h1 className="text-3xl font-bold">Create Account</h1>
      <p className="text-zinc-400">Join AdSpark to generate amazing ad content</p>
      
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
          className="w-full rounded-lg bg-white px-4 py-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="text-center text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="text-white underline">
          Sign in
        </Link>
      </div>
    </main>
  );
}
