"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ZelioLogo from "@/components/ZelioLogo";
import AgentCard from "./AgentCard";
import UpNext from "./UpNext";
import CommandBar from "./CommandBar";
import type { Agent, TaskItem, ActivityItem } from "./types";
import { timeAgo } from "./types";

function NavIcon({ d }: { d: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d}
    </svg>
  );
}

const NAV = [
  {
    label: "HQ",
    active: true,
    icon: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
      </>
    ),
  },
  {
    label: "Team",
    active: false,
    icon: (
      <>
        <circle cx="9" cy="8" r="3.4" />
        <path d="M3.5 19.5c.6-3.2 2.9-4.8 5.5-4.8s4.9 1.6 5.5 4.8" />
        <path d="M15.5 5.3a3.4 3.4 0 0 1 0 5.7M18.3 15.2c1.3.8 2.1 2 2.4 3.8" />
      </>
    ),
  },
  {
    label: "Work",
    active: false,
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3.5" />
        <path d="m8.6 12.4 2.4 2.4 4.4-4.9" />
      </>
    ),
  },
  {
    label: "Files",
    active: false,
    icon: (
      <path d="M3.5 7.2a2 2 0 0 1 2-2h4l2 2.6h7a2 2 0 0 1 2 2v6.4a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7.2z" />
    ),
  },
  {
    label: "Growth",
    active: false,
    icon: (
      <>
        <path d="M3.5 17.5 9.2 12l3.4 3.4 7.9-8.4" />
        <path d="M15 7h5.5v5.5" />
      </>
    ),
  },
];

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${url}`);
  return res.json() as Promise<T>;
}

export default function DashboardClient({ userName }: { userName: string }) {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const [tasks, setTasks] = useState<TaskItem[] | null>(null);
  const [activity, setActivity] = useState<ActivityItem[] | null>(null);
  const [error, setError] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      const [a, t, act] = await Promise.all([
        getJSON<{ agents: Agent[] }>("/api/agents"),
        getJSON<{ tasks: TaskItem[] }>("/api/tasks"),
        getJSON<{ activity: ActivityItem[] }>("/api/activity"),
      ]);
      setAgents(a.agents);
      setTasks(t.tasks);
      setActivity(act.activity);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refreshActivity = useCallback(async () => {
    try {
      const act = await getJSON<{ activity: ActivityItem[] }>("/api/activity");
      setActivity(act.activity);
    } catch {
      /* activity refresh is best-effort */
    }
  }, []);

  const toggleTask = useCallback(
    async (id: string, done: boolean) => {
      setTasks((prev) => prev?.map((t) => (t.id === id ? { ...t, done } : t)) ?? prev);
      try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done }),
        });
        if (!res.ok) throw new Error("toggle failed");
        refreshActivity();
      } catch {
        setTasks((prev) => prev?.map((t) => (t.id === id ? { ...t, done: !done } : t)) ?? prev);
      }
    },
    [refreshActivity]
  );

  const addTask = useCallback(
    async (title: string) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) return;
      const { task } = (await res.json()) as { task: TaskItem };
      setTasks((prev) => [...(prev ?? []), task]);
      refreshActivity();
    },
    [refreshActivity]
  );

  const approveAgent = useCallback(
    async (id: string) => {
      setApprovingId(id);
      try {
        const res = await fetch(`/api/agents/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "working", progress: 5 }),
        });
        if (!res.ok) throw new Error("approve failed");
        const { agent } = (await res.json()) as { agent: Agent };
        setAgents((prev) => prev?.map((a) => (a.id === id ? agent : a)) ?? prev);
        refreshActivity();
      } finally {
        setApprovingId(null);
      }
    },
    [refreshActivity]
  );

  const logout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }, [loggingOut, router]);

  const firstName = userName.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const workingCount = agents?.filter((a) => a.status === "working").length ?? 0;

  return (
    <div className="flex min-h-screen bg-mist text-ink">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-ink/[0.07] bg-white lg:flex">
        <div className="px-5 pb-2 pt-6">
          <ZelioLogo markClassName="h-7 w-7" wordmarkClassName="text-lg font-extrabold tracking-tight text-ink" />
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-3" aria-label="Company">
          {NAV.map((item) => (
            <a
              key={item.label}
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-current={item.active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                item.active ? "bg-mist text-ink" : "text-muted hover:bg-mist/70 hover:text-ink"
              }`}
            >
              <NavIcon d={item.icon} />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="px-3">
          <div aria-hidden="true" className="my-3 h-px bg-ink/[0.06]" />
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-muted transition-colors duration-150 hover:bg-mist/70 hover:text-ink"
          >
            <NavIcon
              d={
                <>
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" />
                </>
              }
            />
            Settings
          </a>
        </div>

        <div className="mt-auto p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-ink/[0.07] bg-mist/60 p-3">
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-signature text-sm font-bold text-white"
            >
              {firstName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink">{userName}</p>
              <p className="truncate text-xs text-muted">Founder</p>
            </div>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              aria-label="Sign out"
              title="Sign out"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors duration-150 hover:bg-white hover:text-ink disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H14" />
                <path d="M10 12h11M18.5 8.5 21.5 12l-3 3.5" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-ink/[0.07] bg-white/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
            <div className="lg:hidden">
              <ZelioLogo markClassName="h-7 w-7" wordmarkClassName="text-lg font-extrabold tracking-tight text-ink" />
            </div>
            <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-md">
              <svg
                viewBox="0 0 20 20"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="9" r="5.5" />
                <path d="m13.2 13.2 3.3 3.3" />
              </svg>
              <input
                placeholder="Ask your company…"
                aria-label="Ask your company"
                className="w-full rounded-full border border-transparent bg-mist py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted/70 outline-none transition-all duration-150 focus:border-electric-violet/40 focus:bg-white focus:ring-4 focus:ring-electric-violet/10"
              />
            </div>
            <div className="ml-auto flex items-center gap-2.5">
              <span className="hidden items-center gap-2 rounded-full border border-ink/[0.07] bg-white px-3.5 py-2 text-xs font-semibold text-ink/80 md:inline-flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {workingCount} agent{workingCount === 1 ? "" : "s"} working
              </span>
              <button
                type="button"
                aria-label="Notifications"
                className="grid h-10 w-10 place-items-center rounded-full border border-ink/[0.07] bg-white text-muted transition-colors duration-150 hover:text-ink"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9.5a6 6 0 0 1 12 0c0 4.5 1.8 5.8 1.8 5.8H4.2S6 13.9 6 9.5" />
                  <path d="M10 19.3a2.2 2.2 0 0 0 4 0" />
                </svg>
              </button>
              <span
                aria-hidden="true"
                className="grid h-10 w-10 place-items-center rounded-full bg-signature text-sm font-bold text-white"
              >
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {greeting}, {firstName}.
          </h1>
          <p className="mt-2 text-[15px] text-muted">Your company is making progress.</p>

          {error ? (
            <div className="mt-8 rounded-2xl border border-ink/[0.07] bg-white p-8 text-center">
              <p className="text-sm font-medium text-ink/80">
                Couldn't load your company data.
              </p>
              <button
                type="button"
                onClick={load}
                className="mt-4 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
              >
                Try again
              </button>
            </div>
          ) : agents === null ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-2xl border border-ink/[0.07] bg-white"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Agent grid */}
              <section aria-label="Your AI team" className="mt-8">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {agents.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      onApprove={approveAgent}
                      approving={approvingId === agent.id}
                    />
                  ))}
                </div>
              </section>

              {/* Activity + Up next */}
              <section className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-ink/[0.07] bg-white p-6">
                  <h2 className="text-base font-bold tracking-tight text-ink">
                    Recent activity
                  </h2>
                  {activity === null ? (
                    <div className="mt-4 flex animate-pulse flex-col gap-3" aria-hidden="true">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-4 rounded bg-mist" />
                      ))}
                    </div>
                  ) : activity.length === 0 ? (
                    <p className="mt-4 text-sm text-muted">Nothing yet — your team just got started.</p>
                  ) : (
                    <ul className="mt-4 flex flex-col">
                      {activity.map((event, i) => (
                        <li key={event.id}>
                          <div className="flex items-start gap-3 py-2.5">
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: event.color ?? "#727586" }}
                            />
                            <p className="min-w-0 flex-1 text-sm text-ink/80">
                              {event.agentName && (
                                <span className="font-semibold text-ink">{event.agentName} </span>
                              )}
                              {event.text}
                            </p>
                            <span className="shrink-0 text-xs text-muted">
                              {timeAgo(event.createdAt)}
                            </span>
                          </div>
                          {i < activity.length - 1 && (
                            <div aria-hidden="true" className="ml-[3px] h-px bg-ink/[0.06]" />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-2xl border border-ink/[0.07] bg-white p-6">
                  <h2 className="text-base font-bold tracking-tight text-ink">Up next</h2>
                  <p className="mt-1 text-sm text-muted">Decisions waiting on you.</p>
                  <div className="mt-3">
                    {tasks === null ? (
                      <div className="flex animate-pulse flex-col gap-3" aria-hidden="true">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="h-8 rounded-xl bg-mist" />
                        ))}
                      </div>
                    ) : (
                      <UpNext tasks={tasks} onToggle={toggleTask} />
                    )}
                  </div>
                </div>
              </section>

              {/* Command bar */}
              <div className="mt-6">
                <CommandBar onCommand={addTask} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
