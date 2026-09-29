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

  const doneCount=tasks?.filter(t=>t.done).length??0;
  const waitingCount=agents?.filter(a=>a.status==="waiting").length??0;
  return (
    <main className="page-enter mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 sm:py-10">
      <section className="grid items-end gap-8 border-b border-[var(--z-line)] pb-8 lg:grid-cols-[1fr_380px]">
        <div><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#8a8798]">Company HQ</p><h1 className="mt-2 text-[36px] font-semibold leading-[1.02] tracking-[-.045em] sm:text-[44px]">{greeting}, {firstName}.</h1><p className="mt-3 max-w-xl text-[14px] leading-6 text-muted">Your AI team is operating from shared company context. Direct the company, review execution, and unblock decisions from one place.</p></div>
        <div className="grid grid-cols-3 gap-5 border-l border-[var(--z-line)] pl-0 lg:pl-7"><div><p className="text-[11px] text-muted">Working</p><p className="mt-1 text-xl font-semibold">{agents?.filter(a=>a.status==="working").length??"—"}</p></div><div><p className="text-[11px] text-muted">Waiting</p><p className="mt-1 text-xl font-semibold">{agents?waitingCount:"—"}</p></div><div><p className="text-[11px] text-muted">Completed</p><p className="mt-1 text-xl font-semibold">{tasks?doneCount:"—"}</p></div></div>
      </section>
      <section className="mt-7"><CommandBar onCommand={addTask}/></section>
      {error?<div className="mt-8 border-y border-[var(--z-line)] py-10 text-center"><p className="text-sm text-muted">Couldn't load your company data.</p><button onClick={load} className="z-button z-button-primary mt-4">Try again</button></div>:agents===null?<div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-40 animate-pulse rounded-[14px] bg-[#eff0f3]"/>)}</div>:<>
        <section className="mt-10"><div className="mb-4 flex items-end justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[.13em] text-muted">AI team</p><h2 className="mt-1 text-[20px] font-semibold tracking-[-.025em]">Specialists at work</h2></div><span className="text-[11px] text-muted">{agents.length} specialists</span></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{agents.map(agent=><AgentCard key={agent.id} agent={agent} onApprove={approveAgent} approving={approvingId===agent.id}/>)}</div></section>
        <section className="mt-10 grid gap-10 border-t border-[var(--z-line)] pt-8 lg:grid-cols-[1.2fr_.8fr]">
          <div><div className="flex items-center justify-between"><h2 className="text-[14px] font-semibold">Live company activity</h2><span className="text-[11px] text-muted">Latest</span></div>{activity===null?<div className="mt-4 h-28 animate-pulse bg-[#f1f2f4]"/>:activity.length===0?<p className="mt-5 text-sm text-muted">Your company activity will appear here.</p>:<ul className="mt-3">{activity.slice(0,7).map((event,i)=><li key={event.id} className="grid grid-cols-[12px_1fr_auto] gap-2 border-b border-[var(--z-line)] py-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full" style={{background:event.color??"#727586"}}/><p className="text-[12px] leading-5 text-ink/75">{event.agentName&&<b className="font-semibold text-ink">{event.agentName} · </b>}{event.text}</p><span className="text-[10px] text-muted">{timeAgo(event.createdAt)}</span></li>)}</ul>}</div>
          <aside><h2 className="text-[14px] font-semibold">Founder queue</h2><p className="mt-1 text-[12px] text-muted">Work and decisions that need attention.</p><div className="mt-3 border-t border-[var(--z-line)] pt-2">{tasks===null?<div className="h-28 animate-pulse bg-[#f1f2f4]"/>:<UpNext tasks={tasks} onToggle={toggleTask}/>}</div></aside>
        </section>
      </>}
    </main>
  );
}
