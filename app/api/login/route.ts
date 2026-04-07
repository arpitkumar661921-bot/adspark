import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Return the auth callback URL that the client should post to
    return NextResponse.json({ 
      success: true, 
      callbackUrl: `/api/auth/callback/credentials?email=${encodeURIComponent(email)}`
    });
  } catch (error) {
    console.error("[v0] Login error:", error);
    return NextResponse.json({ error: "Sign in failed" }, { status: 500 });
  }
}
