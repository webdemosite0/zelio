import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const agent = db.getAgentById(id);
  if (!agent) return NextResponse.json({ error: "Agent not found." }, { status: 404 });

  let body: { status?: string; progress?: number; currentTask?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: { status?: "working" | "waiting"; progress?: number; currentTask?: string } = {};
  if (body.status === "working" || body.status === "waiting") {
    data.status = body.status;
  }
  if (typeof body.progress === "number" && Number.isFinite(body.progress)) {
    data.progress = Math.max(0, Math.min(100, Math.round(body.progress)));
  }
  if (typeof body.currentTask === "string" && body.currentTask.trim().length > 0) {
    data.currentTask = body.currentTask.trim().slice(0, 200);
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const updated = db.updateAgent(id, data);
  if (!updated) return NextResponse.json({ error: "Agent not found." }, { status: 404 });

  // Log what changed so the activity feed stays alive.
  if (data.status && data.status !== agent.status) {
    db.addActivity(
      data.status === "working"
        ? `${agent.name}'s ${agent.currentTask || "work"} was approved — it's underway`
        : `${agent.name} is now waiting`,
      agent.name,
      agent.color
    );
  }
  if (data.currentTask && data.currentTask !== agent.currentTask) {
    db.addActivity(`${agent.name} started: ${data.currentTask}`, agent.name, agent.color);
  }
  if (typeof data.progress === "number" && data.progress !== agent.progress) {
    db.addActivity(
      `${agent.name} reached ${data.progress}% on "${updated.currentTask}"`,
      agent.name,
      agent.color
    );
  }

  return NextResponse.json({ agent: updated });
}
