import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { name?: string; email?: string; password?: string };
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    if (!name || name.length > 80) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

    const { data, error } = await auth.signUp.email({ name, email, password });
    if (error) return NextResponse.json({ error: error.message || "Could not create account." }, { status: 400 });
    return NextResponse.json({ ok: true, user: data?.user ?? null }, { status: 201 });
  } catch (error) {
    console.error("register failed", error);
    return NextResponse.json({ error: "Authentication service is temporarily unavailable." }, { status: 502 });
  }
}
