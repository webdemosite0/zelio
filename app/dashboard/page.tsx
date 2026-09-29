import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "HQ — ZELIO",
  description: "Your company's headquarters. See what your AI team is working on.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return <DashboardClient userName={user.name} />;
}
