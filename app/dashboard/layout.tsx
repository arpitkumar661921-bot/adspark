import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, plan: true, credits: true }
  });

  const creditsLabel = user?.plan === "pro" ? "Unlimited" : String(user?.credits ?? 0);

  return (
    <div className="min-h-screen">
      <Navbar name={user?.name} email={user?.email} plan={user?.plan ?? "free"} creditsLabel={creditsLabel} />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
