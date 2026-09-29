"use client";

import { useState } from "react";

export default function CommandBar({
  onCommand,
}: {
  onCommand: (title: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = value.trim();
    if (!title || sending) return;
    setSending(true);
    try {
      await onCommand(title);
      setValue("");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-3 rounded-2xl border border-ink/[0.07] bg-white p-2.5 pl-3 shadow-[0_16px_40px_-28px_rgba(17,18,26,0.3)] transition-shadow duration-200 focus-within:shadow-[0_20px_48px_-24px_rgba(97,87,255,0.35)]"
    >
      <button
        type="button"
        aria-label="Add attachment"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/10 text-muted transition-colors duration-150 hover:border-ink/25 hover:text-ink"
      >
        <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M10 4.5v11M4.5 10h11" />
        </svg>
      </button>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tell your company what to do…"
        aria-label="Tell your company what to do"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted/70 outline-none"
      />
      <button
        type="submit"
        aria-label="Send"
        disabled={sending || !value.trim()}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-signature text-white transition-all duration-150 hover:brightness-105 active:scale-95 disabled:opacity-60"
      >
        <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 10h13M12.5 5.5 17 10l-4.5 4.5" />
        </svg>
      </button>
    </form>
  );
}
