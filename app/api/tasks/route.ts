import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  return NextResponse.json({ tasks: db.listTasks() });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: { title?: string; agentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = (body.title ?? "").trim().slice(0, 200);
  if (!title) {
    return NextResponse.json({ error: "Task needs a title." }, { status: 400 });
  }

  let agentId: string | null = null;
  if (body.agentId && db.getAgentById(body.agentId)) {
    agentId = body.agentId;
  }

  const task = db.createTask(title, agentId);
  db.addActivity(`added a task: "${title}"`, user.name, "#6157FF");

  return NextResponse.json({ task }, { status: 201 });
}
