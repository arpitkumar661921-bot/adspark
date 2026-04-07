import { signIn } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await signIn("credentials", { email, redirect: false });
    
    return NextResponse.json({ success: true, redirectUrl: "/dashboard" });
  } catch (error) {
    console.error("[v0] Signup error:", error);
    return NextResponse.json({ error: "Sign up failed" }, { status: 500 });
  }
}
