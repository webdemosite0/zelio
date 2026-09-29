const STEPS = [
  {
    n: "01",
    title: "Tell us your idea",
    copy: "Describe your business in a few words.",
    badgeBg: "#E7F2FF",
    badgeColor: "#258BFF",
    lineColor: "#BFE0FF",
  },
  {
    n: "02",
    title: "We assemble your team",
    copy: "ZELIO creates the perfect AI specialists for your needs.",
    badgeBg: "#F6E9FF",
    badgeColor: "#B642FF",
    lineColor: "#E3C2FF",
  },
  {
    n: "03",
    title: "They start working",
    copy: "Your team researches, builds, markets and executes.",
    badgeBg: "#FFEAF5",
    badgeColor: "#FF3E9D",
    lineColor: "#FFC9E2",
  },
  {
    n: "04",
    title: "You grow",
    copy: "Review results, give feedback, and watch your business scaling.",
    badgeBg: "#FFEEE7",
    badgeColor: "#FF7657",
    lineColor: "#FFD3C2",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        {/* Left: heading */}
        <div className="max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#E7F2FF] px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-electric-blue">
            <span className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            How it works
          </span>
          <h2 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            From idea
            <br />
            to execution
            <br />
            <span className="text-signature">in minutes.</span>
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-muted">
            ZELIO understands your idea, assembles the right AI team, and
            starts working on real deliverables — so you can move faster than
            ever.
          </p>
          <a
            href="#get-started"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-150 hover:scale-[1.03] active:scale-95"
          >
            See how it works
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>

        {/* Right: steps */}
        <ol className="relative space-y-2">
          {STEPS.map((s, i) => (
            <li key={s.n} className="relative flex gap-5 pb-8 last:pb-0">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[23px] top-[52px] h-[calc(100%-52px)] w-[2px]"
                  style={{ background: s.lineColor }}
                />
              )}
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[15px] font-extrabold"
                style={{ background: s.badgeBg, color: s.badgeColor }}
              >
                {s.n}
              </span>
              <div className="pt-1">
                <h3 className="text-[17px] font-bold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-1 max-w-sm text-[14px] leading-relaxed text-muted">
                  {s.copy}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
