"use client";

import { useEffect, useRef, useState } from "react";
import ZelioLogo from "./ZelioLogo";

type Agent = {
  id: string;
  name: string;
  tasks: string;
  color: string;
  softBg: string;
  border: string;
  current: string;
  detail: string;
  x: number; // 0–160 coordinate space
  y: number; // 0–100 coordinate space
  icon: React.ReactNode;
};

const CENTER = { x: 80, y: 50 };

const iconProps = {
  className: "h-3.5 w-3.5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const AGENTS: Agent[] = [
  {
    id: "strategy",
    name: "Strategy",
    tasks: "3 tasks",
    color: "#E8A020",
    softBg: "#FFF6E3",
    border: "#FFE3A3",
    current: "Prioritizing roadmap",
    detail: "Sprint plan · 72%",
    x: 80,
    y: 13,
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </svg>
    ),
  },
  {
    id: "research",
    name: "Research",
    tasks: "2 tasks",
    color: "#0FB5AE",
    softBg: "#E2FAF8",
    border: "#A9EDE9",
    current: "Analyzing competitors",
    detail: "3 sources found",
    x: 22,
    y: 33,
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
  },
  {
    id: "product",
    name: "Product",
    tasks: "4 tasks",
    color: "#B642FF",
    softBg: "#F6E9FF",
    border: "#E3C2FF",
    current: "Drafting PRD",
    detail: "Spec · 64%",
    x: 138,
    y: 33,
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
        <path d="M12 11L4 6.5M12 11l8-4.5M12 11v9" />
      </svg>
    ),
  },
  {
    id: "marketing",
    name: "Marketing",
    tasks: "3 tasks",
    color: "#FF3E9D",
    softBg: "#FFEAF5",
    border: "#FFC9E2",
    current: "Launch campaign",
    detail: "Waiting for approval",
    x: 22,
    y: 69,
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <path d="M3 11l14-6v14L3 13v-2z" />
        <path d="M17 8a4 4 0 010 8" />
      </svg>
    ),
  },
  {
    id: "sales",
    name: "Sales",
    tasks: "3 tasks",
    color: "#FF7657",
    softBg: "#FFEEE7",
    border: "#FFD3C2",
    current: "Qualifying leads",
    detail: "12 new leads",
    x: 138,
    y: 69,
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 4.5a3.5 3.5 0 010 7M18.5 14.5c1.8.8 3 2.6 3 4.5" />
      </svg>
    ),
  },
  {
    id: "development",
    name: "Development",
    tasks: "4 tasks",
    color: "#258BFF",
    softBg: "#E7F2FF",
    border: "#BFE0FF",
    current: "Building landing page",
    detail: "78% · 4 files",
    x: 80,
    y: 87,
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <path d="M8 6l-5 6 5 6M16 6l5 6-5 6" />
      </svg>
    ),
  },
];

const SIDEBAR = [
  { label: "HQ", active: true },
  { label: "Team", active: false },
  { label: "Work", active: false },
  { label: "Files", active: false },
  { label: "Growth", active: false },
];

const AVATARS = [
  { initials: "JK", bg: "linear-gradient(135deg,#258BFF,#6157FF)" },
  { initials: "AS", bg: "linear-gradient(135deg,#FF3E9D,#FF7657)" },
  { initials: "MR", bg: "linear-gradient(135deg,#25E6DA,#258BFF)" },
  { initials: "LT", bg: "linear-gradient(135deg,#FFCB45,#FF7657)" },
];

/**
 * Tilted 3D product mockup of the ZELIO dashboard.
 * Built entirely from divs + SVG — no image assets.
 * Hover an agent node to see its current task; collaboration pulses
 * travel between agents (Research → Strategy → Product → Development).
 */
