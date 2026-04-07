import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Simply validate the email and return success
    // The client will handle the sign-in redirect
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, redirectUrl: "/api/auth/callback/credentials?email=" + encodeURIComponent(email) });
  } catch (error) {
    console.error("[v0] Signup error:", error);
    return NextResponse.json({ error: "Sign up failed" }, { status: 500 });
  }
}
