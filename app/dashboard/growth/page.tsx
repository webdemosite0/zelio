import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function GrowthPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const [company, tasks, agents] = await Promise.all([
    db.getCompany(user.id),
    db.listTasks(user.id),
    db.listAgents(user.id),
  ]);

  const completed = tasks.filter((task) => task.done).length;
  const active = agents.filter((agent) => agent.status === "working").length;
  const growthAgent = agents.find((agent) => agent.name === "Marketing") ?? agents[0];

  return (
    <main className="mx-auto max-w-6xl px-4 py-9 sm:px-6">
      <p className="text-xs font-extrabold uppercase tracking-[.18em] text-hot-pink">Growth</p>
      <h1 className="mt-2 text-4xl font-extrabold">Growth command center.</h1>
      <p className="mt-2 text-muted">A live operating view for {company.name}.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6">
          <p className="text-sm font-bold text-muted">Tasks completed</p>
          <p className="mt-2 text-4xl font-extrabold">{completed}</p>
        </div>
        <div className="rounded-2xl bg-white p-6">
          <p className="text-sm font-bold text-muted">Open work</p>
          <p className="mt-2 text-4xl font-extrabold">{tasks.length - completed}</p>
        </div>
        <div className="rounded-2xl bg-white p-6">
          <p className="text-sm font-bold text-muted">Active specialists</p>
          <p className="mt-2 text-4xl font-extrabold">{active}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-ink/[.07] bg-white p-6">
        <h2 className="font-extrabold">Workspace focus</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink/70">
          {String(company.workspaceConfig.focus || "Build, learn and grow.")}
        </p>
        {growthAgent ? (
          <Link
            href={`/dashboard/agents/${growthAgent.id}`}
            className="mt-5 inline-block rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white"
          >
            Open Growth specialist →
          </Link>
        ) : null}
      </div>
    </main>
  );
}