export default function DashboardPreview() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!reduce && fine) setCanTilt(true);
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !wrapRef.current || !cardRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `rotateX(${4 - py * 5}deg) rotateY(${
      -7 + px * 7
    }deg)`;
  };

  const handleLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="[perspective:1400px]"
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_24px_48px_-24px_rgba(17,18,26,0.16)] transition-transform duration-300 ease-out will-change-transform md:[transform:rotateX(4deg)_rotateY(-7deg)]"
      >
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-ink/[0.06] px-4 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-mist px-3.5 py-2 text-[13px] text-muted">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            Ask your company…
          </div>
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-mist text-ink/70">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
              <path d="M13.7 21a2 2 0 01-3.4 0" />
            </svg>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-hot-pink ring-2 ring-white" />
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: AVATARS[0].bg }}>
            {AVATARS[0].initials}
          </span>
        </div>

        <div className="flex">
          <aside className="hidden w-36 shrink-0 flex-col gap-1 border-r border-ink/[0.06] bg-mist/60 p-3 sm:flex">
            <div className="mb-2 px-2">
              <ZelioLogo markClassName="h-5 w-5" wordmarkClassName="text-sm font-extrabold tracking-tight text-ink" />
            </div>
            {SIDEBAR.map((item) => (
              <span key={item.label} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium ${item.active ? "bg-white text-ink shadow-[0_1px_4px_rgba(17,18,26,0.08)]" : "text-muted"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${item.active ? "bg-electric-violet" : "bg-ink/15"}`} />
                {item.label}
              </span>
            ))}
          </aside>

          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[17px] font-bold tracking-tight text-ink sm:text-lg">Good morning, Alex.</p>
                <p className="text-[13px] text-muted">Your company is making progress.</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                6 agents working
              </span>
            </div>

            <div className="relative mt-2 aspect-[8/5] w-full select-none">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true">
                {AGENTS.map((a) => (
                  <line key={a.id} x1={CENTER.x} y1={CENTER.y} x2={a.x} y2={a.y} stroke={a.color} strokeWidth={hovered === a.id ? 2.6 : 1.1} strokeOpacity={hovered && hovered !== a.id ? 0.12 : 0.4} strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ transition: "stroke-opacity .25s, stroke-width .25s" }} />
                ))}
                <circle r="2.4" fill="#25E6DA" opacity="0.8"><animateMotion dur="5s" repeatCount="indefinite" path="M22 33 L80 13" /></circle>
                <circle r="2.4" fill="#FFCB45" opacity="0.8"><animateMotion dur="5s" begin="-1.6s" repeatCount="indefinite" path="M80 13 L138 33" /></circle>
                <circle r="2.4" fill="#B642FF" opacity="0.8"><animateMotion dur="6s" begin="-3.2s" repeatCount="indefinite" path="M138 33 L80 87" /></circle>
              </svg>

              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "50%" }}>
                <div className="grid h-14 w-14 place-items-center rounded-full border border-ink/[0.08] bg-white shadow-[0_10px_24px_-8px_rgba(17,18,26,0.18)] sm:h-16 sm:w-16">
                  <ZelioLogo markClassName="h-7 w-7 sm:h-8 sm:w-8" wordmarkClassName="hidden" className="gap-0" />
                </div>
              </div>

              {AGENTS.map((a) => {
                const isHovered = hovered === a.id;
                const dimmed = hovered !== null && !isHovered;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onMouseEnter={() => setHovered(a.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(a.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setHovered((h) => (h === a.id ? null : a.id))}
                    aria-label={`${a.name}: ${a.current}. ${a.detail}`}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-electric-violet"
                    style={{
                      left: `${(a.x / 160) * 100}%`,
                      top: `${a.y}%`,
                      opacity: dimmed ? 0.35 : 1,
                      transform: `translate(-50%,-50%) scale(${isHovered ? 1.12 : 1})`,
                    }}
                  >
                    <span className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3" style={{ background: a.softBg, border: `1px solid ${a.border}`, boxShadow: isHovered ? `0 8px 20px -8px ${a.color}55` : "0 2px 6px rgba(17,18,26,0.05)" }}>
                      <span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: a.color }}>{a.icon}</span>
                      <span className="text-left leading-tight">
                        <span className="block text-[11px] font-bold text-ink">{a.name}</span>
                        <span className="block text-[10px] font-medium text-muted">{a.tasks}</span>
                      </span>
                    </span>

                    {isHovered && (
                      <span className="absolute bottom-[calc(100%+10px)] left-1/2 z-20 w-44 -translate-x-1/2 rounded-lg border border-ink/[0.08] bg-white px-3 py-2.5 text-left shadow-[0_12px_28px_-12px_rgba(17,18,26,0.22)]">
                        <span className="block text-[11px] font-extrabold uppercase tracking-wide" style={{ color: a.color }}>{a.name}</span>
                        <span className="mt-0.5 block text-[12px] font-semibold text-ink">{a.current}</span>
                        <span className="block text-[11px] text-muted">{a.detail}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-full border border-ink/[0.08] bg-white p-1.5 pl-2 shadow-[0_4px_16px_rgba(17,18,26,0.06)]">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist text-lg font-medium text-muted">+</span>
              <span className="flex-1 truncate text-[13px] text-muted">Tell your company what to do…</span>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-electric-violet to-plasma-purple text-white transition-transform duration-150 hover:scale-105 active:scale-95">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
