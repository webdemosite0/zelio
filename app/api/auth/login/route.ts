import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";
    const { data, error } = await auth.signIn.email({ email, password });
    if (error) return NextResponse.json({ error: error.message || "Incorrect email or password." }, { status: 401 });
    return NextResponse.json({ ok: true, user: data?.user ?? null });
  } catch (error) {
    console.error("login failed", error);
    return NextResponse.json({ error: "Authentication service is temporarily unavailable." }, { status: 502 });
  }
}
