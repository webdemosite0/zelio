"use client";

import { useRef, type CSSProperties, type MouseEvent } from "react";

const AVATARS = [
  { initials: "JK", bg: "linear-gradient(135deg,#258BFF,#6157FF)" },
  { initials: "AS", bg: "linear-gradient(135deg,#FF3E9D,#FF7657)" },
  { initials: "MR", bg: "linear-gradient(135deg,#25E6DA,#258BFF)" },
  { initials: "LT", bg: "linear-gradient(135deg,#FFCB45,#FF7657)" },
];

/**
 * Final call-to-action: a large rounded panel with an intense, cursor-reactive
 * gradient. Blobs drift toward the cursor via CSS variables.
 */
export default function FinalCTA() {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", String((e.clientX - r.left) / r.width));
    el.style.setProperty("--my", String((e.clientY - r.top) / r.height));
  };

  const shift = (fx: number, fy: number): CSSProperties => ({
    transform: `translate(calc((var(--mx, 0.5) - 0.5) * ${
      fx * 120
    }px), calc((var(--my, 0.5) - 0.5) * ${fy * 120}px))`,
  });

  return (
    <section id="get-started" className="bg-white px-4 pb-20 pt-4 sm:px-6 md:pb-28">
      <div
        ref={panelRef}
        onMouseMove={handleMove}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-white px-6 py-16 text-center shadow-[0_32px_80px_-32px_rgba(97,87,255,0.35)] md:py-24"
      >
        {/* Reactive gradient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-hot-pink/[0.35] blur-3xl transition-transform duration-700 ease-out"
            style={shift(-1, -1)}
          />
          <div
            className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-aqua/[0.35] blur-3xl transition-transform duration-700 ease-out"
            style={shift(1, 1)}
          />
          <div
            className="absolute -bottom-24 left-1/4 h-[22rem] w-[22rem] rounded-full bg-solar-yellow/[0.35] blur-3xl transition-transform duration-700 ease-out"
            style={shift(-0.5, 1)}
          />
          <div
            className="absolute -right-20 -top-20 h-[24rem] w-[24rem] rounded-full bg-electric-violet/[0.30] blur-3xl transition-transform duration-700 ease-out"
            style={shift(1, -1)}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[30rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-blue/[0.12] blur-3xl"
          />
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/[0.08] bg-white/80 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-electric-violet shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-electric-violet" />
            Ready to build?
          </span>

          <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl">
            Turn your idea into
            <br />a <span className="text-signature">real business</span> today.
          </h2>

          <p className="mx-auto mt-5 max-w-md text-[16px] text-muted">
            Join 10,000+ founders already building with ZELIO.
          </p>

          <div className="mt-9 flex flex-col items-center gap-5">
            <a
              href="#top"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-base font-semibold text-white transition-all duration-150 hover:scale-[1.04] hover:shadow-[0_16px_40px_-10px_rgba(17,18,26,0.55)] active:scale-95"
            >
              Build my company
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {AVATARS.map((a) => (
                  <span
                    key={a.initials}
                    className="grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold text-white ring-2 ring-white"
                    style={{ background: a.bg }}
                  >
                    {a.initials}
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium text-muted">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
