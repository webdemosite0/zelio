import DashboardPreview from "./DashboardPreview";

const AVATARS = [
  { initials: "JK", bg: "linear-gradient(135deg,#258BFF,#6157FF)" },
  { initials: "AS", bg: "linear-gradient(135deg,#FF3E9D,#FF7657)" },
  { initials: "MR", bg: "linear-gradient(135deg,#25E6DA,#258BFF)" },
  { initials: "LT", bg: "linear-gradient(135deg,#FFCB45,#FF7657)" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Ambient light — kept deliberately faint for a calm, premium feel */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 top-32 h-[34rem] w-[34rem] rounded-full bg-hot-pink/[0.08] blur-3xl animate-blob-slow" />
        <div className="absolute -right-48 -top-10 h-[32rem] w-[32rem] rounded-full bg-aqua/[0.09] blur-3xl animate-blob-slower" />
        <div className="absolute left-1/3 top-72 h-[26rem] w-[26rem] rounded-full bg-electric-violet/[0.07] blur-3xl animate-blob-slow" />
        <div className="absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-solar-yellow/[0.08] blur-3xl animate-blob-slower" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-16 px-4 pb-24 pt-32 sm:px-6 md:pt-44 lg:grid-cols-[1.02fr_1fr] lg:items-center lg:gap-14">
        {/* Left: copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-ink/70">
            <span className="h-1.5 w-1.5 rounded-full bg-signature" />
            #1 AI Operating System for Founders
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-6xl xl:text-7xl">
            Build the company.
            <br />
            Skip the <span className="text-signature">headcount.</span>
          </h1>

          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted">
            Give ZELIO an idea. It assembles the team, plans the work, and
            starts building — while you focus on the big decisions.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#get-started"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:shadow-[0_14px_32px_-10px_rgba(17,18,26,0.45)] active:scale-[0.98]"
            >
              Build my company
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="#how-it-works"
              className="group inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white px-5 py-3.5 text-[15px] font-semibold text-ink transition-all duration-200 hover:border-ink/25 hover:shadow-[0_10px_24px_-10px_rgba(17,18,26,0.18)] active:scale-[0.98]"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-signature text-white">
                <svg
                  viewBox="0 0 24 24"
                  className="ml-0.5 h-3 w-3"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Watch it work
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {AVATARS.map((a) => (
                <span
                  key={a.initials}
                  className="grid h-9 w-9 place-items-center rounded-full text-[10px] font-bold text-white ring-2 ring-white"
                  style={{ background: a.bg }}
                >
                  {a.initials}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium text-muted">
              Loved by 10,000+ solo founders
            </p>
          </div>
        </div>

        {/* Right: product preview */}
        <div className="relative">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
