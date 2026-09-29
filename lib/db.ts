// SQLite data layer built on Node's built-in `node:sqlite` (no native deps,
// no binary downloads). Tables are created idempotently on first import,
// so `npm run db:push` and the running server always agree on the schema.

import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { randomUUID } from "node:crypto";

function resolveDbPath(): string {
  const raw = process.env.DATABASE_URL ?? "file:./dev.db";
  const p = raw.startsWith("file:") ? raw.slice("file:".length) : raw;
  return path.isAbsolute(p) ? p : path.join(process.cwd(), p);
}

const globalForDb = globalThis as unknown as { __zelioDb?: DatabaseSync };

function getDb(): DatabaseSync {
  if (!globalForDb.__zelioDb) {
    const sqlite = new DatabaseSync(resolveDbPath());
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        color TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'working',
        current_task TEXT NOT NULL DEFAULT '',
        progress INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0,
        agent_id TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS activity (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        agent_name TEXT,
        color TEXT,
        created_at TEXT NOT NULL
      );
    `);
    globalForDb.__zelioDb = sqlite;
  }
  return globalForDb.__zelioDb;
}

export type DbUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type DbAgent = {
  id: string;
  name: string;
  color: string;
  status: "working" | "waiting";
  currentTask: string;
  progress: number;
};

export type DbTask = {
  id: string;
  title: string;
  done: boolean;
  agentId: string | null;
  createdAt: string;
};

export type DbActivity = {
  id: string;
  text: string;
  agentName: string | null;
  color: string | null;
  createdAt: string;
};

const now = () => new Date().toISOString();
const uid = () => randomUUID();

function rowToUser(r: Record<string, unknown>): DbUser {
  return {
    id: r.id as string,
    name: r.name as string,
    email: r.email as string,
    passwordHash: r.password_hash as string,
    createdAt: r.created_at as string,
  };
}

function rowToAgent(r: Record<string, unknown>): DbAgent {
  return {
    id: r.id as string,
    name: r.name as string,
    color: r.color as string,
    status: r.status === "waiting" ? "waiting" : "working",
    currentTask: r.current_task as string,
    progress: Number(r.progress ?? 0),
  };
}

function rowToTask(r: Record<string, unknown>): DbTask {
  return {
    id: r.id as string,
    title: r.title as string,
    done: Number(r.done) === 1,
    agentId: (r.agent_id as string) ?? null,
    createdAt: r.created_at as string,
  };
}

function rowToActivity(r: Record<string, unknown>): DbActivity {
  return {
    id: r.id as string,
    text: r.text as string,
    agentName: (r.agent_name as string) ?? null,
    color: (r.color as string) ?? null,
    createdAt: r.created_at as string,
  };
}

export const db = {
  // Ensures tables exist (also runs automatically on first query).
  init() {
    getDb();
  },

  createUser(name: string, email: string, passwordHash: string): DbUser {
    const sqlite = getDb();
    const user: DbUser = { id: uid(), name, email, passwordHash, createdAt: now() };
    sqlite
      .prepare(
        "INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)"
      )
      .run(user.id, user.name, user.email, user.passwordHash, user.createdAt);
    return user;
  },

  getUserByEmail(email: string): DbUser | null {
    const row = getDb()
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as Record<string, unknown> | undefined;
    return row ? rowToUser(row) : null;
  },

  getUserById(id: string): DbUser | null {
    const row = getDb()
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(id) as Record<string, unknown> | undefined;
    return row ? rowToUser(row) : null;
  },

  upsertAgent(a: {
    name: string;
    color: string;
    status: "working" | "waiting";
    currentTask: string;
    progress: number;
  }): DbAgent {
    const sqlite = getDb();
    const existing = sqlite
      .prepare("SELECT * FROM agents WHERE name = ?")
      .get(a.name) as Record<string, unknown> | undefined;
    if (existing) {
      sqlite
        .prepare(
          "UPDATE agents SET color = ?, status = ?, current_task = ?, progress = ? WHERE name = ?"
        )
        .run(a.color, a.status, a.currentTask, a.progress, a.name);
      return { ...rowToAgent(existing), ...a };
    }
    const agent: DbAgent = { id: uid(), ...a };
    sqlite
      .prepare(
        "INSERT INTO agents (id, name, color, status, current_task, progress) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(agent.id, agent.name, agent.color, agent.status, agent.currentTask, agent.progress);
    return agent;
  },

  listAgents(): DbAgent[] {
    const rows = getDb()
      .prepare("SELECT * FROM agents ORDER BY name ASC")
      .all() as Record<string, unknown>[];
    return rows.map(rowToAgent);
  },

  getAgentById(id: string): DbAgent | null {
    const row = getDb()
      .prepare("SELECT * FROM agents WHERE id = ?")
      .get(id) as Record<string, unknown> | undefined;
    return row ? rowToAgent(row) : null;
  },

  updateAgent(
    id: string,
    data: { status?: "working" | "waiting"; progress?: number; currentTask?: string }
  ): DbAgent | null {
    const sqlite = getDb();
    const existing = this.getAgentById(id);
    if (!existing) return null;
    const next = {
      status: data.status ?? existing.status,
      progress:
        typeof data.progress === "number"
          ? Math.max(0, Math.min(100, Math.round(data.progress)))
          : existing.progress,
      currentTask: data.currentTask ?? existing.currentTask,
    };
    sqlite
      .prepare("UPDATE agents SET status = ?, progress = ?, current_task = ? WHERE id = ?")
      .run(next.status, next.progress, next.currentTask, id);
    return { ...existing, ...next };
  },

  listTasks(): DbTask[] {
    const rows = getDb()
      .prepare("SELECT * FROM tasks ORDER BY created_at ASC")
      .all() as Record<string, unknown>[];
    return rows.map(rowToTask);
  },

  createTask(title: string, agentId?: string | null): DbTask {
    const task: DbTask = { id: uid(), title, done: false, agentId: agentId ?? null, createdAt: now() };
    getDb()
      .prepare("INSERT INTO tasks (id, title, done, agent_id, created_at) VALUES (?, ?, 0, ?, ?)")
      .run(task.id, task.title, task.agentId, task.createdAt);
    return task;
  },

  getTaskById(id: string): DbTask | null {
    const row = getDb()
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(id) as Record<string, unknown> | undefined;
    return row ? rowToTask(row) : null;
  },

  setTaskDone(id: string, done: boolean): DbTask | null {
    const existing = this.getTaskById(id);
    if (!existing) return null;
    getDb().prepare("UPDATE tasks SET done = ? WHERE id = ?").run(done ? 1 : 0, id);
    return { ...existing, done };
  },

  deleteTask(id: string): boolean {
    const res = getDb().prepare("DELETE FROM tasks WHERE id = ?").run(id);
    return (res.changes as number) > 0;
  },

  countTasks(): number {
    const row = getDb().prepare("SELECT COUNT(*) AS n FROM tasks").get() as { n: number };
    return row.n;
  },

  addActivity(text: string, agentName?: string | null, color?: string | null): DbActivity {
    const entry: DbActivity = {
      id: uid(),
      text,
      agentName: agentName ?? null,
      color: color ?? null,
      createdAt: now(),
    };
    getDb()
      .prepare(
        "INSERT INTO activity (id, text, agent_name, color, created_at) VALUES (?, ?, ?, ?, ?)"
      )
      .run(entry.id, entry.text, entry.agentName, entry.color, entry.createdAt);
    return entry;
  },

  listActivity(limit = 20): DbActivity[] {
    const rows = getDb()
      .prepare("SELECT * FROM activity ORDER BY created_at DESC LIMIT ?")
      .all(limit) as Record<string, unknown>[];
    return rows.map(rowToActivity);
  },

  countActivity(): number {
    const row = getDb().prepare("SELECT COUNT(*) AS n FROM activity").get() as { n: number };
    return row.n;
  },
};
