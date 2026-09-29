"use client";

import { useCallback, useEffect, useState } from "react";

import AgentCard from "./AgentCard";
import UpNext from "./UpNext";
import CommandBar from "./CommandBar";
import type { Agent, TaskItem, ActivityItem } from "./types";
import { timeAgo } from "./types";

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${url}`);
  return res.json() as Promise<T>;
}

export default function DashboardClient({ userName }: { userName: string }) {
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const [tasks, setTasks] = useState<TaskItem[] | null>(null);
  const [activity, setActivity] = useState<ActivityItem[] | null>(null);
  const [error, setError] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

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

  const firstName = userName.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex min-h-screen text-ink">
      <div className="flex min-w-0 flex-1 flex-col">
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
    </main>\n  );\n}
