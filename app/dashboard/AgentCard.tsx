import Link from "next/link";
import type { Agent } from "./types";
import ApproveButton from "./ApproveButton";

export default function AgentCard({
  agent,
  onApprove,
  approving,
}: {
  agent: Agent;
  onApprove: (id: string) => void;
  approving: boolean;
}) {
  const waiting = agent.status === "waiting";

  return (
    <article className="group relative rounded-2xl border border-ink/[0.07] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_-20px_rgba(17,18,26,0.25)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: agent.color }}
          />
          <h3 className="text-[15px] font-bold tracking-tight text-ink">
            {agent.name}
          </h3>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            waiting ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${waiting ? "bg-amber-500" : "bg-emerald-500"}`}
          />
          {waiting ? "Waiting" : "Working"}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-ink/80">{agent.currentTask}</p>

      {waiting ? (
        <div className="mt-4">
          <ApproveButton
            color={agent.color}
            approving={approving}
            onApprove={() => onApprove(agent.id)}
          />
        </div>
      ) : (
        <div className="mt-4">
          <div
            className="h-1.5 overflow-hidden rounded-full bg-mist"
            role="progressbar"
            aria-valuenow={agent.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${agent.name} progress`}
          >
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${agent.progress}%`, backgroundColor: agent.color }}
            />
          </div>
          <p className="mt-2.5 text-xs text-muted">
            <span className="font-semibold text-ink/70">{agent.progress}%</span>
          </p>
        </div>
      )}
    <Link href={`/dashboard/agents/${agent.id}`} aria-label={`Open ${agent.name} workspace`} className="absolute inset-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-electric-violet/40"><span className="sr-only">Open {agent.name}</span></Link>
    </article>
  );
}
