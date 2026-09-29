"use client";

import type { TaskItem } from "./types";

export default function UpNext({
  tasks,
  onToggle,
}: {
  tasks: TaskItem[];
  onToggle: (id: string, done: boolean) => void;
}) {
  if (tasks.length === 0) {
    return (
      <p className="px-2 py-6 text-center text-sm text-muted">
        All clear. Your company is handling everything.
      </p>
    );
  }

  return (
    <ul className="flex flex-col">
      {tasks.map((task, i) => (
        <li key={task.id}>
          <button
            type="button"
            onClick={() => onToggle(task.id, !task.done)}
            aria-pressed={task.done}
            className="group flex w-full items-center gap-3.5 rounded-xl px-2 py-3 text-left transition-colors duration-150 hover:bg-mist"
          >
            <span
              aria-hidden="true"
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-all duration-150 ${
                task.done
                  ? "border-electric-violet bg-electric-violet"
                  : "border-ink/20 bg-white group-hover:border-ink/35"
              }`}
            >
              {task.done && (
                <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m2.5 6.2 2.4 2.4 4.6-5" />
                </svg>
              )}
            </span>
            <span
              className={`text-sm font-medium transition-colors duration-150 ${
                task.done ? "text-muted line-through" : "text-ink/85"
              }`}
            >
              {task.title}
            </span>
          </button>
          {i < tasks.length - 1 && (
            <div aria-hidden="true" className="mx-2 h-px bg-ink/[0.06]" />
          )}
        </li>
      ))}
    </ul>
  );
}
