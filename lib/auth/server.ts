import { createNeonAuth } from "@neondatabase/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL || "https://ep-steep-frost-b5fw2k1x.neonauth.c-7.us-east-2.aws.neon.tech/neondb/auth";
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET || process.env.AUTH_SECRET;
if (!cookieSecret) throw new Error("NEON_AUTH_COOKIE_SECRET (or AUTH_SECRET) must be configured.");

export const auth = createNeonAuth({
  baseUrl,
  cookies: { secret: cookieSecret },
  logLevel: "warn",
});

export type SessionUser = { id: string; name: string; email: string };
export async function getSessionUser(): Promise<SessionUser | null> {
  const { data: session } = await auth.getSession();
  const user = session?.user;
  if (!user) return null;
  return { id:user.id, name:user.name || user.email?.split("@")[0] || "Founder", email:user.email || "" };
}
