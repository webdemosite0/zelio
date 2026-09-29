"use client";

import { useState } from "react";

type Specialist = { id: string; name: string };

function parseEvent(block: string) {
  const event = block.split("\n").find((line) => line.startsWith("event:"))?.slice(6).trim();
  const data = block.split("\n").find((line) => line.startsWith("data:"))?.slice(5).trim();
  return { event, data };
}

export default function CommandBar({
  onCommand,
}: {
  onCommand: (title: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = value.trim();
    if (!message || sending) return;

    setSending(true);
    setAnswer("");
    setError("");
    setSpecialist(null);

    try {
      await onCommand(message);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text() || "AI request failed.");

      setValue("");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(chunk, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
          const parsed = parseEvent(block);
          if (!parsed.data) continue;
          const data = JSON.parse(parsed.data) as { delta?: string; id?: string; name?: string; error?: string };
          if (parsed.event === "specialist" && data.id && data.name) {
            setSpecialist({ id: data.id, name: data.name });
          } else if (parsed.event === "delta" && data.delta) {
            setAnswer((current) => current + data.delta);
          } else if (parsed.event === "error") {
            throw new Error(data.error || "AI request failed.");
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-3">
      {(sending || answer || error) && (
        <section className="overflow-hidden rounded-[18px] border border-electric-violet/15 bg-white shadow-[0_24px_70px_-38px_rgba(97,87,255,0.55)]">
          <div className="flex items-center justify-between border-b border-ink/[0.06] bg-gradient-to-r from-electric-blue/[0.08] via-plasma-purple/[0.08] to-hot-pink/[0.08] px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                {sending ? <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-violet opacity-50" /> : null}
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-electric-violet" />
              </span>
              <p className="text-sm font-bold text-ink">
                {specialist ? `${specialist.name} specialist` : "ZELIO is routing the work…"}
              </p>
            </div>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-electric-violet">
              GPT-6 Luna
            </span>
          </div>
          <div className="px-5 py-5">
            {error ? (
              <p className="text-sm text-coral">{error}</p>
            ) : answer ? (
              <div className="whitespace-pre-wrap text-[14px] leading-7 text-ink/80">{answer}</div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-electric-blue" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-plasma-purple [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-hot-pink [animation-delay:240ms]" />
                Your AI company is working…
              </div>
            )}
          </div>
        </section>
      )}

      <form
        onSubmit={onSubmit}
        className="flex items-center gap-3 rounded-[14px] border border-electric-violet/15 bg-white p-2.5 pl-3 shadow-[0_18px_50px_-28px_rgba(97,87,255,0.5)] transition-all duration-200 focus-within:border-electric-violet/35 focus-within:shadow-[0_24px_60px_-26px_rgba(97,87,255,0.55)]"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-electric-blue via-electric-violet to-hot-pink text-white shadow-sm">
          <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 2.5v3M10 14.5v3M2.5 10h3M14.5 10h3M4.7 4.7l2.1 2.1M13.2 13.2l2.1 2.1M15.3 4.7l-2.1 2.1M6.8 13.2l-2.1 2.1" />
          </svg>
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Tell your AI company what to do…"
          aria-label="Tell your AI company what to do"
          disabled={sending}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted/70 outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          aria-label="Send command"
          disabled={sending || !value.trim()}
          className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-[10px] bg-ink px-4 text-sm font-bold text-white transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--z-shadow-mid)] active:scale-95 disabled:translate-y-0 disabled:opacity-50"
        >
          {sending ? "Working" : "Run"}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </form>
    </div>
  );
}
