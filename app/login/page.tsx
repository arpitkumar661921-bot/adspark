import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <h1 className="text-3xl font-bold">Login to AdSpark</h1>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/dashboard" });
        }}
      >
        <button className="w-full rounded-lg bg-white px-4 py-3 font-semibold text-black">Continue with Google</button>
      </form>

      <form
        action={async (formData) => {
          "use server";
          const email = String(formData.get("email") ?? "");
          if (!email) return;
          await signIn("email", { email, redirectTo: "/dashboard" });
        }}
        className="space-y-3"
      >
        <input name="email" type="email" placeholder="you@example.com" className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3" required />
        <button className="w-full rounded-lg border border-zinc-600 px-4 py-3 font-semibold">Email me a login link</button>
      </form>
    </main>
  );
}
