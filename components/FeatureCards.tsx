type Card = {
  title: string;
  copy: string;
  tileBg: string;
  tileColor: string;
  icon: React.ReactNode;
};

const iconProps = {
  className: "h-6 w-6",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const CARDS: Card[] = [
  {
    title: "AI Team",
    copy: "Get a full team of specialists instantly.",
    tileBg: "#E7F2FF",
    tileColor: "#258BFF",
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z" />
      </svg>
    ),
  },
  {
    title: "Real Execution",
    copy: "They don't just talk. They research, create and build.",
    tileBg: "#FFEAF5",
    tileColor: "#FF3E9D",
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <path d="M12 15c5-4 7-9 7-13-4 0-9 2-13 7l-2 5 5-2 3 3z" />
        <circle cx="15" cy="9" r="1.6" />
        <path d="M9 15l-4 4M7 17l-2 5 5-2" />
      </svg>
    ),
  },
  {
    title: "All in One Place",
    copy: "Plan, track and manage your entire business.",
    tileBg: "#E9E7FF",
    tileColor: "#6157FF",
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
        <path d="M12 11L4 6.5M12 11l8-4.5M12 11v9" />
      </svg>
    ),
  },
  {
    title: "Built for Founders",
    copy: "From idea to revenue, faster than ever.",
    tileBg: "#FFF6E3",
    tileColor: "#E8A020",
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
      </svg>
    ),
  },
];

export default function FeatureCards() {
  return (
    <section id="product" className="bg-mist py-20 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {CARDS.map((c) => (
          <article
            key={c.title}
            className="group rounded-2xl border border-ink/[0.06] bg-white p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_44px_-16px_rgba(17,18,26,0.18)]"
          >
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-200 group-hover:scale-110"
              style={{ background: c.tileBg, color: c.tileColor }}
            >
              {c.icon}
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-ink">
              {c.title}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              {c.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
