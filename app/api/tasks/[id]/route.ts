import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  const task = db.getTaskById(id);
  if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });

  let body: { done?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof body.done !== "boolean") {
    return NextResponse.json({ error: "done must be true or false." }, { status: 400 });
  }

  const updated = db.setTaskDone(id, body.done);
  db.addActivity(
    body.done ? `completed "${task.title}"` : `reopened "${task.title}"`,
    user.name,
    "#6157FF"
  );

  return NextResponse.json({ task: updated });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { id } = await params;
  if (!db.deleteTask(id)) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
