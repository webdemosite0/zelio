/**
 * "Trusted by founders worldwide" strip — text wordmarks only, no image assets.
 */
export default function LogoStrip() {
  return (
    <section className="border-y border-ink/[0.06] bg-white py-10">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
        Trusted by founders worldwide
      </p>
      <div className="mx-auto mt-7 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-5 px-6 text-muted/90">
        <span className="text-[22px] font-extrabold lowercase tracking-tight">
          stripe
        </span>
        <span className="flex items-center gap-2 text-lg font-bold">
          <span className="grid h-6 w-6 place-items-center rounded-[6px] border-2 border-current text-[13px] font-black">
            N
          </span>
          Notion
        </span>
        <span className="text-lg font-semibold tracking-tight">Figma</span>
        <span className="flex items-center gap-1.5 text-lg font-bold">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 3l9 18H3l9-18z" />
          </svg>
          Vercel
        </span>
        <span className="text-lg font-semibold tracking-tight">Linear</span>
        <span className="text-lg font-bold tracking-tight">Slack</span>
        <span className="text-lg font-bold tracking-tight">GitHub</span>
      </div>
    </section>
  );
}
